import { AppDataSource } from "../data-source";
import { StoreChannel } from "../entities/StoreChannel";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ override: true });

export class ChannelService {
    private channelRepository = AppDataSource.getRepository(StoreChannel);

    private getMetaConfig() {
        return {
            appId: process.env.META_APP_ID,
            appSecret: process.env.META_APP_SECRET,
            pageId: process.env.META_PAGE_ID,
            backendUrl: process.env.BACKEND_URL,
            graphApi: "https://graph.facebook.com/v18.0"
        };
    }

    async listChannels(storeId: string) {
        return await this.channelRepository.findBy({ store_id: storeId });
    }

    async connectChannel(storeId: string, body: any) {
        let channel = await this.channelRepository.findOneBy({
            store_id: storeId,
            channel: body.channel,
        });

        if (channel) {
            channel.external_id = body.external_id;
            channel.access_token = body.access_token;
            channel.is_active = true;
        } else {
            channel = this.channelRepository.create({
                store_id: storeId,
                channel: body.channel,
                external_id: body.external_id,
                access_token: body.access_token,
                is_active: true,
            });
        }

        return await this.channelRepository.save(channel);
    }

    async disconnectChannel(storeId: string, channelId: number) {
        const channel = await this.channelRepository.findOneBy({ id: channelId, store_id: storeId });
        if (channel) {
            channel.is_active = false;
            await this.channelRepository.save(channel);
        }
    }

    getInstagramConnectUrl(storeId: string, needsBusiness: boolean = false) {
        const config = this.getMetaConfig();
        const callbackUrl = `${config.backendUrl}/api/channels/instagram/callback`;
        const scopes = [
            "instagram_basic",
            "instagram_manage_messages",
            "instagram_manage_comments",
            "pages_show_list",
            "pages_manage_metadata",
        ];

        if (needsBusiness) {
            scopes.push("business_management");
        }

        const params = new URLSearchParams({
            client_id: config.appId!,
            redirect_uri: callbackUrl,
            scope: scopes.join(","),
            response_type: "code",
            state: storeId,
        });

        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    }

    private async getLongLivedToken(code: string, type: "instagram" | "facebook" | "whatsapp") {
        const config = this.getMetaConfig();
        const callbackUrl = `${config.backendUrl}/api/channels/${type}/callback`;

        // short lived
        const tokenResp = await axios.get(`${config.graphApi}/oauth/access_token`, {
            params: {
                client_id: config.appId,
                client_secret: config.appSecret,
                redirect_uri: callbackUrl,
                code,
            }
        });

        // long lived
        try {
            const llResp = await axios.get(`${config.graphApi}/oauth/access_token`, {
                params: {
                    grant_type: "fb_exchange_token",
                    client_id: config.appId,
                    client_secret: config.appSecret,
                    fb_exchange_token: tokenResp.data.access_token,
                }
            });
            return llResp.data.access_token;
        } catch (llErr: any) {
            console.warn("Could not exchange for long-lived token, using token from code exchange:", llErr.response?.data || llErr.message);
            return tokenResp.data.access_token;
        }
    }

    private async getPagesWithToken(accessToken: string) {
        const config = this.getMetaConfig();

        // 1. Try personal pages first
        const personalResp = await axios.get(`${config.graphApi}/me/accounts`, {
            params: {
                access_token: accessToken,
                fields: "access_token,name,id,instagram_business_account{id,username}"
            }
        });

        if (personalResp.data.data?.length > 0) {
            console.log("Found personal pages");
            return personalResp.data.data;
        }

        // 2. Fallback to business portfolio
        console.log("No personal pages, trying business portfolio...");

        let businessResp;
        try {
            businessResp = await axios.get(`${config.graphApi}/me/businesses`, {
                params: { access_token: accessToken }
            });
        } catch (err: any) {
            if (err.response?.status === 400) {
                throw new Error("BUSINESS_PORTFOLIO_REQUIRED");
            }
            throw err;
        }

        const businesses = businessResp.data.data;
        if (!businesses || businesses.length === 0) {
            throw new Error("No pages or business portfolios found.");
        }

        // 3. Get pages from businesses (checks first business, loops subsequent businesses if needed)
        for (const business of businesses) {
            try {
                const bizPagesResp = await axios.get(`${config.graphApi}/${business.id}/owned_pages`, {
                    params: {
                        access_token: accessToken,
                        fields: "access_token,name,id,instagram_business_account{id,username}"
                    }
                });

                if (bizPagesResp.data.data?.length > 0) {
                    console.log(`Found business portfolio pages in business ${business.id}`);
                    return bizPagesResp.data.data;
                }
            } catch (err: any) {
                console.warn(`Failed to fetch owned_pages for business ${business.id}:`, err.response?.data || err.message);
            }
        }

        throw new Error("No Facebook Pages found anywhere.");
    }

    async handleInstagramCallback(code: string, storeId: string) {
        const longToken = await this.getLongLivedToken(code, "instagram");

        // ✅ works for both personal and business
        const pages = await this.getPagesWithToken(longToken);

        // find page with IG linked
        let igAccountId, igUsername, pageToken, targetPage;
        for (const page of pages) {
            if (page.instagram_business_account) {
                targetPage = page;
                igAccountId = page.instagram_business_account.id;
                igUsername = page.instagram_business_account.username;
                pageToken = page.access_token;
                break;
            }
        }

        if (!igAccountId) {
            throw new Error("No Instagram Business Account found.");
        }

        await this.subscribePageToWebhooks(targetPage.id, pageToken);

        return await this.connectChannel(storeId, {
            channel: "instagram",
            external_id: igAccountId,
            access_token: pageToken,
            external_name: `@${igUsername}`,
        });
    }

    getFacebookConnectUrl(storeId: string, needsBusiness: boolean = false) {
        const config = this.getMetaConfig();
        const callbackUrl = `${config.backendUrl}/api/channels/facebook/callback`;
        const scopes = [
            "pages_show_list",
            "pages_messaging",             // FB DMs
            "pages_read_engagement",       // read comments
            "pages_manage_metadata",       // webhooks
        ];

        if (needsBusiness) {
            scopes.push("business_management");
        }

        const params = new URLSearchParams({
            client_id: config.appId!,
            redirect_uri: callbackUrl,
            scope: scopes.join(","),
            response_type: "code",
            state: storeId,
        });

        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    }

    async handleFacebookCallback(code: string, storeId: string) {
        const longToken = await this.getLongLivedToken(code, "facebook");

        // ✅ works for both personal and business
        const pages = await this.getPagesWithToken(longToken);

        const primaryPage = pages[0];

        await this.subscribePageToWebhooks(primaryPage.id, primaryPage.access_token);

        return await this.connectChannel(storeId, {
            channel: "facebook",
            external_id: primaryPage.id,
            access_token: primaryPage.access_token,
            external_name: primaryPage.name,
        });
    }

    private async subscribePageToWebhooks(pageId: string, pageToken: string) {
        const config = this.getMetaConfig();
        const url = `${config.graphApi}/${pageId}/subscribed_apps`;
        
        try {
            await axios.post(url, null, {
                params: {
                    // Subscribe to Messenger and Feed (feed includes FB comments, IG webhooks are routed automatically when page is subscribed)
                    subscribed_fields: "messages,messaging_postbacks,feed",
                    access_token: pageToken
                }
            });
            console.log(`✅ Successfully subscribed App to route live webhooks for Page ${pageId}!`);
        } catch (err: any) {
            console.error(`❌ Failed to subscribe app to Page ${pageId} webhooks:`, err.response?.data || err.message);
        }
    }

    getWhatsAppConnectUrl(storeId: string, needsBusiness: boolean = false) {
        const config = this.getMetaConfig();
        const callbackUrl = `${config.backendUrl}/api/channels/whatsapp/callback`;
        const configId = process.env.WHATSAPP_CONFIG_ID || "1619592073031155";

        if (configId) {
            const extras = JSON.stringify({
                version: "v4",
                sessionInfoVersion: "3",
                featureType: "whatsapp_business_app_onboarding",
            });

            const params = new URLSearchParams({
                client_id: config.appId!,
                config_id: configId,
                response_type: "code",
                override_default_response_type: "true",
                redirect_uri: callbackUrl,
                state: storeId,
                extras: extras,
            });

            return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
        }

        const scopes = [
            "whatsapp_business_management",
            "whatsapp_business_messaging",
        ];

        if (needsBusiness) {
            scopes.push("business_management");
        }

        const params = new URLSearchParams({
            client_id: config.appId!,
            redirect_uri: callbackUrl,
            scope: scopes.join(","),
            response_type: "code",
            state: storeId,
        });

        return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    }

    private async getWhatsAppPhoneNumberWithToken(accessToken: string) {
        const config = this.getMetaConfig();
        const appToken = `${config.appId}|${config.appSecret}`;

        // 1. Inspect Token via debug_token to find granular_scopes target_ids (Standard Embedded Signup method)
        try {
            const debugResp = await axios.get(`${config.graphApi}/debug_token`, {
                params: {
                    input_token: accessToken,
                    access_token: appToken,
                },
            });

            const granularScopes = debugResp.data?.data?.granular_scopes || [];
            console.log("Token granular scopes:", JSON.stringify(granularScopes, null, 2));

            const wabaScopes = granularScopes.filter((s: any) =>
                s.scope === "whatsapp_business_management" || s.scope === "whatsapp_business_messaging"
            );

            const targetIds: string[] = [];
            for (const s of wabaScopes) {
                if (Array.isArray(s.target_ids)) {
                    for (const tid of s.target_ids) {
                        if (!targetIds.includes(tid)) targetIds.push(tid);
                    }
                }
            }

            console.log("Found WABA Target IDs from token:", targetIds);

            let fallbackWabaId: string | null = null;
            for (const wabaId of targetIds) {
                fallbackWabaId = fallbackWabaId || wabaId;
                try {
                    let phoneResp;
                    try {
                        phoneResp = await axios.get(`${config.graphApi}/${wabaId}/phone_numbers`, {
                            params: {
                                access_token: accessToken,
                                fields: "id,display_phone_number,verified_name",
                            },
                        });
                    } catch (tokenErr: any) {
                        // Fallback to appToken if user token cannot read phone numbers
                        console.warn(`User token failed fetching phone numbers for WABA ${wabaId}, trying app token...`);
                        phoneResp = await axios.get(`${config.graphApi}/${wabaId}/phone_numbers`, {
                            params: {
                                access_token: appToken,
                                fields: "id,display_phone_number,verified_name",
                            },
                        });
                    }

                    const phones = phoneResp.data?.data || [];
                    if (phones.length > 0) {
                        console.log(`Found phone ${phones[0].display_phone_number} on WABA ${wabaId}`);
                        return {
                            id: phones[0].id,
                            display_phone_number: phones[0].display_phone_number,
                            verified_name: phones[0].verified_name,
                            wabaId: wabaId,
                        };
                    }
                } catch (phoneErr: any) {
                    console.warn(`Failed fetching phone numbers for WABA ${wabaId}:`, phoneErr.response?.data || phoneErr.message);
                }
            }

            if (fallbackWabaId) {
                return {
                    id: fallbackWabaId,
                    display_phone_number: null,
                    verified_name: "WhatsApp Account",
                    wabaId: fallbackWabaId,
                };
            }
        } catch (debugErr: any) {
            console.warn("Could not inspect debug_token:", debugErr.response?.data || debugErr.message);
        }

        // 2. Query businesses for owned_whatsapp_business_accounts and client_whatsapp_business_accounts
        let businesses: any[] = [];
        try {
            const bizResp = await axios.get(`${config.graphApi}/me/businesses`, {
                params: {
                    access_token: accessToken,
                    fields: "id,name,owned_whatsapp_business_accounts{id,name,phone_numbers{id,display_phone_number,verified_name}},client_whatsapp_business_accounts{id,name,phone_numbers{id,display_phone_number,verified_name}}",
                },
            });
            businesses = bizResp.data.data || [];
        } catch (err: any) {
            console.warn("Could not fetch businesses with WABAs:", err.response?.data || err.message);
        }

        for (const biz of businesses) {
            const wabas = [
                ...(biz.owned_whatsapp_business_accounts?.data || []),
                ...(biz.client_whatsapp_business_accounts?.data || []),
            ];

            for (const waba of wabas) {
                const phoneNumbers = waba.phone_numbers?.data || [];
                if (phoneNumbers.length > 0) {
                    return {
                        id: phoneNumbers[0].id,
                        display_phone_number: phoneNumbers[0].display_phone_number,
                        verified_name: phoneNumbers[0].verified_name || waba.name,
                        wabaId: waba.id,
                    };
                }

                try {
                    const phoneResp = await axios.get(`${config.graphApi}/${waba.id}/phone_numbers`, {
                        params: {
                            access_token: accessToken,
                            fields: "id,display_phone_number,verified_name",
                        },
                    });
                    const phones = phoneResp.data?.data || [];
                    if (phones.length > 0) {
                        return {
                            id: phones[0].id,
                            display_phone_number: phones[0].display_phone_number,
                            verified_name: phones[0].verified_name || waba.name,
                            wabaId: waba.id,
                        };
                    }
                } catch (e: any) {
                    // Continue
                }
            }
        }

        // 3. Direct edge check on each business
        for (const biz of businesses) {
            for (const edge of ["owned_whatsapp_business_accounts", "client_whatsapp_business_accounts"]) {
                try {
                    const edgeResp = await axios.get(`${config.graphApi}/${biz.id}/${edge}`, {
                        params: {
                            access_token: accessToken,
                            fields: "id,name,phone_numbers{id,display_phone_number,verified_name}",
                        },
                    });
                    const wabas = edgeResp.data?.data || [];
                    for (const waba of wabas) {
                        const phones = waba.phone_numbers?.data || [];
                        if (phones.length > 0) {
                            return {
                                id: phones[0].id,
                                display_phone_number: phones[0].display_phone_number,
                                verified_name: phones[0].verified_name || waba.name,
                                wabaId: waba.id,
                            };
                        }
                    }
                } catch (edgeErr: any) {
                    // Continue
                }
            }
        }

        throw new Error("BUSINESS_PORTFOLIO_REQUIRED");
    }

    private async subscribeWabaToWebhooks(wabaId: string, accessToken: string) {
        const config = this.getMetaConfig();
        const url = `${config.graphApi}/${wabaId}/subscribed_apps`;
        try {
            await axios.post(url, null, {
                params: { access_token: accessToken },
            });
            console.log(`✅ Successfully subscribed App to WhatsApp webhooks for WABA ${wabaId}!`);
        } catch (err: any) {
            console.warn(`User token failed to subscribe WABA ${wabaId} to webhooks, trying app token...`);
            try {
                const appToken = `${config.appId}|${config.appSecret}`;
                await axios.post(url, null, {
                    params: { access_token: appToken },
                });
                console.log(`✅ Successfully subscribed App to WhatsApp webhooks for WABA ${wabaId} using app token!`);
            } catch (appErr: any) {
                console.error(`❌ Failed to subscribe WABA ${wabaId} to webhooks:`, appErr.response?.data || appErr.message);
            }
        }
    }

    private async registerPhoneNumber(phoneNumberId: string, accessToken: string) {
        const config = this.getMetaConfig();
        const url = `${config.graphApi}/${phoneNumberId}/register`;
        try {
            await axios.post(
                url,
                { messaging_product: "whatsapp", pin: "123456" },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            console.log(`✅ Successfully registered phone number ${phoneNumberId} for WhatsApp Cloud API!`);
        } catch (err: any) {
            console.warn(`Could not register phone number ${phoneNumberId} (may already be registered):`, err.response?.data || err.message);
        }
    }

    async handleWhatsAppCallback(code: string, storeId: string) {
        const longToken = await this.getLongLivedToken(code, "whatsapp");
        const phone = await this.getWhatsAppPhoneNumberWithToken(longToken);

        if (phone.wabaId) {
            await this.subscribeWabaToWebhooks(phone.wabaId, longToken);
        }

        if (phone.id) {
            await this.registerPhoneNumber(phone.id, longToken);
        }

        return await this.connectChannel(storeId, {
            channel: "whatsapp",
            external_id: phone.id,
            access_token: longToken,
            external_name: phone.display_phone_number
                ? `${phone.display_phone_number} (${phone.verified_name || "WhatsApp"})`
                : phone.verified_name || "WhatsApp Business",
            config: {
                waba_id: phone.wabaId,
                phone_number_id: phone.id,
                display_phone_number: phone.display_phone_number,
                verified_name: phone.verified_name,
            },
        });
    }
}

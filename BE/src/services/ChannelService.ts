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

    private async getLongLivedToken(code: string, type: "instagram" | "facebook") {
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
        const llResp = await axios.get(`${config.graphApi}/oauth/access_token`, {
            params: {
                grant_type: "fb_exchange_token",
                client_id: config.appId,
                client_secret: config.appSecret,
                fb_exchange_token: tokenResp.data.access_token,
            }
        });

        return llResp.data.access_token;
    }

    private async getPagesWithToken(accessToken: string) {
        const config = this.getMetaConfig();

        // Debug permissions of this token
        try {
            const permResp = await axios.get(`${config.graphApi}/me/permissions`, {
                params: { access_token: accessToken }
            });
            console.log("DEBUG: /me/permissions response:", JSON.stringify(permResp.data));
        } catch (err: any) {
            console.error("DEBUG: Failed to fetch permissions:", err.message);
        }

        // 1. Try personal pages first
        const personalResp = await axios.get(`${config.graphApi}/me/accounts`, {
            params: {
                access_token: accessToken,
                fields: "access_token,name,id,instagram_business_account{id,username}"
            }
        });

        console.log("DEBUG: /me/accounts response:", JSON.stringify(personalResp.data));

        if (personalResp.data.data?.length > 0) {
            console.log("Found personal pages");
            return personalResp.data.data;
        }

        // 2. Check debug_token for granular scopes (Pages selected by user during OAuth)
        console.log("No personal pages in /me/accounts, checking granular_scopes via debug_token...");
        try {
            const appAccessToken = `${config.appId}|${config.appSecret}`;
            const debugResp = await axios.get(`${config.graphApi}/debug_token`, {
                params: {
                    input_token: accessToken,
                    access_token: appAccessToken
                }
            });
            console.log("DEBUG: /debug_token response:", JSON.stringify(debugResp.data));

            const granularScopes = debugResp.data.data?.granular_scopes || [];
            const targetPageIds = new Set<string>();

            for (const item of granularScopes) {
                if (item.target_ids && Array.isArray(item.target_ids)) {
                    for (const id of item.target_ids) {
                        targetPageIds.add(id);
                    }
                }
            }

            if (targetPageIds.size > 0) {
                console.log(`Found target IDs in granular_scopes: ${Array.from(targetPageIds).join(", ")}`);
                const pagesFromGranular: any[] = [];
                for (const pageId of targetPageIds) {
                    try {
                        let pageData: any = null;
                        try {
                            const pageResp = await axios.get(`${config.graphApi}/${pageId}`, {
                                params: {
                                    access_token: accessToken,
                                    fields: "access_token,name,id,instagram_business_account{id,username}"
                                }
                            });
                            console.log(`DEBUG: Target ${pageId} full response:`, JSON.stringify(pageResp.data));
                            pageData = pageResp.data;
                        } catch (fieldErr: any) {
                            console.log(`DEBUG: Full fields query failed for ${pageId}, attempting access_token only...`, fieldErr.response?.data?.error?.message || fieldErr.message);
                            const tokenResp = await axios.get(`${config.graphApi}/${pageId}`, {
                                params: {
                                    access_token: accessToken,
                                    fields: "access_token,id"
                                }
                            });
                            console.log(`DEBUG: Target ${pageId} token-only response:`, JSON.stringify(tokenResp.data));
                            if (tokenResp.data?.access_token) {
                                const pageToken = tokenResp.data.access_token;
                                try {
                                    const detailsResp = await axios.get(`${config.graphApi}/${pageId}`, {
                                        params: {
                                            access_token: pageToken,
                                            fields: "name,id,instagram_business_account{id,username}"
                                        }
                                    });
                                    pageData = {
                                        ...detailsResp.data,
                                        access_token: pageToken
                                    };
                                } catch (detailsErr: any) {
                                    pageData = {
                                        id: tokenResp.data.id,
                                        name: "Connected Page",
                                        access_token: pageToken
                                    };
                                }
                            }
                        }

                        if (pageData?.id) {
                            const pageToken = pageData.access_token || accessToken;
                            pagesFromGranular.push({
                                ...pageData,
                                access_token: pageToken,
                                name: pageData.name || `Page ${pageData.id}`
                            });
                        }
                    } catch (err: any) {
                        console.error(`DEBUG: Failed to query target ${pageId}:`, err.response?.data || err.message);
                    }
                }

                if (pagesFromGranular.length > 0) {
                    console.log(`Successfully resolved ${pagesFromGranular.length} page(s) from granular_scopes`);
                    return pagesFromGranular;
                }
            }
        } catch (err: any) {
            console.error("DEBUG: Failed to inspect debug_token:", err.response?.data || err.message);
        }

        // 3. Fallback to business portfolio
        console.log("No personal pages or granular targets, trying business portfolio...");

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

        // 3. Get pages from first business
        // (you can loop all businesses if needed)
        const businessId = businesses[0].id;

        const bizPagesResp = await axios.get(`${config.graphApi}/${businessId}/owned_pages`, {
            params: {
                access_token: accessToken,
                fields: "access_token,name,id,instagram_business_account{id,username}"
            }
        });

        if (bizPagesResp.data.data?.length > 0) {
            console.log("Found business portfolio pages");
            return bizPagesResp.data.data;
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
}

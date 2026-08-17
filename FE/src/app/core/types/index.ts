/**
 * Centralized TypeScript interfaces for API communication.
 * These mirror the Backend entities and DTOs.
 */

/* ------------------------------------------------------------------ */
/*  Auth & Store                                                       */
/* ------------------------------------------------------------------ */

export interface Store {
    id: string;
    name: string;
    slug: string;
    owner_email: string;
    owner_phone?: string;
    logo_url?: string;
    brand_voice?: string;
    welcome_message?: string;
    business_hours?: {
        start: string;
        end: string;
    };
    currency: string;
    timezone?: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
}

export interface AuthResponse {
    access_token: string;
}

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    sort_order: number;
}

export interface ProductMedia {
    id?: number;
    product_id?: number;
    media_type: "image" | "video";
    url: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order?: number;
}

export interface ProductVariant {
    id?: number;
    product_id?: number;
    sku: string;
    color?: string;
    size?: string;
    stock_quantity: number;
    low_stock_threshold: number;
    price_override?: number;
    is_active: boolean;
}

export interface Product {
    id: number;
    store_id: string;
    category_id: number | null;
    product_code: string;
    name: string;
    description: string | null;
    price: number;
    mrp: number | null;
    discount_type: "percentage" | "flat" | null;
    discount_value: number;
    final_price: number;
    metadata: Record<string, any>;
    is_active: boolean;
    category?: ProductCategory;
    media: ProductMedia[];
    variants: ProductVariant[];
}

export type ProductCreateDTO = Omit<Product, "id" | "store_id" | "final_price" | "category" | "media" | "variants"> & {
    media: Omit<ProductMedia, "id" | "product_id">[];
    variants: Omit<ProductVariant, "id" | "product_id">[];
};

/* ------------------------------------------------------------------ */
/*  Customers                                                          */
/* ------------------------------------------------------------------ */

export interface Customer {
    id: number;
    store_id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    insta_id: string | null;
    fb_psid: string | null;
    summary_bio: string | null;
    preferred_language: string;
    total_spend: number;
    order_count: number;
    active_cart: any[];
    active_context: any[];
    current_channel: string | null;
    merged_into: number | null;
    is_merged: boolean;
    last_interaction_at: string | null;
    created_at: string;
    updated_at: string;
    addresses?: CustomerAddress[];
    tags?: CustomerTag[];
}

export interface CustomerAddress {
    id: number;
    customer_id: number;
    label: string;
    full_name: string | null;
    phone: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    is_default: boolean;
    created_at: string;
}

export interface CustomerTag {
    id: number;
    store_id: string;
    customer_id: number;
    tag: string;
    source: string;
    created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export interface Order {
    id: number;
    store_id: string;
    customer_id: number;
    order_number: string;
    subtotal: number;
    discount_amount: number;
    shipping_charge: number;
    total_amount: number;
    coupon_id: number | null;
    shipping_address_snapshot: any;
    shipping_method: string | null;
    courier: string | null;
    tracking_id: string | null;
    tracking_url: string | null;
    estimated_delivery: string | null;
    dispatch_date: string | null;
    order_status: string;
    payment_status: string;
    payment_mode: string | null;
    source_channel: string | null;
    customer_notes: string | null;
    internal_notes: string | null;
    cancelled_at: string | null;
    cancel_reason: string | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    customer?: Customer;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    variant_id: number | null;
    product_name: string;
    sku: string;
    color: string | null;
    size: string | null;
    unit_price: number;
    quantity: number;
    created_at: string;
}

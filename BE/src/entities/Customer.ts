import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Store } from "./Store";

@Entity("customers")
export class Customer {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "uuid" })
    store_id: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    name: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    insta_id: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    fb_psid: string;

    @Column({ type: "text", nullable: true })
    summary_bio: string;

    @Column({ type: "varchar", length: 10, default: "en" })
    preferred_language: string;

    @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
    total_spend: number;

    @Column({ type: "integer", default: 0 })
    order_count: number;

    @Column({ type: "jsonb", default: [] })
    active_cart: any[];

    @Column({ type: "jsonb", default: [] })
    active_context: any[];

    @Column({ type: "varchar", length: 20, nullable: true })
    current_channel: string;

    @Column({ type: "bigint", nullable: true })
    merged_into: number;

    @Column({ type: "boolean", default: false })
    is_merged: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    last_interaction_at: Date;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @ManyToOne(() => Store, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store: Store;

    @OneToMany(() => CustomerAddress, (address) => address.customer)
    addresses: CustomerAddress[];

    @OneToMany(() => CustomerTag, (tag) => tag.customer)
    tags: CustomerTag[];


}

@Entity("customer_addresses")
export class CustomerAddress {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "bigint" })
    customer_id: number;

    @Column({ type: "varchar", length: 50, default: "home" })
    label: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    full_name: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone: string;

    @Column({ type: "text" })
    line1: string;

    @Column({ type: "text", nullable: true })
    line2: string;

    @Column({ type: "varchar", length: 100 })
    city: string;

    @Column({ type: "varchar", length: 100 })
    state: string;

    @Column({ type: "varchar", length: 10, })
    pincode: string;

    @Column({ type: "varchar", length: 50, default: "India" })
    country: string;

    @Column({ type: "boolean", default: false })
    is_default: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer: Customer;
}

@Entity("customer_tags")
export class CustomerTag {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column({ type: "uuid" })
    store_id: string;

    @Column({ type: "bigint" })
    customer_id: number;

    @Column({ type: "varchar", length: 50 })
    tag: string;

    @Column({ type: "varchar", length: 20, default: "ai" })
    source: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @ManyToOne(() => Customer, (customer) => customer.tags, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer: Customer;
}

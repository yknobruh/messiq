import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Store } from "./Store";

@Entity("store_subscriptions")
export class StoreSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", unique: true })
    store_id: string;

    @Column({ type: "varchar", length: 20, default: "free" })
    plan: string;

    @Column({ type: "integer", default: 500 })
    monthly_message_limit: number;

    @Column({ type: "integer", default: 0 })
    monthly_messages_used: number;

    @Column({ type: "integer", default: 50 })
    max_products: number;

    @Column({ type: "integer", default: 1 })
    max_team_members: number;

    @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
    price_per_month: number;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @OneToOne(() => Store, (store) => store.subscription, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store: Store;
}

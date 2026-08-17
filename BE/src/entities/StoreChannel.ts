import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Store } from "./Store";

@Entity("store_channels")
export class StoreChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid" })
    store_id: string;

    @Column({ type: "varchar", length: 20 })
    channel: string; // whatsapp | instagram | facebook

    @Column({ type: "varchar", length: 255 })
    external_id: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    external_name: string;

    @Column({ type: "text" })
    access_token: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    webhook_verify_token: string;

    @Column({ type: "jsonb", default: {} })
    config: any;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @CreateDateColumn({ type: "timestamp" })
    connected_at: Date;

    @Column({ type: "timestamp", nullable: true })
    token_expires_at: Date;

    @Column({ type: "timestamp", nullable: true })
    last_webhook_at: Date;

    @ManyToOne(() => Store, (store) => store.channels, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store: Store;
}

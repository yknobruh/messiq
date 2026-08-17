import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { StoreChannel } from "./StoreChannel";
import { StoreSubscription } from "./StoreSubscription";
import { StoreTeamMember } from "./StoreTeamMember";

@Entity("stores")
export class Store {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 100, unique: true })
    slug: string;

    @Column({ type: "varchar", length: 255, unique: true })
    owner_email: string;

    @Column({ type: "varchar", length: 20 })
    owner_phone: string;

    @Column({ type: "text" })
    password_hash: string;

    @Column({ type: "text", nullable: true })
    logo_url: string;

    @Column({ type: "text", default: "friendly and helpful" })
    brand_voice: string;

    @Column({ type: "text", default: "Hello! Thank you for reaching out. How can we help you today?" })
    welcome_message: string;

    @Column({ type: "jsonb", default: { "mon-sat": "10:00-20:00", sun: "closed" } })
    business_hours: any;

    @Column({ type: "varchar", length: 3, default: "INR" })
    currency: string;

    @Column({ type: "varchar", length: 50, default: "Asia/Kolkata" })
    timezone: string;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @Column({ type: "boolean", default: false })
    is_verified: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @OneToMany(() => StoreChannel, (channel) => channel.store)
    channels: StoreChannel[];

    @OneToOne(() => StoreSubscription, (subscription) => subscription.store)
    subscription: StoreSubscription;

    @OneToMany(() => StoreTeamMember, (member) => member.store)
    team_members: StoreTeamMember[];
}

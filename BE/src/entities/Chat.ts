import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Store } from "./Store";
import { Customer } from "./Customer";
import { StoreTeamMember } from "./StoreTeamMember";

@Entity("chat_sessions")
export class ChatSession {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({ type: "uuid" })
    store_id!: string;

    @Column({ type: "bigint" })
    customer_id!: number;

    @Column({ type: "varchar", length: 20 })
    channel!: string;

    @Column({ type: "varchar", length: 20, default: "active" })
    status!: string;

    @Column({ type: "text", nullable: true })
    intent_summary!: string | null;

    @Column({ type: "boolean", default: false })
    is_human_takeover!: boolean;

    @Column({ type: "bigint", nullable: true })
    taken_over_by!: number | null;

    @ManyToOne(() => StoreTeamMember)
    @JoinColumn({ name: "taken_over_by" })
    team_member!: StoreTeamMember;

    @Column({ type: "timestamp", nullable: true })
    taken_over_at!: Date | null;

    @Column({ type: "integer", default: 0 })
    message_count!: number;

    @Column({ type: "integer", nullable: true })
    first_response_ms!: number | null;

    @CreateDateColumn({ type: "timestamp" })
    started_at!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    last_message_at!: Date;

    @Column({ type: "timestamp", nullable: true })
    closed_at!: Date | null;

    @ManyToOne(() => Store, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store!: Store;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;
}

@Entity("chat_logs")
export class ChatLog {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({ type: "uuid" })
    store_id!: string;

    @Column({ type: "bigint" })
    customer_id!: number;

    @Column({ type: "bigint", nullable: true })
    session_id!: number | null;

    @Column({ type: "varchar", length: 10 })
    direction!: string; // inbound | outbound

    @Column({ type: "varchar", length: 10, default: "customer" })
    sender_type!: string; // customer | ai | human

    @Column({ type: "varchar", length: 20, default: "text" })
    message_type!: string;

    @Column({ type: "text", nullable: true })
    message_text!: string | null;

    @Column({ type: "text", nullable: true })
    media_url!: string | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    intent_detected!: string | null;

    @Column({ type: "numeric", precision: 3, scale: 2, nullable: true })
    confidence_score!: number | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    tool_used!: string | null;

    @Column({ type: "integer", nullable: true })
    tokens_used!: number | null;

    @Column({ type: "text", nullable: true })
    external_msg_id!: string | null;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @ManyToOne(() => Store, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store!: Store;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;

    @ManyToOne(() => ChatSession, { onDelete: "SET NULL" })
    @JoinColumn({ name: "session_id" })
    session!: ChatSession;
}

@Entity("webhook_events")
export class WebhookEvent {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({ type: "uuid", nullable: true })
    store_id!: string | null;

    @Column({ type: "varchar", length: 20 })
    channel!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    event_type!: string | null;

    @Column({ type: "jsonb" })
    raw_payload!: any;

    @Column({ type: "text", nullable: true })
    signature!: string | null;

    @Column({ type: "boolean", default: false })
    processed!: boolean;

    @Column({ type: "text", nullable: true })
    processing_error!: string | null;

    @Column({ type: "integer", default: 0 })
    retry_count!: number;

    @Column({ type: "integer", default: 3 })
    max_retries!: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @Column({ type: "timestamp", nullable: true })
    processed_at!: Date | null;

    @ManyToOne(() => Store, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store!: Store;
}

@Entity("escalations")
export class Escalation {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({ type: "uuid" })
    store_id!: string;

    @Column({ type: "bigint" })
    customer_id!: number;

    @Column({ type: "bigint", nullable: true })
    session_id!: number | null;

    @Column({ type: "varchar", length: 20 })
    channel!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    reason!: string | null;

    @Column({ type: "jsonb", nullable: true })
    conversation_snapshot!: any;

    @Column({ type: "bigint", nullable: true })
    assigned_to!: number | null;

    @Column({ type: "varchar", length: 10, default: "normal" })
    priority!: string;

    @Column({ type: "varchar", length: 20, default: "open" })
    status!: string;

    @Column({ type: "text", nullable: true })
    resolution_note!: string | null;

    @Column({ type: "timestamp", nullable: true })
    resolved_at!: Date | null;

    @Column({ type: "bigint", nullable: true })
    resolved_by!: number | null;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @ManyToOne(() => Store, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store!: Store;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;

    @ManyToOne(() => ChatSession, { onDelete: "SET NULL" })
    @JoinColumn({ name: "session_id" })
    session!: ChatSession;

    @ManyToOne(() => StoreTeamMember)
    @JoinColumn({ name: "assigned_to" })
    assigned_staff!: StoreTeamMember;

    @ManyToOne(() => StoreTeamMember)
    @JoinColumn({ name: "resolved_by" })
    resolver_staff!: StoreTeamMember;
}

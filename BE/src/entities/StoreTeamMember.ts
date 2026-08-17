import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Store } from "./Store";

@Entity("store_team_members")
export class StoreTeamMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid" })
    store_id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "text" })
    password_hash: string;

    @Column({ type: "varchar", length: 20, default: "agent" })
    role: string; // owner | admin | agent

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @Column({ type: "timestamp", nullable: true })
    last_login_at: Date;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @ManyToOne(() => Store, (store) => store.team_members, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_id" })
    store: Store;
}

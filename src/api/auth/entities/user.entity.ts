import { Profile } from 'src/api/profile/entities/profile.entity';
import { UserRole } from 'src/common/model/roles.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 't_users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'c_lastname', nullable: true })
    lastName: string;

    @Column({ name: 'c_firstname', nullable: true })
    firstName: string;

    @Column({ name: 'c_email', unique: true })
    email: string;

    @Column({ name: 'c_hash', unique: true })
    hash: string;

    @Column({ name: 'c_refreshToken', nullable: true })
    refreshToken?: string;

    @CreateDateColumn({ name: 'c_created_at', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ name: 'c_updated_at', nullable: true })
    updatedAt: Date;

    @Column({ name: 'c_role', type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @OneToOne(() => Profile, profile => profile.user, { cascade: true })
    @JoinColumn()
    profile?: Profile;
}

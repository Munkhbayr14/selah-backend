import { User } from 'src/api/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 't_profile' })
export class Profile {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @OneToOne(() => User, user => user.profile)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @Column({ name: 'c_lastname', nullable: true })
    lastName?: string;

    @Column({ name: 'c_firstname', nullable: true })
    firstName?: string;

    @Column({ name: 'c_email', nullable: true })
    email?: string;

    @Column({ name: 'c_avatar_url', nullable: true })
    avatarUrl?: string;
}

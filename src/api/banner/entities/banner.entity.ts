import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 't_banner' })
export class Banner {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'c_title' })
    title: string;

    @Column({ name: 'c_description' })
    description: string;

    @Column({ name: 'c_image' })
    image: string;

    @CreateDateColumn({ name: 'c_created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'c_updated_at' })
    updatedAt: Date;
}

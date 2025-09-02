import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 't_music' })
export class Music {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'c_title' })
    title: string;

    @Column({ name: 'c_music_url', nullable: true })
    musicUrl?: string;

    @Column({ name: 'c_file', nullable: true })
    file?: string;

    @Column({ name: 'c_saffron', nullable: true })
    saffron?: string;

    @Column({ name: 'c_alto', nullable: true })
    alto?: string;

    @Column({ name: 'c_tenor', nullable: true })
    tenor?: string;

    @Column({ name: 'c_bass', nullable: true })
    bass?: string;

    @CreateDateColumn({ name: 'c_created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'c_updated_at' })
    updatedAt: Date;
}

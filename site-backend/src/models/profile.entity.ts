import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: "profiles" })
export class Profile {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 500 })
    bio: string;

    @OneToOne(() => User, user => user.profile, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

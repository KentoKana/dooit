import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: "users" })
export class User {
    @PrimaryColumn()
    id: string;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ length: 200 })
    email: string;

    @OneToOne(() => Profile, profile => profile.user, { cascade: true })
    profile: Profile

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

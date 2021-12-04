import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Project } from './project.entity';

@Entity({ name: "users" })
export class User {
    @PrimaryColumn()
    id: string;

    @Column({ length: 100 })
    displayName: string;

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

    @OneToMany(() => Project, project => project.user, { cascade: true })
    project: Project[]
}

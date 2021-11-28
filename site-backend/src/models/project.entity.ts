import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Flair } from './flair.entity';
import { ProjectItem } from './projectItem.entity';
import { User } from './user.entity';

@Entity({ name: "projects" })
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column()
    flairId: number;

    @Column({ length: 800 })
    description: string;

    @ManyToOne(() => User, user => user.project, { onDelete: "CASCADE" })
    user: User;

    @OneToMany(() => ProjectItem, projectItem => projectItem.project, { cascade: true })
    projectItems: ProjectItem[];

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

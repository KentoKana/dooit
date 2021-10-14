import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProjectItem } from './projectItem.entity';
import { User } from './user.entity';

@Entity({ name: "projects" })
export class Project {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 500 })
    name: string;

    @ManyToOne(() => User, user => user.project, { onDelete: "CASCADE" })
    user: User;

    @OneToMany(() => ProjectItem, projectItem => projectItem.project, { cascade: true })
    projectItems: ProjectItem[];

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

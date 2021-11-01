import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: "project_items" })
export class ProjectItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    heading?: string;

    @Column()
    imageUrl?: string;

    @Column()
    imageAlt?: string;

    @Column()
    order?: number;

    @Column({ length: 1000 })
    description?: string

    @ManyToOne(() => Project, project => project.projectItems, { onDelete: "CASCADE" })
    project: Project;

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

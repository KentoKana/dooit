import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ImageTag } from './imageTag.entity';
import { Project } from './project.entity';

@Entity({ name: "project_items" })
export class ProjectItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    heading?: string;

    @Column({ type: "text" })
    imageUrl?: string;

    @Column({ length: 400 })
    imageAlt?: string;

    @Column()
    order?: number;

    @Column({ length: 1000 })
    description?: string

    @ManyToOne(() => Project, project => project.projectItems, { onDelete: "CASCADE" })
    project: Project;

    @OneToMany(() => ImageTag, tag => tag.projectItem, { cascade: true })
    imageTags: ImageTag[]

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

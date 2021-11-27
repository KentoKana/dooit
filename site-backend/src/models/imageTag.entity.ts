import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectItem } from './projectItem.entity';

@Entity({ name: "image_tags" })
export class ImageTag {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    url?: string;

    @Column()
    width?: number;

    @Column()
    xCoordinate?: number;

    @Column()
    yCoordinate?: number;

    @ManyToOne(() => ProjectItem, item => item.imageTags, { onDelete: "CASCADE" })
    projectItem: ProjectItem;

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified?: Date;
}

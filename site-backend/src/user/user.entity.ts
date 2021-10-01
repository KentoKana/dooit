import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: "users" })
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified: Date;
}

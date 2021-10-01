import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

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

    @CreateDateColumn()
    dateCreated: Date;

    @Column()
    dateModified: Date;
}

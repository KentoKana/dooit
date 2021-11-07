import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity({ name: "flairs" })
export class Flair {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    flairLabel: string;

    @Column({ length: 100 })
    backgroundColor: string;

    @Column()
    isDarkText: boolean;
}

import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmailToUser1633071341672 implements MigrationInterface {
    name = 'AddEmailToUser1633071341672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`email\``);
    }

}

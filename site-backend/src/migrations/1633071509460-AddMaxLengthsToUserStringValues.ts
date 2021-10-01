import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMaxLengthsToUserStringValues1633071509460 implements MigrationInterface {
    name = 'AddMaxLengthsToUserStringValues1633071509460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`firstName\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`lastName\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`email\` varchar(200) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`lastName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`users\` ADD \`firstName\` varchar(255) NOT NULL`);
    }

}

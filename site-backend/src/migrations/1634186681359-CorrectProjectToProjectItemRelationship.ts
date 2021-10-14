import {MigrationInterface, QueryRunner} from "typeorm";

export class CorrectProjectToProjectItemRelationship1634186681359 implements MigrationInterface {
    name = 'CorrectProjectToProjectItemRelationship1634186681359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_0465da6d4649a5defdeb023ac62\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP COLUMN \`projectItemsId\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_361a53ae58ef7034adc3c06f09f\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD CONSTRAINT \`FK_075bc125384418c6da0a624d808\` FOREIGN KEY (\`projectId\`) REFERENCES \`doo\`.\`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_361a53ae58ef7034adc3c06f09f\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_361a53ae58ef7034adc3c06f09f\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP FOREIGN KEY \`FK_075bc125384418c6da0a624d808\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_361a53ae58ef7034adc3c06f09f\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD \`projectItemsId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_0465da6d4649a5defdeb023ac62\` FOREIGN KEY (\`projectItemsId\`) REFERENCES \`doo\`.\`project_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

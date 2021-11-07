import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMetaDataTablesForProject1636261661512 implements MigrationInterface {
    name = 'AddMetaDataTablesForProject1636261661512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`doo\`.\`flairs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`flairLabel\` varchar(500) NOT NULL, \`backgroundColor\` varchar(100) NOT NULL, \`isDarkText\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD \`flairId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD UNIQUE INDEX \`IDX_0ef8601acfe2cb4634753d4d2d\` (\`flairId\`)`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP FOREIGN KEY \`FK_075bc125384418c6da0a624d808\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` CHANGE \`projectId\` \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_361a53ae58ef7034adc3c06f09f\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0ef8601acfe2cb4634753d4d2d\` ON \`doo\`.\`projects\` (\`flairId\`)`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD CONSTRAINT \`FK_075bc125384418c6da0a624d808\` FOREIGN KEY (\`projectId\`) REFERENCES \`doo\`.\`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_0ef8601acfe2cb4634753d4d2de\` FOREIGN KEY (\`flairId\`) REFERENCES \`doo\`.\`flairs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_361a53ae58ef7034adc3c06f09f\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_361a53ae58ef7034adc3c06f09f\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_0ef8601acfe2cb4634753d4d2de\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP FOREIGN KEY \`FK_075bc125384418c6da0a624d808\``);
        await queryRunner.query(`DROP INDEX \`REL_0ef8601acfe2cb4634753d4d2d\` ON \`doo\`.\`projects\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_361a53ae58ef7034adc3c06f09f\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` CHANGE \`projectId\` \`projectId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD CONSTRAINT \`FK_075bc125384418c6da0a624d808\` FOREIGN KEY (\`projectId\`) REFERENCES \`doo\`.\`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP INDEX \`IDX_0ef8601acfe2cb4634753d4d2d\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP COLUMN \`flairId\``);
        await queryRunner.query(`DROP TABLE \`doo\`.\`flairs\``);
    }

}

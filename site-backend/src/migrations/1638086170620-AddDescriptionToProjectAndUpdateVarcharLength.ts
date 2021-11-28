import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDescriptionToProjectAndUpdateVarcharLength1638086170620 implements MigrationInterface {
    name = 'AddDescriptionToProjectAndUpdateVarcharLength1638086170620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_361a53ae58ef7034adc3c06f09f\` ON \`doo\`.\`projects\``);
        await queryRunner.query(`DROP INDEX \`FK_075bc125384418c6da0a624d808\` ON \`doo\`.\`project_items\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD \`imageUrl\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP COLUMN \`imageAlt\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD \`imageAlt\` varchar(400) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` CHANGE \`projectId\` \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` DROP FOREIGN KEY \`FK_58a87cd13b9b3f0219c99731fff\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` ADD \`title\` varchar(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` DROP COLUMN \`url\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` ADD \`url\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` CHANGE \`projectItemId\` \`projectItemId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_361a53ae58ef7034adc3c06f09f\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD CONSTRAINT \`FK_075bc125384418c6da0a624d808\` FOREIGN KEY (\`projectId\`) REFERENCES \`doo\`.\`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` ADD CONSTRAINT \`FK_58a87cd13b9b3f0219c99731fff\` FOREIGN KEY (\`projectItemId\`) REFERENCES \`doo\`.\`project_items\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` DROP FOREIGN KEY \`FK_58a87cd13b9b3f0219c99731fff\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP FOREIGN KEY \`FK_075bc125384418c6da0a624d808\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_361a53ae58ef7034adc3c06f09f\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` CHANGE \`projectItemId\` \`projectItemId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` DROP COLUMN \`url\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` ADD \`url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` ADD \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`image_tags\` ADD CONSTRAINT \`FK_58a87cd13b9b3f0219c99731fff\` FOREIGN KEY (\`projectItemId\`) REFERENCES \`doo\`.\`project_items\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` CHANGE \`projectId\` \`projectId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP COLUMN \`imageAlt\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` ADD \`imageAlt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`project_items\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`CREATE INDEX \`FK_075bc125384418c6da0a624d808\` ON \`doo\`.\`project_items\` (\`projectId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_361a53ae58ef7034adc3c06f09f\` ON \`doo\`.\`projects\` (\`userId\`)`);
    }

}

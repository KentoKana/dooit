import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProjectsTable1634185632643 implements MigrationInterface {
    name = 'AddProjectsTable1634185632643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`CREATE TABLE \`doo\`.\`projectItems\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(500) NOT NULL, \`imageUrl\` varchar(255) NOT NULL, \`imageAlt\` varchar(255) NOT NULL, \`description\` varchar(1000) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doo\`.\`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime NOT NULL, \`userId\` varchar(255) NULL, \`projectItemsId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_361a53ae58ef7034adc3c06f09f\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` ADD CONSTRAINT \`FK_0465da6d4649a5defdeb023ac62\` FOREIGN KEY (\`projectItemsId\`) REFERENCES \`doo\`.\`projectItems\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_0465da6d4649a5defdeb023ac62\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`projects\` DROP FOREIGN KEY \`FK_361a53ae58ef7034adc3c06f09f\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` CHANGE \`userId\` \`userId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`doo\`.\`projects\``);
        await queryRunner.query(`DROP TABLE \`doo\`.\`projectItems\``);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

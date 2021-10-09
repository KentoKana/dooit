import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserAndProfileTable1633801307349 implements MigrationInterface {
    name = 'CreateUserAndProfileTable1633801307349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`doo\`.\`users\` (\`id\` varchar(255) NOT NULL, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`email\` varchar(200) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doo\`.\`profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bio\` varchar(500) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime NOT NULL, \`userId\` varchar(255) NULL, UNIQUE INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`doo\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doo\`.\`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`DROP INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` ON \`doo\`.\`profiles\``);
        await queryRunner.query(`DROP TABLE \`doo\`.\`profiles\``);
        await queryRunner.query(`DROP TABLE \`doo\`.\`users\``);
    }

}

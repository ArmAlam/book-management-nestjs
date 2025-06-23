import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750656451249 implements MigrationInterface {
    name = 'InitialMigration1750656451249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "author" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "bio" varchar, "birthDate" date, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "isbn" varchar NOT NULL, "publishedDate" date, "genre" varchar, "authorId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"))`);
        await queryRunner.query(`CREATE TABLE "temporary_book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "isbn" varchar NOT NULL, "publishedDate" date, "genre" varchar, "authorId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"), CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2" FOREIGN KEY ("authorId") REFERENCES "author" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_book"("id", "title", "isbn", "publishedDate", "genre", "authorId", "createdAt", "updatedAt") SELECT "id", "title", "isbn", "publishedDate", "genre", "authorId", "createdAt", "updatedAt" FROM "book"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`ALTER TABLE "temporary_book" RENAME TO "book"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" RENAME TO "temporary_book"`);
        await queryRunner.query(`CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "isbn" varchar NOT NULL, "publishedDate" date, "genre" varchar, "authorId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"))`);
        await queryRunner.query(`INSERT INTO "book"("id", "title", "isbn", "publishedDate", "genre", "authorId", "createdAt", "updatedAt") SELECT "id", "title", "isbn", "publishedDate", "genre", "authorId", "createdAt", "updatedAt" FROM "temporary_book"`);
        await queryRunner.query(`DROP TABLE "temporary_book"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "author"`);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedProfile1630235214035 implements MigrationInterface {
  name = 'updatedProfile1630235214035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "records" ("id" character varying NOT NULL, "insertDate" TIMESTAMP NOT NULL, "productName" text NOT NULL, "productVersion" text NOT NULL, "productType" text NOT NULL, "description" text, "creationDate" TIMESTAMP, "sourceDateStart" TIMESTAMP, "sourceDateEnd" TIMESTAMP, "minResolutionMeter" numeric, "maxResolutionMeter" numeric, "minResolutionDeg" numeric, "maxResolutionDeg" numeric, "nominalResolution" text, "minAccuracyCE90" numeric NOT NULL, "maxAccuracyCE90" numeric NOT NULL, "accuracyLE90" numeric NOT NULL, "accuracysE90" numeric, "relativeAccuracyLE90" numeric, "visualAccuracy" numeric, "sensors" text NOT NULL, "footprint" text, "heightRangeFrom" numeric, "heightRangeTo" numeric, "srsId" bigint NOT NULL, "srsName" text NOT NULL, "srsOrigin" text, "region" text NOT NULL, "classification" text NOT NULL, "compartmentalization" text, "productionSystem" text NOT NULL, "productionSystemVer" text NOT NULL, "producerName" text NOT NULL, "productionMethod" text, "minFlightAlt" numeric, "maxFlightAlt" numeric, "geographicArea" text, "links" text NOT NULL, "boundingBox" text NOT NULL, "type" text NOT NULL, "typeName" text NOT NULL, "schema" text NOT NULL, "mdSource" text NOT NULL, "xml" text NOT NULL, "anytext" text NOT NULL, "keywords" text NOT NULL, "recordUpdateDate" TIMESTAMP, "anytext_tsvector" tsvector, "wkb_geometry" geometry(Geometry,4326), CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "records_fts_gin_idx" ON "records" ("anytext_tsvector") `);
    await queryRunner.query(`CREATE INDEX "records_wkb_geometry_idx" ON "records" USING GiST ("wkb_geometry") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "records_wkb_geometry_idx"`);
    await queryRunner.query(`DROP INDEX "records_fts_gin_idx"`);
    await queryRunner.query(`DROP TABLE "records"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedProfile1630235214035 implements MigrationInterface {
  name = 'updatedProfile1630235214035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "records" ("id" character varying NOT NULL, "insert_date" TIMESTAMP NOT NULL, "product_name" text NOT NULL, "product_version" text NOT NULL, "product_type" text NOT NULL, "description" text, "creation_date" TIMESTAMP, "source_start_date" TIMESTAMP, "source_end_date" TIMESTAMP, "min_resolution_meter" numeric, "max_resolution_meter" numeric, "min_resolution_deg" numeric, "max_resolution_deg" numeric, "nominal_resolution" text, "accuracy_SE90" numeric, "min_accuracy_CE90" numeric NOT NULL, "max_accuracy_CE90" numeric NOT NULL, "accuracy_LE90" numeric NOT NULL, "accuracy_E90" numeric, "relative_accuracy_LE90" numeric, "visual_accuracy" numeric, "sensor_type" text, "footprint" text, "height_range_from" numeric, "height_range_to" numeric, "srs_id" integer NOT NULL, "srs_name" text NOT NULL, "srs_origin" text, "region" text NOT NULL, "classification" text NOT NULL, "compartmentalization" text, "production_system" text NOT NULL, "production_system_ver" text NOT NULL, "producer_name" text NOT NULL, "production_method" text, "min_flight_alt" numeric, "max_flight_alt" numeric, "geographic_area" text, "links" text NOT NULL, "bounding_box" text NOT NULL, "type" text NOT NULL, "type_name" text NOT NULL, "schema" text NOT NULL, "md_source" text NOT NULL, "xml" text NOT NULL, "anytext" text NOT NULL, "keywords" text NOT NULL, "record_update_date" TIMESTAMP, "anytext_tsvector" tsvector, "wkb_geometry" geometry(Geometry,4326), CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id"))`
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

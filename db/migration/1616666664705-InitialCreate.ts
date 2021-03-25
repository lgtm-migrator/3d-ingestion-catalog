import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCreate1616666664705 implements MigrationInterface {
  public name = 'InitialCreate1616666664705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "records" (
                "identifier" character varying NOT NULL, 
                "typename" character varying NOT NULL, 
                "schema" character varying NOT NULL, 
                "mdsource" character varying NOT NULL, 
                "xml" character varying NOT NULL, 
                "anytext" character varying NOT NULL, 
                "wkt_geometry" character varying NOT NULL, 
                "title" character varying NOT NULL, 
                "producer_name" character varying NOT NULL DEFAULT 'IDFMU', 
                "description" character varying NOT NULL, 
                "insert_date" TIMESTAMP NOT NULL, 
                "creation_date" TIMESTAMP NOT NULL, 
                "validation_date" TIMESTAMP NOT NULL, 
                "type" character varying NOT NULL, 
                "classification" character varying NOT NULL, 
                "srs" character varying NOT NULL, 
                "project_name" character varying NOT NULL, 
                "version" character varying NOT NULL, 
                "centroid" character varying NOT NULL, 
                "footprint" character varying NOT NULL, 
                "time_begin" TIMESTAMP NOT NULL, 
                "time_end" TIMESTAMP NOT NULL, 
                "sensor_type" json NOT NULL, 
                "region" character varying NOT NULL, 
                "nominal_resolution" character varying NOT NULL, 
                "accuracy_le_90" character varying NOT NULL, 
                "horizontal_accuracy_ce_90" character varying NOT NULL, 
                "relative_accuracy_le_90" character varying NOT NULL, 
                "estimated_precision" character varying NOT NULL, 
                "measured_precision" character varying NOT NULL, 
                "links" character varying NOT NULL, 
                "anytext_tsvector" character varying NOT NULL, 
                "wkb_geometry" character varying NOT NULL, 
                CONSTRAINT "PK_2853dfd49850d5f439dfc462cd0" PRIMARY KEY ("identifier")
            )`
    );
    await queryRunner.query(`CREATE INDEX "ix_records_typename" ON "records" ("typename") `);
    await queryRunner.query(`CREATE INDEX "ix_records_schema" ON "records" ("schema") `);
    await queryRunner.query(`CREATE INDEX "ix_records_mdsource" ON "records" ("mdsource") `);
    await queryRunner.query(`CREATE INDEX "ix_records_wkt_geometry" ON "records" ("wkt_geometry") `);
    await queryRunner.query(`CREATE INDEX "ix_records_title" ON "records" ("title") `);
    await queryRunner.query(`CREATE INDEX "ix_records_producer_name" ON "records" ("producer_name") `);
    await queryRunner.query(`CREATE INDEX "ix_records_description" ON "records" ("description") `);
    await queryRunner.query(`CREATE INDEX "ix_records_insert_date" ON "records" ("insert_date") `);
    await queryRunner.query(`CREATE INDEX "ix_records_creation_date" ON "records" ("creation_date") `);
    await queryRunner.query(`CREATE INDEX "ix_records_validation_date" ON "records" ("validation_date") `);
    await queryRunner.query(`CREATE INDEX "ix_records_type" ON "records" ("type") `);
    await queryRunner.query(`CREATE INDEX "ix_records_classification" ON "records" ("classification") `);
    await queryRunner.query(`CREATE INDEX "ix_records_srs" ON "records" ("srs") `);
    await queryRunner.query(`CREATE INDEX "ix_records_project_name" ON "records" ("project_name") `);
    await queryRunner.query(`CREATE INDEX "ix_records_version" ON "records" ("version") `);
    await queryRunner.query(`CREATE INDEX "ix_records_centroid" ON "records" ("centroid") `);
    await queryRunner.query(`CREATE INDEX "ix_records_footprint" ON "records" ("footprint") `);
    await queryRunner.query(`CREATE INDEX "ix_records_time_begin" ON "records" ("time_begin") `);
    await queryRunner.query(`CREATE INDEX "ix_records_time_end" ON "records" ("time_end") `);
    await queryRunner.query(`CREATE INDEX "ix_records_sensor_type" ON "records" ("sensor_type") `);
    await queryRunner.query(`CREATE INDEX "ix_records_region" ON "records" ("region") `);
    await queryRunner.query(`CREATE INDEX "ix_records_nominal_resolution" ON "records" ("nominal_resolution") `);
    await queryRunner.query(`CREATE INDEX "ix_records_accuracy_le_90" ON "records" ("accuracy_le_90") `);
    await queryRunner.query(`CREATE INDEX "ix_records_horizontal_accuracy_ce_90" ON "records" ("horizontal_accuracy_ce_90") `);
    await queryRunner.query(`CREATE INDEX "ix_records_relative_accuracy_le_90" ON "records" ("relative_accuracy_le_90") `);
    await queryRunner.query(`CREATE INDEX "ix_records_estimated_precision" ON "records" ("estimated_precision") `);
    await queryRunner.query(`CREATE INDEX "ix_records_measured_precision" ON "records" ("measured_precision") `);
    await queryRunner.query(`CREATE INDEX "ix_records_links" ON "records" ("links") `);
    await queryRunner.query(`CREATE INDEX "ix_records_anytext_tsvector" ON "records" ("anytext_tsvector") `);
    await queryRunner.query(`CREATE INDEX "ix_records_wkb_geometry" ON "records" ("wkb_geometry") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "ix_records_wkb_geometry"`);
    await queryRunner.query(`DROP INDEX "ix_records_anytext_tsvector"`);
    await queryRunner.query(`DROP INDEX "ix_records_links"`);
    await queryRunner.query(`DROP INDEX "ix_records_measured_precision"`);
    await queryRunner.query(`DROP INDEX "ix_records_estimated_precision"`);
    await queryRunner.query(`DROP INDEX "ix_records_relative_accuracy_le_90"`);
    await queryRunner.query(`DROP INDEX "ix_records_horizontal_accuracy_ce_90"`);
    await queryRunner.query(`DROP INDEX "ix_records_accuracy_le_90"`);
    await queryRunner.query(`DROP INDEX "ix_records_nominal_resolution"`);
    await queryRunner.query(`DROP INDEX "ix_records_region"`);
    await queryRunner.query(`DROP INDEX "ix_records_sensor_type"`);
    await queryRunner.query(`DROP INDEX "ix_records_time_end"`);
    await queryRunner.query(`DROP INDEX "ix_records_time_begin"`);
    await queryRunner.query(`DROP INDEX "ix_records_footprint"`);
    await queryRunner.query(`DROP INDEX "ix_records_centroid"`);
    await queryRunner.query(`DROP INDEX "ix_records_version"`);
    await queryRunner.query(`DROP INDEX "ix_records_project_name"`);
    await queryRunner.query(`DROP INDEX "ix_records_srs"`);
    await queryRunner.query(`DROP INDEX "ix_records_classification"`);
    await queryRunner.query(`DROP INDEX "ix_records_type"`);
    await queryRunner.query(`DROP INDEX "ix_records_validation_date"`);
    await queryRunner.query(`DROP INDEX "ix_records_creation_date"`);
    await queryRunner.query(`DROP INDEX "ix_records_insert_date"`);
    await queryRunner.query(`DROP INDEX "ix_records_description"`);
    await queryRunner.query(`DROP INDEX "ix_records_producer_name"`);
    await queryRunner.query(`DROP INDEX "ix_records_title"`);
    await queryRunner.query(`DROP INDEX "ix_records_wkt_geometry"`);
    await queryRunner.query(`DROP INDEX "ix_records_mdsource"`);
    await queryRunner.query(`DROP INDEX "ix_records_schema"`);
    await queryRunner.query(`DROP INDEX "ix_records_typename"`);
    await queryRunner.query(`DROP TABLE "records"`);
  }
}

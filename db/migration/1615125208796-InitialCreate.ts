import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCreate1615125208796 implements MigrationInterface {
  public name = 'InitialCreate1615125208796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "metadata" (
                "product_id" character varying NOT NULL, 
                "product_name" character varying NOT NULL, 
                "geographic_area" character varying NOT NULL, 
                "product_version" integer NOT NULL DEFAULT '1', 
                "product_type" character varying NOT NULL DEFAULT '3DModel', 
                "description" character varying NOT NULL, 
                "classification" character varying NOT NULL, 
                "footprint" character varying NOT NULL, 
                "extent_lower_left" character varying NOT NULL, 
                "extent_upper_right" character varying NOT NULL, 
                "source_date_start" TIMESTAMP NOT NULL, 
                "source_date_end" TIMESTAMP NOT NULL, 
                "producer_name" character varying NOT NULL DEFAULT 'IDFMU', 
                "srs" character varying NOT NULL, 
                "srs_origin" character varying NOT NULL, 
                "nominal_resolution" character varying NOT NULL, 
                "accuracy_le90" character varying NOT NULL, 
                "horizontal_accuracy_ce90" character varying NOT NULL, 
                "relative_accuracy_le90" character varying NOT NULL, 
                "height_range_from" integer NOT NULL, 
                "height_range_to" integer NOT NULL, 
                "sensor" json NOT NULL, 
                "production_method" character varying NOT NULL DEFAULT 'Photogrammetric', 
                "production_system" character varying NOT NULL, 
                CONSTRAINT "PK_d9203dbe6b2a9ba9c4c46f6cb37" PRIMARY KEY ("product_id")
            )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "metadata"`);
  }
}

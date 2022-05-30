import {MigrationInterface, QueryRunner} from "typeorm";

export class nati1653824973829 implements MigrationInterface {
    name = 'nati1653824973829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "records_test" (
            "identifier" text NOT NULL, 
            "product_id" text NOT NULL, 
            "product_name" text, 
            "product_version" real NOT NULL, 
            "product_type" text, 
            "description" text, 
            "creation_date" TIMESTAMP, 
            "update_date" TIMESTAMP, 
            "source_start_date" TIMESTAMP NOT NULL, 
            "source_end_date" TIMESTAMP NOT NULL, 
            "min_resolution" real, 
            "max_resolution" real, 
            "nominal_resolution" real, 
            "horizontal_accuracy_ce_90" real NOT NULL, 
            "accuracy_le_90" real NOT NULL, 
            "accuracy_se_90" real, 
            "relative_accuracy_le_90" real, 
            "visual_accuracy" real, 
            "sensor_type" text NOT NULL, 
            "footprint" text NOT NULL, 
            "height_range_from" real, 
            "height_range_to" real, 
            "srs" text NOT NULL DEFAULT '4326', 
            "srs_name" text NOT NULL DEFAULT 'WGS84GEO', 
            "srs_origin" text, 
            "region" text, 
            "classification" text NOT NULL, 
            "production_system" text, 
            "production_system_version" text, 
            "producer_name" text DEFAULT 'IDFMU', 
            "production_method" text DEFAULT 'photogrammetric', 
            "min_flight_alt" real, 
            "max_flight_alt" real, 
            "geographic_area" text, 
            "product_bbox" text, 
            "type" text, 
            "typename" text, 
            "schema" text, 
            "mdsource" text, 
            "xml" text, 
            "anytext" text, 
            "insert_date" TIMESTAMP, 
            "wkt_geometry" text, 
            "wkb_geometry" geometry(Geometry,4326), 
            "keywords" text, 
            "anytext_tsvector" tsvector, 
            "links" text, 
            CONSTRAINT "PK_0a8be75b81634d405561258bb98" PRIMARY KEY ("identifier")
            );`);
        await queryRunner.query(`
        CREATE FUNCTION records_test_update_geometry() RETURNS trigger
            SET search_path FROM CURRENT
            LANGUAGE plpgsql
            AS $$
        BEGIN
            IF NEW.wkt_geometry IS NULL THEN
                RETURN NEW;
            END IF;
            NEW.wkb_geometry := ST_GeomFromText(NEW.wkt_geometry,4326);
            RETURN NEW;
        END;
        $$;`);
        await queryRunner.query(`
        CREATE TRIGGER records_test_update_geometry
            BEFORE INSERT OR UPDATE
            ON records_test
            FOR EACH ROW
            EXECUTE PROCEDURE records_test_update_geometry()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "records_test"`);
    }

}

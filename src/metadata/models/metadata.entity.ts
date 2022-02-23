import { ValueTransformer } from 'typeorm';
import { Geometry } from 'geojson';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryColumn, AfterLoad } from 'typeorm';
import { deserializeLinks, formatLinks } from '../../common/utils/format';
import { wktToGeojson } from '../../common/utils/wktSerializer';
import { IMetadataEntity, ILink } from './metadata';

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}
class ColumnNumericTransformer implements ValueTransformer {
  public to(data?: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }
    return null;
  }
  public from(data?: string | null): number | null {
    if (!isNullOrUndefined(data)) {
      const res = parseFloat(data);
      if (isNaN(res)) {
        return null;
      } else {
        return res;
      }
    }
    return null;
  }
}

const numericColumnTransformer = new ColumnNumericTransformer();
@Entity({ name: 'records' })
export class Metadata implements IMetadataEntity {
  @PrimaryColumn()
  public identifier!: string;
  @Column({ name: 'insert_date', type: 'timestamp' })
  public insertDate!: Date;
  @Column({ name: 'product_id', type: 'text' })
  public productId!: string;
  @Column({ name: 'product_name', type: 'text' })
  public productName!: string;
  @Column({ name: 'product_version', type: 'integer' })
  public productVersion!: number;
  @Column({ name: 'product_type', type: 'text' })
  public productType!: string;
  @Column({ name: 'description', type: 'text', nullable: true })
  public description?: string;
  @Column({ name: 'creation_date', type: 'timestamp', nullable: true })
  public creationDate?: string;
  @Column({ name: 'source_start_date', type: 'timestamp', nullable: true })
  public sourceDateStart!: string;
  @Column({ name: 'source_end_date', type: 'timestamp', nullable: true })
  public sourceDateEnd!: string;
  @Column({ name: 'min_resolution', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public minResolutionMeter?: number;
  @Column({ name: 'max_resolution', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public maxResolutionMeter?: number;
  @Column({ name: 'nominal_resolution', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public nominalResolution?: number;
  @Column({ name: 'horizontal_accuracy_ce_90', type: 'numeric', transformer: numericColumnTransformer })
  public maxAccuracyCE90!: number;
  @Column({ name: 'accuracy_le_90', type: 'numeric', transformer: numericColumnTransformer })
  public absoluteAccuracyLEP90!: number;
  @Column({ name: 'accuracy_se_90', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public accuracySE90?: number;
  @Column({ name: 'relative_accuracy_le_90', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public relativeAccuracyLEP90?: number;
  @Column({ name: 'visual_accuracy', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public visualAccuracy?: number;
  @Column({ name: 'sensor_type', type: 'text' })
  public sensors!: string;
  @Column({ name: 'footprint', type: 'geometry' })
  public footprint!: GeoJSON.Geometry;
  @Column({ name: 'height_range_from', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public heightRangeFrom?: number;
  @Column({ name: 'height_range_to', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public heightRangeTo?: number;
  @Column({ name: 'srs', type: 'integer' })
  public srsId!: number;
  @Column({ name: 'srs_name', type: 'text' })
  public srsName!: string;
  @Column({ name: 'srs_origin', type: 'text', nullable: true })
  public srsOrigin?: string; // TODO: create struct representing it as a point
  @Column({ name: 'region', type: 'text' })
  public region!: string;
  @Column({ name: 'classification', type: 'text' })
  public classification!: string;
  @Column({ name: 'compartmentalization', type: 'text', nullable: true })
  public compartmentalization?: string;
  @Column({ name: 'production_system', type: 'text' })
  public productionSystem!: string;
  @Column({ name: 'production_system_version', type: 'text' })
  public productionSystemVer!: string;
  @Column({ name: 'producer_name', type: 'text' })
  public producerName!: string;
  @Column({ name: 'production_method', type: 'text', nullable: true })
  public productionMethod?: string;
  @Column({ name: 'min_flight_alt', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public minFlightAlt?: number;
  @Column({ name: 'max_flight_alt', type: 'numeric', nullable: true, transformer: numericColumnTransformer })
  public maxFlightAlt?: number;
  @Column({ name: 'geographic_area', type: 'text', nullable: true })
  public geographicArea?: string;
  @Column({ name: 'product_bbox', type: 'text' })
  public productBoundingBox!: string;

  @Column({ name: 'links', type: 'text', transformer: { from: deserializeLinks, to: formatLinks } })
  public links!: ILink[];
  @Column({ name: 'wkt_geometry', type: 'text' })
  public boundingBox!: string;

  @Column({ name: 'type', type: 'text' })
  public type!: string;
  @Column({ name: 'typename', type: 'text' })
  public typeName!: string;
  @Column({ name: 'schema', type: 'text' })
  public schema!: string;
  @Column({ name: 'mdsource', type: 'text' })
  public mdSource!: string;
  @Column({ name: 'xml', type: 'text' })
  public xml!: string;
  @Column({ name: 'anytext', type: 'text' })
  public anytext!: string;
  @Column({ name: 'keywords', type: 'text' })
  public keywords!: string;
  @Index('records_fts_gin_idx')
  @Column({
    name: 'anytext_tsvector',
    type: 'tsvector',
    nullable: true,
    transformer: {
      to: (val: string) => (): string => {
        return `to_tsvector('${val}')`;
      },
      from: (): undefined => undefined,
    },
  })
  public anytextTsvector?: string;
  @Index('records_wkb_geometry_idx', { spatial: true })
  @Column({ name: 'wkb_geometry', type: 'geometry', spatialFeatureType: 'Geometry', srid: 4326, nullable: true })
  public wkbGeometry?: Geometry;

  @BeforeInsert()
  @BeforeUpdate()
  @AfterLoad()
  private calculatewkbGeometry(): void {
    this.wkbGeometry = wktToGeojson(this.boundingBox);
  }

  @BeforeInsert()
  @BeforeUpdate()
  private calculateTsVector(): void {
    this.anytextTsvector = this.anytext;
  }
}

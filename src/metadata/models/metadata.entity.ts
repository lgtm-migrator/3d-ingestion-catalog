import { Geometry } from 'geojson';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { deserializeLinks, formatLinks } from '../../common/utils/format';
import { wktToGeojson } from '../../common/utils/wktSerializer';
import { IMetadataEntity, ILink } from './metadata';

@Entity({ name: 'records' })
export class Metadata implements IMetadataEntity {
  @PrimaryColumn()
  public id!: string;
  @Column({ name:"insert_date", type: 'timestamp' })
  public insertDate!: Date;
  @Column({ name:"product_name", type: 'text' })
  public productName!: string;
  @Column({ name: "product_version", type: 'text' })
  public productVersion!: string;
  @Column({ name: "product_type", type: 'text' })
  public productType!: string;

  @Column({ name: "description", type: 'text', nullable: true })
  public description?: string;
  @Column({ name: "creation_date", type: 'timestamp', nullable: true })
  public creationDate?: string;
  @Column({ name: "source_start_date", type: 'timestamp', nullable: true })
  public sourceStartDate?: string;
  @Column({ name: "source_end_date", type: 'timestamp', nullable: true })
  public sourceEndDate?: string;
  @Column({ name: "min_resolution_meter", type: 'numeric', nullable: true })
  public minResolutionMeter?: number;
  @Column({ name: "max_resolution_meter", type: 'numeric', nullable: true })
  public maxResolutionMeter?: number;
  @Column({ name: "min_resolution_deg", type: 'numeric', nullable: true })
  public minResolutionDeg?: number;
  @Column({ name: "max_resolution_deg", type: 'numeric', nullable: true })
  public maxResolutionDeg?: number;
  @Column({ name: "nominal_resolution", type: 'text', nullable: true })
  public nominalResolution?: string;
  @Column({ name: "min_accuracy_CE90", type: 'numeric' })
  public minAccuracyCE90!: number;
  @Column({ name: "max_accuracy_CE90", type: 'numeric' })
  public maxAccuracyCE90!: number;
  @Column({ name: "accuracy_LE90", type: 'numeric' })
  public accuracyLE90!: number;
  @Column({ name: "accuracy_SE90", type: 'numeric', nullable: true })
  public accuracySE90?: number;
  @Column({ name: "relative_accuracy_LE90", type: 'numeric', nullable: true })
  public relativeAccuracyLE90?: number;
  @Column({ name: "visual_accuracy", type: 'numeric', nullable: true })
  public visualAccuracy?: number;
  @Column({ name: "sensor_type", type: 'text' })
  public sensorType!: string;
  @Column({ name: "footprint", type: 'text', nullable: true })
  public footprint?: string;
  @Column({ name: "height_range_from", type: 'numeric', nullable: true })
  public heightRangeFrom?: number;
  @Column({ name: "height_range_to", type: 'numeric', nullable: true })
  public heightRangeTo?: number;
  @Column({ name: "srs_id", type: 'bigint' })
  public srsId!: bigint;
  @Column({ name: "srs_name", type: 'text' })
  public srsName!: string;
  @Column({ name: "srs_origin", type: 'text', nullable: true })
  public srsOrigin?: string; // TODO: create struct representing it as a point
  @Column({ name: "region", type: 'text' })
  public region!: string;
  @Column({ name: "classification", type: 'text' })
  public classification!: string;
  @Column({ name: "compartmentalization", type: 'text', nullable: true })
  public compartmentalization?: string;
  @Column({ name: "production_system", type: 'text' })
  public productionSystem!: string;
  @Column({ name: "production_system_ver", type: 'text' })
  public productionSystemVer!: string;
  @Column({ name: "producer_name", type: 'text' })
  public producerName!: string;
  @Column({ name: "production_method", type: 'text', nullable: true })
  public productionMethod?: string;
  @Column({ name: "min_flight_alt", type: 'numeric', nullable: true })
  public minFlightAlt?: number;
  @Column({ name: "max_flight_alt", type: 'numeric', nullable: true })
  public maxFlightAlt?: number;
  @Column({ name: "geographic_area", type: 'text', nullable: true })
  public geographicArea?: string;
  @Column({ name: "links", type: 'text', transformer: { from: deserializeLinks, to: formatLinks } })
  public links!: ILink[];
  @Column({ name: "bounding_box", type: 'text' })
  public boundingBox!: string;

  @Column({ name: "type", type: 'text' })
  public type!: string;
  @Column({ name: "type_name", type: 'text' })
  public typeName!: string;
  @Column({ name: "schema", type: 'text' })
  public schema!: string;
  @Column({ name: "md_source", type: 'text' })
  public mdSource!: string;
  @Column({ name: "xml", type: 'text' })
  public xml!: string;
  @Column({ name: "anytext", type: 'text' })
  public anytext!: string;
  @Column({ name: "keywords", type: 'text' })
  public keywords!: string;
  @Column({ name: "record_update_date", type: 'timestamp', nullable: true })
  public recordUpdateDate?: Date;
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
  private calculatewkbGeometry(): void {
    this.wkbGeometry = wktToGeojson(this.boundingBox);
  }

  @BeforeInsert()
  @BeforeUpdate()
  private calculateTsVector(): void {
    this.anytextTsvector = this.anytext;
  }
}

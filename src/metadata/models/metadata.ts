import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

export interface IMetadata {
  /**
   * Product's unique identifier
   */
  identifier: string;
  /**
   * Product name
   */
  typeName: string;
  /**
   * Schema
   */
  schema: string;
  /**
   * MD source
   */
  mdSource: string;
  /**
   * XML
   */
  xml: string;
  /**
   * Anytext
   */
  anytext: string;
  /**
   * Record insertion date
   */
  insertDate: Date;
  /**
   * Creation date
   */
  creationDate?: Date;
  /**
   * Validation date
   */
  validationDate?: Date;
  /**
   * Well-Known-Text geometry
   */
  wktGeometry?: string;
  /**
   * Title
   */
  title?: string;
  /**
   * The organization that produced/supplied the product
   */
  producerName?: string; // IDFMU
  /**
   * Description
   */
  description?: string;
  /**
   * Type
   */
  type?: string;
  /**
   * Product classification
   */
  classification?: string;
  /**
   * The product reference system, including a vertical data
   */
  srs?: string;
  /**
   * Project name
   */
  projectName?: string;
  /**
   * Version
   */
  version?: string;
  /**
   * Centroid
   */
  centroid?: string;
  /**
   * Footprint
   */
  footprint?: string;
  /**
   * Begining time
   */
  timeBegin?: Date;
  /**
   * Ending time
   */
  timeEnd?: Date;
  /**
   * The sensor used as the source of the product
   */
  sensorType?: string;
  /**
   * Region
   */
  region?: string;
  /**
   * Nominal resolution
   */
  nominalResolution?: string;
  /**
   * LE90 of the height values
   */
  accuracyLE90?: string;
  /**
   * CE90 of location of elevation points
   */
  horizontalAccuracyCE90?: string;
  /**
   * LE90 of distance measurement
   */
  relativeAccuracyLE90?: string;
  /**
   * Estimated precision
   */
  estimatedPrecision?: string;
  /**
   * Measured precision
   */
  measuredPrecision?: string;
  /**
   * Links
   */
  links?: string;
  /**
   * Anytext tsvector
   */
  anytextTsvector?: string;
  /**
   * WKB geometry
   */
  wkbGeometry?: string;
}

@Entity({ name: 'records' })
export class Metadata implements IMetadata {
  @PrimaryColumn('text')
  public identifier!: string;
  @Column('text', { name: 'typename' })
  @Index('ix_records_typename')
  public typeName!: string;
  @Column('text')
  @Index('ix_records_schema')
  public schema!: string;
  @Column('text', { name: 'mdsource' })
  @Index('ix_records_mdsource')
  public mdSource!: string;
  @Column('text')
  public xml!: string;
  @Column('text')
  public anytext!: string;
  @Column({ name: 'insert_date', type: 'timestamp without time zone' })
  @Index('ix_records_insert_date')
  public insertDate!: Date;
  @Column({ name: 'creation_date', type: 'timestamp without time zone', nullable: true })
  @Index('ix_records_creation_date')
  public creationDate?: Date;
  @Column({ name: 'validation_date', type: 'timestamp without time zone', nullable: true })
  @Index('ix_records_validation_date')
  public validationDate?: Date;
  @Column('text', { name: 'wkt_geometry', nullable: true })
  @Index('ix_records_wkt_geometry')
  public wktGeometry?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_title')
  public title?: string;
  @Column('text', { name: 'producer_name', default: 'IDFMU', nullable: true })
  @Index('ix_records_producer_name')
  public producerName?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_description')
  public description?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_type')
  public type?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_classification')
  public classification?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_srs')
  public srs?: string;
  @Column('text', { name: 'project_name', nullable: true })
  @Index('ix_records_project_name')
  public projectName?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_version')
  public version?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_centroid')
  public centroid?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_footprint')
  public footprint?: string;
  @Column({ name: 'time_begin', type: 'timestamp without time zone', nullable: true })
  @Index('ix_records_time_begin')
  public timeBegin?: Date;
  @Column({ name: 'time_end', type: 'timestamp without time zone', nullable: true })
  @Index('ix_records_time_end')
  public timeEnd?: Date;
  @Column('text', { name: 'sensor_type', nullable: true })
  @Index('ix_records_sensor_type')
  public sensorType?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_region')
  public region?: string;
  @Column('text', { name: 'nominal_resolution', nullable: true })
  @Index('ix_records_nominal_resolution')
  public nominalResolution?: string;
  @Column('text', { name: 'accuracy_le_90', nullable: true })
  @Index('ix_records_accuracy_le_90')
  public accuracyLE90?: string;
  @Column('text', { name: 'horizontal_accuracy_ce_90', nullable: true })
  @Index('ix_records_horizontal_accuracy_ce_90')
  public horizontalAccuracyCE90?: string;
  @Column('text', { name: 'relative_accuracy_le_90', nullable: true })
  @Index('ix_records_relative_accuracy_le_90')
  public relativeAccuracyLE90?: string;
  @Column('text', { name: 'estimated_precision', nullable: true })
  @Index('ix_records_estimated_precision')
  public estimatedPrecision?: string;
  @Column('text', { name: 'measured_precision', nullable: true })
  @Index('ix_records_measured_precision')
  public measuredPrecision?: string;
  @Column('text', { nullable: true })
  @Index('ix_records_links')
  public links?: string;
  @Column({ name: 'anytext_tsvector', type: 'tsvector', nullable: true })
  @Index('ix_records_anytext_tsvector')
  public anytextTsvector?: string;
  @Column('geometry', { name: 'wkb_geometry', spatialFeatureType: 'Geometry', srid: 4326, nullable: true })
  @Index('ix_records_wkb_geometry', { spatial: true })
  public wkbGeometry?: string;
}

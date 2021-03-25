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
   * WKT geometry
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
   * Record insertion date
   */
  insertDate?: Date;
  /**
   * Creation date
   */
  creationDate?: Date;
  /**
   * Validation date
   */
  validationDate?: Date;
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
   * The sensor used as the source of the product (possibly more than one)
   */
  sensorType?: string[];
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
  @PrimaryColumn()
  identifier!: string;
  @Column({ name: 'typename' })
  @Index('ix_records_typename')
  typeName!: string;
  @Column()
  @Index('ix_records_schema')
  schema!: string;
  @Column({ name: 'mdsource' })
  @Index('ix_records_mdsource')
  mdSource!: string;
  @Column()
  xml!: string;
  @Column()
  anytext!: string;
  @Column({ name: 'wkt_geometry' })
  @Index('ix_records_wkt_geometry')
  wktGeometry?: string;
  @Column()
  @Index('ix_records_title')
  title?: string;
  @Column({ name: 'producer_name', default: 'IDFMU' })
  @Index('ix_records_producer_name')
  producerName?: string;
  @Column()
  @Index('ix_records_description')
  description?: string;
  @Column({ name: 'insert_date' })
  @Index('ix_records_insert_date')
  insertDate?: Date;
  @Column({ name: 'creation_date' })
  @Index('ix_records_creation_date')
  creationDate?: Date;
  @Column({ name: 'validation_date' })
  @Index('ix_records_validation_date')
  validationDate?: Date;
  @Column()
  @Index('ix_records_type')
  type?: string;
  @Column()
  @Index('ix_records_classification')
  classification?: string;
  @Column()
  @Index('ix_records_srs')
  srs?: string;
  @Column({ name: 'project_name' })
  @Index('ix_records_project_name')
  projectName?: string;
  @Column()
  @Index('ix_records_version')
  version?: string;
  @Column()
  @Index('ix_records_centroid')
  centroid?: string;
  @Column()
  @Index('ix_records_footprint')
  footprint?: string;
  @Column({ name: 'time_begin' })
  @Index('ix_records_time_begin')
  timeBegin?: Date;
  @Column({ name: 'time_end' })
  @Index('ix_records_time_end')
  timeEnd?: Date;
  @Column({ name: 'sensor_type', type: 'json' })
  @Index('ix_records_sensor_type')
  sensorType?: string[];
  @Column()
  @Index('ix_records_region')
  region?: string;
  @Column({ name: 'nominal_resolution' })
  @Index('ix_records_nominal_resolution')
  nominalResolution?: string;
  @Column({ name: 'accuracy_le_90' })
  @Index('ix_records_accuracy_le_90')
  accuracyLE90?: string;
  @Column({ name: 'horizontal_accuracy_ce_90' })
  @Index('ix_records_horizontal_accuracy_ce_90')
  horizontalAccuracyCE90?: string;
  @Column({ name: 'relative_accuracy_le_90' })
  @Index('ix_records_relative_accuracy_le_90')
  relativeAccuracyLE90?: string;
  @Column({ name: 'estimated_precision' })
  @Index('ix_records_estimated_precision')
  estimatedPrecision?: string;
  @Column({ name: 'measured_precision' })
  @Index('ix_records_measured_precision')
  measuredPrecision?: string;
  @Column()
  @Index('ix_records_links')
  links?: string;
  @Column({ name: 'anytext_tsvector' })
  @Index('ix_records_anytext_tsvector')
  anytextTsvector?: string;
  @Column({ name: 'wkb_geometry' })
  @Index('ix_records_wkb_geometry')
  wkbGeometry?: string;
}

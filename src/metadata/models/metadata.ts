import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

interface IMetadataBase {
  /**
   * Unique identifier
   */
  identifier: string;
  /**
   * Typename for the metadata; typically the value of the root element tag (e.g. csw:Record, gmd:MD_Metadata)
   */
  typename: string;
  /**
   * Schema for the metadata; typically the target namespace (e.g. http://www.opengis.net/cat/csw/2.0.2, http://www.isotc211.org/2005/gmd)
   */
  schema: string;
  /**
   * MD source
   */
  mdSource: string;
  /**
   * Full XML representation
   */
  xml: string;
  /**
   * Bag of XML element text values, used for full text search
   */
  anytext: string;
  /**
   * Date of insertion
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
   * Well-Known-Text markup language for representing vector geometry objects
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
}

export interface ILink {
  name?: string;
  description?: string;
  protocol: string;
  url: string;
}

export interface IPayload extends IMetadataBase {
  /**
   * Structure of links
   */
  links?: ILink[];
}

export interface IMetadata extends IMetadataBase {
  /**
   * Structure of links in the format “name,description,protocol,url[^,,,[^,,,]]”
   */
  links?: string;
  /**
   * Anytext tsvector
   */
  anytextTsvector?: string;
  /**
   * Well-Known-Binary used to transfer and store the WKT information in a more compact form convenient for computer processing but that is not human-readable
   */
  wkbGeometry?: string;
}

@Entity({ name: 'records' })
export class Metadata implements IMetadata {
  @PrimaryColumn({ type: 'text' })
  public identifier!: string;
  @Index('ix_records_typename')
  @Column({ type: 'text' })
  public typename!: string;
  @Index('ix_records_schema')
  @Column({ type: 'text' })
  public schema!: string;
  @Index('ix_records_mdsource')
  @Column({ name: 'mdsource', type: 'text' })
  public mdSource!: string;
  @Column({ type: 'text' })
  public xml!: string;
  @Column({ type: 'text' })
  public anytext!: string;
  @Index('ix_records_insert_date')
  @Column({ name: 'insert_date', type: 'timestamp without time zone' })
  public insertDate!: Date;
  @Index('ix_records_creation_date')
  @Column({ name: 'creation_date', type: 'timestamp without time zone', nullable: true })
  public creationDate?: Date;
  @Index('ix_records_validation_date')
  @Column({ name: 'validation_date', type: 'timestamp without time zone', nullable: true })
  public validationDate?: Date;
  @Index('ix_records_wkt_geometry')
  @Column({ name: 'wkt_geometry', type: 'text', nullable: true })
  public wktGeometry?: string;
  @Index('ix_records_title')
  @Column({ type: 'text', nullable: true })
  public title?: string;
  @Index('ix_records_producer_name')
  @Column({ name: 'producer_name', type: 'text', default: 'IDFMU', nullable: true })
  public producerName?: string;
  @Index('ix_records_description')
  @Column({ type: 'text', nullable: true })
  public description?: string;
  @Index('ix_records_type')
  @Column({ type: 'text', nullable: true })
  public type?: string;
  @Index('ix_records_classification')
  @Column({ type: 'text', nullable: true })
  public classification?: string;
  @Index('ix_records_srs')
  @Column({ type: 'text', nullable: true })
  public srs?: string;
  @Index('ix_records_project_name')
  @Column({ name: 'project_name', type: 'text', nullable: true })
  public projectName?: string;
  @Index('ix_records_version')
  @Column({ type: 'text', nullable: true })
  public version?: string;
  @Index('ix_records_centroid')
  @Column({ type: 'text', nullable: true })
  public centroid?: string;
  @Index('ix_records_footprint')
  @Column({ type: 'text', nullable: true })
  public footprint?: string;
  @Index('ix_records_time_begin')
  @Column({ name: 'time_begin', type: 'timestamp without time zone', nullable: true })
  public timeBegin?: Date;
  @Index('ix_records_time_end')
  @Column({ name: 'time_end', type: 'timestamp without time zone', nullable: true })
  public timeEnd?: Date;
  @Index('ix_records_sensor_type')
  @Column({ name: 'sensor_type', type: 'text', nullable: true })
  public sensorType?: string;
  @Index('ix_records_region')
  @Column({ type: 'text', nullable: true })
  public region?: string;
  @Index('ix_records_nominal_resolution')
  @Column({ name: 'nominal_resolution', type: 'text', nullable: true })
  public nominalResolution?: string;
  @Index('ix_records_accuracy_le_90')
  @Column({ name: 'accuracy_le_90', type: 'text', nullable: true })
  public accuracyLE90?: string;
  @Index('ix_records_horizontal_accuracy_ce_90')
  @Column({ name: 'horizontal_accuracy_ce_90', type: 'text', nullable: true })
  public horizontalAccuracyCE90?: string;
  @Index('ix_records_relative_accuracy_le_90')
  @Column({ name: 'relative_accuracy_le_90', type: 'text', nullable: true })
  public relativeAccuracyLE90?: string;
  @Index('ix_records_estimated_precision')
  @Column({ name: 'estimated_precision', type: 'text', nullable: true })
  public estimatedPrecision?: string;
  @Index('ix_records_measured_precision')
  @Column({ name: 'measured_precision', type: 'text', nullable: true })
  public measuredPrecision?: string;
  @Index('ix_records_links')
  @Column({ type: 'text', nullable: true })
  public links?: string;
  @Index('ix_records_anytext_tsvector')
  @Column({ name: 'anytext_tsvector', type: 'tsvector', nullable: true })
  public anytextTsvector?: string;
  @Index('ix_records_wkb_geometry', { spatial: true })
  @Column({ name: 'wkb_geometry', type: 'geometry', spatialFeatureType: 'Geometry', srid: 4326, nullable: true })
  public wkbGeometry?: string;
}

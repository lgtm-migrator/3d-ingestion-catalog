/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface IMetadata {
  /**
   * Product's unique identifier
   */
  productId: string;
  /**
   * Product name
   */
  productName: string;
  /**
   * Emergence geographic area name
   */
  geographicArea: string;
  /**
   * Product version
   */
  productVersion: number; // 1
  /**
   * Product type
   */
  productType: string; // 3DModel
  /**
   * Product description
   */
  description?: string;
  /**
   * Product classification
   */
  classification?: string;
  /**
   * Geographical delineation of the product
   */
  footprint?: string;
  /**
   * Bottom left point of a blocking rectangle
   */
  extentLowerLeft: string;
  /**
   * Top right point of a blocking rectangle
   */
  extentUpperRight: string;
  /**
   * Date of oldest source material
   */
  SourceDateStart: Date;
  /**
   * Date of latest source material
   */
  SourceDateEnd: Date;
  /**
   * The organization that produced/supplied the product
   */
  producerName: string; // IDFMU
  /**
   * The product reference system, including a vertical data
   */
  SRS: string;
  /**
   * Axis system center in which the coordinate is displayed
   */
  SRSOrigin?: string;
  /**
   * Number of points per unit of area
   */
  nominalResolution?: string;
  /**
   * LE90 of the height values
   */
  accuracyLE90: string;
  /**
   * CE90 of location of elevation points
   */
  horizontalAccuracyCE90: string;
  /**
   * LE90 of distance measurement
   */
  relativeAccuracyLE90: string;
  /**
   * The minimum height
   */
  heightRangeFrom?: number;
  /**
   * The maximum height
   */
  heightRangeTo?: number;
  /**
   * The sensor used as the source of the product (possibly more than one)
   */
  sensor: string[];
  /**
   * Method of extracting altitude data
   */
  productionMethod?: string; // Photogrammetric
  /**
   * Production system
   */
  productionSystem: string;
}

@Entity()
export class Metadata implements IMetadata {
  @PrimaryColumn({ name: 'product_id' })
  productId!: string;
  @Column({ name: 'product_name' })
  productName!: string;
  @Column({ name: 'geographic_area' })
  geographicArea!: string;
  @Column({ name: 'product_version', default: 1 })
  productVersion!: number;
  @Column({ name: 'product_type', default: '3DModel' })
  productType!: string;
  @Column()
  description?: string;
  @Column()
  classification?: string;
  @Column()
  footprint?: string;
  @Column({ name: 'extent_lower_left' })
  extentLowerLeft!: string;
  @Column({ name: 'extent_upper_right' })
  extentUpperRight!: string;
  @Column({ name: 'source_date_start' })
  SourceDateStart!: Date;
  @Column({ name: 'source_date_end' })
  SourceDateEnd!: Date;
  @Column({ name: 'producer_name', default: 'IDFMU' })
  producerName!: string;
  @Column({ name: 'srs' })
  SRS!: string;
  @Column({ name: 'srs_origin' })
  SRSOrigin?: string;
  @Column({ name: 'nominal_resolution' })
  nominalResolution?: string;
  @Column({ name: 'accuracy_le90' })
  accuracyLE90!: string;
  @Column({ name: 'horizontal_accuracy_ce90' })
  horizontalAccuracyCE90!: string;
  @Column({ name: 'relative_accuracy_le90' })
  relativeAccuracyLE90!: string;
  @Column({ name: 'height_range_from' })
  heightRangeFrom?: number;
  @Column({ name: 'height_range_to' })
  heightRangeTo?: number;
  @Column({ type: 'json' })
  sensor!: string[];
  @Column({ name: 'production_method', default: 'Photogrammetric' })
  productionMethod?: string;
  @Column({ name: 'production_system' })
  productionSystem!: string;
}

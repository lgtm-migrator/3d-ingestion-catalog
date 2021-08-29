import { Geometry } from 'geojson';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { deserializeLinks, formatLinks } from '../../common/utils/format';
import { wktToGeojson } from '../../common/utils/wktSerializer';
import { IMetadataEntity, ILink } from './metadata';

@Entity({ name: 'records' })
export class Metadata implements IMetadataEntity {
  @PrimaryColumn()
  public id!: string;
  @Column({ type: 'timestamp' })
  public insertDate!: Date;
  @Column({ type: 'text' })
  public productName!: string;
  @Column({ type: 'text' })
  public productVersion!: string;
  @Column({ type: 'text' })
  public productType!: string;

  @Column({ type: 'text', nullable: true })
  public description?: string;
  @Column({ type: 'timestamp', nullable: true })
  public creationDate?: string;
  @Column({ type: 'timestamp', nullable: true })
  public sourceDateStart?: string;
  @Column({ type: 'timestamp', nullable: true })
  public sourceDateEnd?: string;
  @Column({ type: 'numeric', nullable: true })
  public minResolutionMeter?: number;
  @Column({ type: 'numeric', nullable: true })
  public maxResolutionMeter?: number;
  @Column({ type: 'numeric', nullable: true })
  public minResolutionDeg?: number;
  @Column({ type: 'numeric', nullable: true })
  public maxResolutionDeg?: number;
  @Column({ type: 'text', nullable: true })
  public nominalResolution?: string;
  @Column({ type: 'numeric' })
  public minAccuracyCE90!: number;
  @Column({ type: 'numeric' })
  public maxAccuracyCE90!: number;
  @Column({ type: 'numeric' })
  public accuracyLE90!: number;
  @Column({ type: 'numeric', nullable: true })
  public accuracysE90?: number;
  @Column({ type: 'numeric', nullable: true })
  public relativeAccuracyLE90?: number;
  @Column({ type: 'numeric', nullable: true })
  public visualAccuracy?: number;
  @Column({ type: 'text' })
  public sensors!: string;
  @Column({ type: 'text', nullable: true })
  public footprint?: string;
  @Column({ type: 'numeric', nullable: true })
  public heightRangeFrom?: number;
  @Column({ type: 'numeric', nullable: true })
  public heightRangeTo?: number;
  @Column({ type: 'bigint' })
  public srsId!: bigint;
  @Column({ type: 'text' })
  public srsName!: string;
  @Column({ type: 'text', nullable: true })
  public srsOrigin?: string; // TODO: create struct representing it as a point
  @Column({ type: 'text' })
  public region!: string;
  @Column({ type: 'text' })
  public classification!: string;
  @Column({ type: 'text', nullable: true })
  public compartmentalization?: string;
  @Column({ type: 'text' })
  public productionSystem!: string;
  @Column({ type: 'text' })
  public productionSystemVer!: string;
  @Column({ type: 'text' })
  public producerName!: string;
  @Column({ type: 'text', nullable: true })
  public productionMethod?: string;
  @Column({ type: 'numeric', nullable: true })
  public minFlightAlt?: number;
  @Column({ type: 'numeric', nullable: true })
  public maxFlightAlt?: number;
  @Column({ type: 'text', nullable: true })
  public geographicArea?: string;
  @Column({ type: 'text', transformer: { from: deserializeLinks, to: formatLinks } })
  public links!: ILink[];
  @Column({ type: 'text' })
  public boundingBox!: string;

  @Column({ type: 'text' })
  public type!: string;
  @Column({ type: 'text' })
  public typeName!: string;
  @Column({ type: 'text' })
  public schema!: string;
  @Column({ type: 'text' })
  public mdSource!: string;
  @Column({ type: 'text' })
  public xml!: string;
  @Column({ type: 'text' })
  public anytext!: string;
  @Column({ type: 'text' })
  public keywords!: string;
  @Column({ type: 'timestamp', nullable: true })
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

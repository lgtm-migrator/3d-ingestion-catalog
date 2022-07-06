/* This file was auto-generated by MC-GENERATOR, DO NOT modify it manually */
/* eslint-disable import/exports-last, @typescript-eslint/ban-types, @typescript-eslint/no-inferrable-types */
import { Column, Entity } from "typeorm";
import { RecordType, ProductType } from "@map-colonies/mc-model-types";

@Entity({name: 'records'})
export class Metadata {
    @Column({name: 'type',type: 'text',nullable: true})
    public type?: RecordType = 'RECORD_3D' as RecordType;
    @Column({name: 'product_id',type: 'text',nullable: false})
    public productId!: string;
    @Column({name: 'product_name',type: 'text',nullable: false})
    public productName!: string;
    @Column({name: 'product_version',type: 'int',nullable: false})
    public productVersion!: number;
    @Column({name: 'product_type',type: 'text',nullable: false})
    public productType: ProductType = '3DPhotoRealistic' as ProductType;
    @Column({name: 'description',type: 'text',nullable: true})
    public description?: string;
    @Column({name: 'creation_date',type: 'timestamp without time zone',nullable: true})
    public creationDate?: Date;
    @Column({name: 'update_date',type: 'timestamp without time zone',nullable: false})
    public updateDate!: Date;
    @Column({name: 'source_start_date',type: 'timestamp without time zone',nullable: false})
    public sourceDateStart!: Date;
    @Column({name: 'source_end_date',type: 'timestamp without time zone',nullable: false})
    public sourceDateEnd!: Date;
    @Column({name: 'min_resolution',type: 'real',nullable: true})
    public minResolutionMeter?: number;
    @Column({name: 'max_resolution',type: 'real',nullable: true})
    public maxResolutionMeter?: number;
    @Column({name: 'nominal_resolution',type: 'real',nullable: true})
    public nominalResolution?: number;
    @Column({name: 'horizontal_accuracy_ce_90',type: 'real',nullable: false})
    public maxAccuracyCE90!: number;
    @Column({name: 'accuracy_le_90',type: 'real',nullable: false})
    public absoluteAccuracyLEP90!: number;
    @Column({name: 'accuracy_se_90',type: 'real',nullable: true})
    public accuracySE90?: number;
    @Column({name: 'relative_accuracy_le_90',type: 'real',nullable: true})
    public relativeAccuracyLEP90?: number;
    @Column({name: 'visual_accuracy',type: 'real',nullable: true})
    public visualAccuracy?: number;
    @Column({name: 'sensor_type',type: 'text',nullable: false})
    public sensors!: string;
    @Column({name: 'footprint',type: 'text',nullable: false})
    public footprint!: object;
    @Column({name: 'height_range_from',type: 'real',nullable: true})
    public heightRangeFrom?: number;
    @Column({name: 'height_range_to',type: 'real',nullable: true})
    public heightRangeTo?: number;
    @Column({name: 'srs',type: 'text',nullable: false,default: '4326'})
    public srsId!: string;
    @Column({name: 'srs_name',type: 'text',nullable: false,default: 'WGS84GEO'})
    public srsName!: string;
    @Column({name: 'srs_origin',type: 'text',nullable: true})
    public srsOrigin?: string;
    @Column({name: 'region',type: 'text',nullable: false})
    public region!: string;
    @Column({name: 'classification',type: 'text',nullable: false})
    public classification!: string;
    @Column({name: 'production_system',type: 'text',nullable: false})
    public productionSystem!: string;
    @Column({name: 'production_system_version',type: 'text',nullable: false})
    public productionSystemVer!: string;
    @Column({name: 'producer_name',type: 'text',default: 'IDFMU',nullable: false})
    public producerName!: string;
    @Column({name: 'production_method',type: 'text',default: 'photogrammetric',nullable: true})
    public productionMethod?: string;
    @Column({name: 'min_flight_alt',type: 'real',nullable: true})
    public minFlightAlt?: number;
    @Column({name: 'max_flight_alt',type: 'real',nullable: true})
    public maxFlightAlt?: number;
    @Column({name: 'geographic_area',type: 'text',nullable: true})
    public geographicArea?: string;
    @Column({name: 'product_bbox',type: 'text',nullable: true})
    public productBoundingBox?: string;
    @Column({name: 'identifier',type: 'text',nullable: false,primary: true})
    public id: string = 'UNKNOWN';
    @Column({name: 'typename',type: 'text'})
    public typeName: string = 'mc_MC3DRecord';
    @Column({name: 'schema',type: 'text'})
    public schema: string = 'mc3d';
    @Column({name: 'mdsource',type: 'text'})
    public mdSource: string = '';
    @Column({name: 'xml',type: 'text'})
    public xml: string = '';
    @Column({name: 'anytext',type: 'text'})
    public anyText: string = '';
    @Column({name: 'insert_date',type: 'timestamp without time zone',nullable: false})
    public insertDate!: Date;
    @Column({name: 'wkt_geometry',type: 'text',nullable: true})
    public wktGeometry?: string;
    @Column({name: 'wkb_geometry',type: 'geometry',spatialFeatureType: 'Geometry',srid: 4326,nullable: true})
    public wkbGeometry?: string;
    @Column({name: 'keywords',type: 'text'})
    public keywords: string = '';
    @Column({name: 'anytext_tsvector',type: 'tsvector',nullable: true})
    public anyTextTsvector?: string;
    @Column({name: 'links',type: 'text',nullable: true})
    public links?: string;
}

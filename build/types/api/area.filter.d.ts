export interface IPolygonPoint {
    polygon: {
        geometry: {
            type: 'Point';
            coordinates: [number, number];
        };
        properties: any;
        type: 'Feature';
    };
    radius: number;
}
export interface IPolygon {
    polygon: {
        geometry: {
            type: 'Polygon';
            coordinates: [number, number][];
        };
        properties: any;
        type: 'Feature';
    };
}
export interface IPolygonLine {
    polygon: {
        geometry: {
            coordinates: [number, number][];
            type: 'LineString';
        };
        properties: any;
        type: 'Feature';
    };
    left: 50;
    right: 50;
}
interface by {
    region: number;
    district: number;
    byArea: IPolygonPoint;
    polygon: IPolygon;
    polygonPoint: IPolygonPoint;
    polygonLine: IPolygonLine;
}
export type IByArea<T extends keyof by> = {
    [key in T]: by[T];
} & {
    by: T;
};
export type FilterPolygonArea = IByArea<'region'> | IByArea<'district'> | IByArea<'byArea'> | IByArea<'polygon'> | IByArea<'polygonLine'> | IByArea<'polygonPoint'>;
export {};

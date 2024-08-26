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
export type FilterPolygonArea = IPolygonPoint | IPolygon | IPolygonLine;

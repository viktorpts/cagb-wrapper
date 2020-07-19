export interface IPoint {
    x: number;
    y: number;
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    constructor(x: number, y: number);
    getPointData(z?: number): number[];
}
export declare class Line {
    enabled: boolean;
    points: Array<Point>;
    buffer: WebGLBuffer;
    color: [number, number, number, number];
    changed: boolean;
    markerSize: number;
    zOrder: number;
    constructor();
    constructor(line: Line);
    constructor(points: Array<Point>);
    constructor(points: Array<Array<number>>);
    private applyPoints;
    addPoint(point: Point | Array<number>): void;
    removePoint(point: Point): void;
    setPoints(line: Line): any;
    setPoints(points: Array<Point>): any;
    setPoints(points: Array<Array<number>>): any;
    getPointArray(): Float32Array;
}

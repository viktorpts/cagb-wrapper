export interface IPoint {
    x: number;
    y: number;
}

export class Point implements IPoint {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getPointData(z = 0.0) {
        return [this.x, this.y, z];
    }
}

export class Line {
    public enabled = true;
    public points: Array<Point>;
    public buffer: WebGLBuffer;
    public color: [number, number, number, number];
    public changed = true;
    public markerSize = 0;
    public zOrder = 0;

    constructor();
    constructor(line: Line);
    constructor(points: Array<Point>);
    constructor(points: Array<Array<number>>);
    constructor(source?: Line | Array<Point> | Array<Array<number>>) {
        this.points = [];
        if (source) {
            this.applyPoints(source as any);
        }
        this.color = [0.0, 0.0, 0.0, 1.0];
    }

    private applyPoints();
    private applyPoints(line: Line);
    private applyPoints(points: Array<Point>);
    private applyPoints(points: Array<Array<number>>);
    private applyPoints(source?: Line | Array<Point> | Array<Array<number>>) {
        this.points.length = 0;
        if (source) {
            if (source instanceof Line) {
                for (let point of source.points) {
                    this.addPoint(point);
                }
            } else {
                for (let point of source) {
                    this.addPoint(point);
                }
            }
        }
    }

    addPoint(point: Point | Array<number>) {
        if (point instanceof Point) {
            this.points.push(point);
        } else {
            this.points.push(new Point(point[0], point[1]));
        }
    }

    removePoint(point: Point) {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i] === point) {
                this.points.splice(i, 1);
                return;
            }
        }
    }

    setPoints(line: Line);
    setPoints(points: Array<Point>);
    setPoints(points: Array<Array<number>>);
    setPoints(source: Line | Array<Point> | Array<Array<number>>) {
        this.changed = true;
        this.applyPoints(source as any);
    }

    getPointArray() {
        return new Float32Array(this.points.reduce((p, c) => p.concat(c.getPointData(-this.zOrder)), []));
    }
}
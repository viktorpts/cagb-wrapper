import { Line, IPoint } from "./geometry";
import { color } from "./GLWrapper";


export default class Bezier {
    private polygon: Line;
    private _proportion: number;
    private _segments: number;

    public levels: Array<Line>;
    public curve: Line;
    public subdivision: Line;

    constructor(polygon) {
        this.polygon = polygon;
        this.levels = [];
        this.curve = new Line();
        this.curve.color = color.ORANGE;
        this.subdivision = new Line();
        this.subdivision.zOrder = 0.25;
        this.subdivision.color = color.GREEN;
        this.subdivision.markerSize = 0.5;

        this.initLevels();

        this.proportion = 0.5;
        this.segments = 2;
    }

    get segments() {
        return this._segments;
    }

    set segments(value) {
        this._segments = value;
        this.calculateCurve();
    }

    get proportion() {
        return this._proportion;
    }

    set proportion(value) {
        this._proportion = value;
        this.calculateScaffold();
    }

    private initLevels() {
        for (let i = 0; i < this.polygon.points.length - 2; i++) {
            this.incrementLevel();
        }
    }

    private calculateScaffold() {
        this.subdivision.points.length = 0;
        this.subdivision.addPoint(this.polygon.points[0]);
        for (let i = 0; i < this.levels.length; i++) {
            const prevLevel = this.levels[i - 1] || this.polygon;
            this.levels[i].setPoints(deCasteljauIterative(prevLevel, this.proportion));
            this.levels[i].changed = true;

            this.subdivision.addPoint(this.levels[i].points[0]);
        }
        const lastLevel = this.levels[this.levels.length - 1];
        const marker = interpolate(lastLevel.points[0], lastLevel.points[1], this.proportion);
        this.subdivision.addPoint(marker);
        this.subdivision.changed = true;
    }

    private calculateCurve() {
        const step = 1 / (this.segments * (this.polygon.points.length - 1));
        let current = step;

        this.curve.points.length = 0;
        this.curve.addPoint(this.polygon.points[0].getPointData());
        while (current < 1) {
            let scaffold = new Line(this.polygon);
            while (scaffold.points.length > 2) {
                scaffold = deCasteljauIterative(scaffold, current);
            }
            this.curve.addPoint(interpolate(scaffold.points[0], scaffold.points[1], current));

            current += step;
        }
        this.curve.addPoint(this.polygon.points[this.polygon.points.length - 1].getPointData());

        this.curve.changed = true;
    }


    update(proportion?) {
        if (proportion !== undefined) {
            this.proportion = proportion;
        }

        this.calculateScaffold();
        this.calculateCurve();
    }

    incrementLevel() {
        const lastLevel = this.levels[this.levels.length - 1] || this.polygon;
        const line = deCasteljauIterative(lastLevel, this.proportion);
        line.color = color.A25;
        this.levels.push(line);

        return line;
    }

    decrementLevel() {
        return this.levels.pop();
    }
}

export function deCasteljauIterative(line: Line, prop: number) {
    const newLine = new Line();
    for (let i = 0; i < line.points.length - 1; i++) {
        const p1 = line.points[i];
        const p2 = line.points[i + 1];
        newLine.addPoint(interpolate(p1, p2, prop));
    }
    return newLine;
}

function interpolate(a: IPoint, b: IPoint, prop: number) {
    return [(1 - prop) * a.x + prop * b.x, (1 - prop) * a.y + prop * b.y]
}

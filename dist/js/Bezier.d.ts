import { Line } from "./geometry";
export default class Bezier {
    private polygon;
    private _proportion;
    private _segments;
    levels: Array<Line>;
    curve: Line;
    subdivision: Line;
    constructor(polygon: any);
    get segments(): number;
    set segments(value: number);
    get proportion(): number;
    set proportion(value: number);
    private initLevels;
    private calculateScaffold;
    private calculateCurve;
    update(proportion?: any): void;
    incrementLevel(): Line;
    decrementLevel(): Line;
}
export declare function deCasteljauIterative(line: Line, prop: number): Line;

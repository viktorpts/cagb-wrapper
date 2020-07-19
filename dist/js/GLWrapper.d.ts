import { Line, Point } from "./geometry";
export default class GLWrapper {
    private programInfo;
    private pointBuffer;
    private gl;
    private program;
    private shaders;
    private lines;
    changed: boolean;
    constructor(canvas: HTMLCanvasElement);
    private initialize;
    private attachShader;
    private createBuffer;
    private setDrawingOptions;
    addLine(line: Line): void;
    removeLine(line: Line): void;
    drawPoint(point: Point, size: number): void;
    drawLine(line: Line): void;
    render(): void;
}
declare type Color = [number, number, number, number];
export declare const color: {
    BLACK: Color;
    A25: Color;
    A50: Color;
    A75: Color;
    WHITE: Color;
    B25: Color;
    B50: Color;
    B75: Color;
    RED: Color;
    GREEN: Color;
    BLUE: Color;
    ORANGE: Color;
    PURPLE: Color;
    YELLOW: Color;
};
export {};

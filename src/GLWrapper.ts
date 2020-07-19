import { Line, Point } from "./geometry";

export default class GLWrapper {
    private programInfo: { vertices: number, uVColor: WebGLUniformLocation, uOffset: WebGLUniformLocation, uDSize: WebGLUniformLocation };
    private pointBuffer: WebGLBuffer;

    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private shaders: Array<WebGLShader>;
    private lines: Array<Line>;

    public changed = false;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext('webgl2');

        if (!this.gl) {
            throw new Error('Could not initialise WebGL');
        }

        this.initialize();
    }

    private initialize() {
        this.program = this.gl.createProgram();
        this.shaders = [];
        this.lines = [];

        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.attachShader(vertexSource, this.gl.VERTEX_SHADER);
        this.attachShader(fragmentSource, this.gl.FRAGMENT_SHADER);

        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Could not initialise shaders');
        }
        this.gl.useProgram(this.program);

        this.programInfo = {
            vertices: this.gl.getAttribLocation(this.program, 'aVertexPosition'),
            uVColor: this.gl.getUniformLocation(this.program, 'uVColor'),
            uOffset: this.gl.getUniformLocation(this.program, 'uOffset'),
            uDSize: this.gl.getUniformLocation(this.program, 'uDSize')
        };
        this.gl.enableVertexAttribArray(this.programInfo.vertices);

        this.pointBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, new Float32Array(pointArray.reduce((p, c) => p.concat(c), [])), this.gl.STATIC_DRAW);
    }

    private attachShader(shaderSource, type: GLenum) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(this.gl.getShaderInfoLog(shader));
        }

        this.shaders.push(shader);
        this.gl.attachShader(this.program, shader);
    }

    private createBuffer(target?: GLenum, data?: ArrayBuffer, usage?: GLenum) {
        const buffer = this.gl.createBuffer();

        if (target && data && usage) {
            this.gl.bindBuffer(target, buffer);
            this.gl.bufferData(target, data, usage);
        }

        return buffer;
    }

    private setDrawingOptions(options?: { scale?: number, offset?: Point | [number, number, number?], color?: [number, number, number, number] }) {
        if (options === undefined) { options = {}; }
        const scale = options.scale || 1;
        this.gl.uniform1f(this.programInfo.uDSize, scale);

        let offset = options.offset instanceof Point ? options.offset.getPointData() : options.offset;
        if (offset === undefined) {
            offset = [0, 0, 0];
        } else if (offset[2] === undefined) {
            offset[2] = 0.0;
        }
        this.gl.uniform3fv(this.programInfo.uOffset, new Float32Array(offset));

        const color = options.color || [0.0, 0.0, 0.0, 1.0];
        this.gl.uniform4fv(this.programInfo.uVColor, new Float32Array(color));

        this.gl.vertexAttribPointer(this.programInfo.vertices, 3, this.gl.FLOAT, false, 0, 0);
    }

    addLine(line: Line) {
        line.buffer = this.createBuffer(this.gl.ARRAY_BUFFER, line.getPointArray(), this.gl.DYNAMIC_DRAW);
        this.lines.push(line);
    }

    removeLine(line: Line) {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i] === line) {
                this.lines.splice(i, 1);
                break;
            }
        }
    }

    drawPoint(point: Point, size: number) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointBuffer);
        this.setDrawingOptions({ scale: size, offset: point });
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, pointArray.length);
    }

    drawLine(line: Line) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.buffer);
        if (line.changed || this.changed) {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, line.getPointArray(), this.gl.DYNAMIC_DRAW);
            line.changed = false;
        }
        this.setDrawingOptions({ color: line.color });
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, line.points.length);
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        for (let line of this.lines) {
            if (line.enabled) {
                this.drawLine(line);
            }
            if (line.markerSize > 0) {
                line.points.forEach(point => this.drawPoint(point, line.markerSize));
            }
        }

        this.changed = false;
    }
}


type Color = [number, number, number, number];

export const color = {
    BLACK: [0, 0, 0, 1] as Color,
    A25: [0, 0, 0, 0.25] as Color,
    A50: [0, 0, 0, 0.5] as Color,
    A75: [0, 0, 0, 0.75] as Color,
    WHITE: [1, 1, 1, 1] as Color,
    B25: [0.75, 0.75, 0.75, 1] as Color,
    B50: [0.5, 0.5, 0.5, 1] as Color,
    B75: [0.25, 0.25, 0.25, 1] as Color,
    RED: [1, 0, 0, 1] as Color,
    GREEN: [0, 1, 0, 1] as Color,
    BLUE: [0, 0, 1, 1] as Color,
    ORANGE: [1, 0.5, 0.25, 1] as Color,
    PURPLE: [1, 0, 1, 1] as Color,
    YELLOW: [0, 1, 1, 1] as Color
}

const vertexSource = `
attribute vec3 aVertexPosition;
uniform vec4 uVColor;
uniform vec3 uOffset;
uniform float uDSize;
varying vec4 vXYZW_Color;

void main(void) {
    gl_Position = vec4(uDSize * aVertexPosition + uOffset, 1.0);
    vXYZW_Color = uVColor;
}
`;

const fragmentSource = `
precision mediump float;
varying vec4 vXYZW_Color;

void main(void) {
    gl_FragColor = vXYZW_Color;
}
`;

const pointPrecision = 12;
const pointArray = [
    [0.0, 0.0, -1.0]
].concat((new Array(pointPrecision + 1)).fill(0).map((p, i) => [0.02 * Math.cos(i * Math.PI * 2 / pointPrecision), 0.02 * Math.sin(i * Math.PI * 2 / pointPrecision), -1.0]));
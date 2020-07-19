/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getPointData(z = 0.0) {
        return [this.x, this.y, z];
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Point;

class Line {
    constructor(source) {
        this.enabled = true;
        this.changed = true;
        this.markerSize = 0;
        this.zOrder = 0;
        this.points = [];
        if (source) {
            this.applyPoints(source);
        }
        this.color = [0.0, 0.0, 0.0, 1.0];
    }
    applyPoints(source) {
        this.points.length = 0;
        if (source) {
            if (source instanceof Line) {
                for (let point of source.points) {
                    this.addPoint(point);
                }
            }
            else {
                for (let point of source) {
                    this.addPoint(point);
                }
            }
        }
    }
    addPoint(point) {
        if (point instanceof Point) {
            this.points.push(point);
        }
        else {
            this.points.push(new Point(point[0], point[1]));
        }
    }
    removePoint(point) {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i] === point) {
                this.points.splice(i, 1);
                return;
            }
        }
    }
    setPoints(source) {
        this.changed = true;
        this.applyPoints(source);
    }
    getPointArray() {
        return new Float32Array(this.points.reduce((p, c) => p.concat(c.getPointData(-this.zOrder)), []));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Line;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__geometry__ = __webpack_require__(0);

class GLWrapper {
    constructor(canvas) {
        this.changed = false;
        this.gl = canvas.getContext('webgl2');
        if (!this.gl) {
            throw new Error('Could not initialise WebGL');
        }
        this.initialize();
    }
    initialize() {
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
    attachShader(shaderSource, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(this.gl.getShaderInfoLog(shader));
        }
        this.shaders.push(shader);
        this.gl.attachShader(this.program, shader);
    }
    createBuffer(target, data, usage) {
        const buffer = this.gl.createBuffer();
        if (target && data && usage) {
            this.gl.bindBuffer(target, buffer);
            this.gl.bufferData(target, data, usage);
        }
        return buffer;
    }
    setDrawingOptions(options) {
        if (options === undefined) {
            options = {};
        }
        const scale = options.scale || 1;
        this.gl.uniform1f(this.programInfo.uDSize, scale);
        let offset = options.offset instanceof __WEBPACK_IMPORTED_MODULE_0__geometry__["b" /* Point */] ? options.offset.getPointData() : options.offset;
        if (offset === undefined) {
            offset = [0, 0, 0];
        }
        else if (offset[2] === undefined) {
            offset[2] = 0.0;
        }
        this.gl.uniform3fv(this.programInfo.uOffset, new Float32Array(offset));
        const color = options.color || [0.0, 0.0, 0.0, 1.0];
        this.gl.uniform4fv(this.programInfo.uVColor, new Float32Array(color));
        this.gl.vertexAttribPointer(this.programInfo.vertices, 3, this.gl.FLOAT, false, 0, 0);
    }
    addLine(line) {
        line.buffer = this.createBuffer(this.gl.ARRAY_BUFFER, line.getPointArray(), this.gl.DYNAMIC_DRAW);
        this.lines.push(line);
    }
    removeLine(line) {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i] === line) {
                this.lines.splice(i, 1);
                break;
            }
        }
    }
    drawPoint(point, size) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointBuffer);
        this.setDrawingOptions({ scale: size, offset: point });
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, pointArray.length);
    }
    drawLine(line) {
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
/* harmony export (immutable) */ __webpack_exports__["b"] = GLWrapper;

const color = {
    BLACK: [0, 0, 0, 1],
    A25: [0, 0, 0, 0.25],
    A50: [0, 0, 0, 0.5],
    A75: [0, 0, 0, 0.75],
    WHITE: [1, 1, 1, 1],
    B25: [0.75, 0.75, 0.75, 1],
    B50: [0.5, 0.5, 0.5, 1],
    B75: [0.25, 0.25, 0.25, 1],
    RED: [1, 0, 0, 1],
    GREEN: [0, 1, 0, 1],
    BLUE: [0, 0, 1, 1],
    ORANGE: [1, 0.5, 0.25, 1],
    PURPLE: [1, 0, 1, 1],
    YELLOW: [0, 1, 1, 1]
};
/* harmony export (immutable) */ __webpack_exports__["a"] = color;

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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GLWrapper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Bezier__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__geometry__ = __webpack_require__(0);




function webGLStart() {
    const canvas = document.getElementById('canvas');
    const ctx = new __WEBPACK_IMPORTED_MODULE_1__GLWrapper__["b" /* default */](canvas);
    /* CONTROL POLYGON */
    const polygon = new __WEBPACK_IMPORTED_MODULE_3__geometry__["a" /* Line */]([
        [-0.4, -0.7],
        [-0.7, 0.0],
        [-0.1, 0.6],
        [0.5, 0.1]
    ]);
    polygon.color = __WEBPACK_IMPORTED_MODULE_1__GLWrapper__["a" /* color */].BLACK;
    polygon.markerSize = 1;
    polygon.zOrder = 0.5;
    ctx.addLine(polygon);
    /* BEZIER SUBDIVISION */
    const bezier = new __WEBPACK_IMPORTED_MODULE_2__Bezier__["a" /* default */](polygon);
    for (let line of bezier.levels) {
        ctx.addLine(line);
    }
    ctx.addLine(bezier.curve);
    ctx.addLine(bezier.subdivision);
    /* RENDERING AND UI */
    Object(__WEBPACK_IMPORTED_MODULE_0__ui__["a" /* default */])(canvas, polygon, bezier, onChange, setSegments, setProportion);
    tick();
    function tick() {
        requestAnimationFrame(tick);
        ctx.render();
    }
    function onChange() {
        ctx.changed = true;
        while (polygon.points.length > bezier.levels.length + 2) {
            const added = bezier.incrementLevel();
            ctx.addLine(added);
        }
        while (polygon.points.length < bezier.levels.length + 2) {
            const removed = bezier.decrementLevel();
            ctx.removeLine(removed);
        }
        bezier.update();
    }
    function setSegments(newCount) {
        bezier.segments = newCount;
    }
    function setProportion(newProp) {
        bezier.proportion = newProp;
    }
}
window.addEventListener('load', webGLStart);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindUI;
function bindUI(canvas, polygon, bezier, onChange, setSegments, setProportion) {
    let dragging = null;
    const viewport = {
        width: canvas.width,
        height: canvas.height,
        left: canvas.offsetLeft,
        top: canvas.offsetTop,
        threshold: 0.0004
    };
    canvas.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('contextmenu', rightClick);
    document.getElementById('polygonEnabled').addEventListener('change', (e) => {
        polygon.enabled = e.target.checked;
    });
    document.getElementById('pointsEnabled').addEventListener('change', (e) => {
        polygon.markerSize = e.target.checked ? 1 : 0;
    });
    document.getElementById('scaffoldEnabled').addEventListener('change', (e) => {
        for (let line of bezier.levels) {
            line.enabled = e.target.checked;
        }
    });
    document.getElementById('segments').addEventListener('input', (e) => {
        setSegments(parseInt(e.target.value));
    });
    document.getElementById('proportion').addEventListener('input', (e) => {
        setProportion(parseInt(e.target.value) / 100);
    });
    function mouseDown(e) {
        if (e.button == 2) {
            return;
        }
        e.preventDefault();
        const { x, y } = getViewportXY(e);
        dragging = polygon.points.find(p => dist(p, { x, y }) <= viewport.threshold) || null;
    }
    function mouseUp() {
        dragging = null;
    }
    ;
    function mouseMove(e) {
        if (dragging !== null) {
            e.preventDefault();
            const { x, y } = getViewportXY(e);
            dragging.x = x;
            dragging.y = y;
            polygon.changed = true;
            onChange();
        }
    }
    function rightClick(e) {
        e.preventDefault();
        const { x, y } = getViewportXY(e);
        const removed = polygon.points.find(p => dist(p, { x, y }) <= viewport.threshold);
        if (removed !== undefined) {
            polygon.removePoint(removed);
        }
        else {
            polygon.addPoint([x, y]);
        }
        polygon.changed = true;
        onChange();
    }
    function getViewportXY(e) {
        const x = -1 + (e.pageX - viewport.left) * 2 / viewport.width;
        const y = -1 * (-1 + (e.pageY - viewport.left) * 2 / viewport.width);
        return { x, y };
    }
    function dist(a, b) {
        return Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2);
    }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export deCasteljauIterative */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__geometry__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GLWrapper__ = __webpack_require__(1);


class Bezier {
    constructor(polygon) {
        this.polygon = polygon;
        this.levels = [];
        this.curve = new __WEBPACK_IMPORTED_MODULE_0__geometry__["a" /* Line */]();
        this.curve.color = __WEBPACK_IMPORTED_MODULE_1__GLWrapper__["a" /* color */].ORANGE;
        this.subdivision = new __WEBPACK_IMPORTED_MODULE_0__geometry__["a" /* Line */]();
        this.subdivision.zOrder = 0.25;
        this.subdivision.color = __WEBPACK_IMPORTED_MODULE_1__GLWrapper__["a" /* color */].GREEN;
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
    initLevels() {
        for (let i = 0; i < this.polygon.points.length - 2; i++) {
            this.incrementLevel();
        }
    }
    calculateScaffold() {
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
    calculateCurve() {
        const step = 1 / (this.segments * (this.polygon.points.length - 1));
        let current = step;
        this.curve.points.length = 0;
        this.curve.addPoint(this.polygon.points[0].getPointData());
        while (current < 1) {
            let scaffold = new __WEBPACK_IMPORTED_MODULE_0__geometry__["a" /* Line */](this.polygon);
            while (scaffold.points.length > 2) {
                scaffold = deCasteljauIterative(scaffold, current);
            }
            this.curve.addPoint(interpolate(scaffold.points[0], scaffold.points[1], current));
            current += step;
        }
        this.curve.addPoint(this.polygon.points[this.polygon.points.length - 1].getPointData());
        this.curve.changed = true;
    }
    update(proportion) {
        if (proportion !== undefined) {
            this.proportion = proportion;
        }
        this.calculateScaffold();
        this.calculateCurve();
    }
    incrementLevel() {
        const lastLevel = this.levels[this.levels.length - 1] || this.polygon;
        const line = deCasteljauIterative(lastLevel, this.proportion);
        line.color = __WEBPACK_IMPORTED_MODULE_1__GLWrapper__["a" /* color */].A25;
        this.levels.push(line);
        return line;
    }
    decrementLevel() {
        return this.levels.pop();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bezier;

function deCasteljauIterative(line, prop) {
    const newLine = new __WEBPACK_IMPORTED_MODULE_0__geometry__["a" /* Line */]();
    for (let i = 0; i < line.points.length - 1; i++) {
        const p1 = line.points[i];
        const p2 = line.points[i + 1];
        newLine.addPoint(interpolate(p1, p2, prop));
    }
    return newLine;
}
function interpolate(a, b, prop) {
    return [(1 - prop) * a.x + prop * b.x, (1 - prop) * a.y + prop * b.y];
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDZmMGMzMGVhNDUzNWI4MzQ0YzIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dlb21ldHJ5LnRzIiwid2VicGFjazovLy8uL3NyYy9HTFdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VpLnRzIiwid2VicGFjazovLy8uL3NyYy9CZXppZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7UUFFQTtRQUNBOzs7Ozs7OztBQ3hETyxNQUFNLEtBQUs7SUFJZCxZQUFZLENBQVMsRUFBRSxDQUFTO1FBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQUMsR0FBRyxHQUFHO1FBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBQUE7QUFBQTtBQUVNLE1BQU0sSUFBSTtJQWFiLFlBQVksTUFBbUQ7UUFaeEQsWUFBTyxHQUFHLElBQUksQ0FBQztRQUlmLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFDZixl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QUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFBQTtBQUFBO0FBRU0sU0FBUyxvQkFBb0IsQ0FBQyxJQUFVLEVBQUUsSUFBWTtJQUN6RCxNQUFNLE9BQU8sR0FBRyxJQUFJLHVEQUFJLEVBQUUsQ0FBQztJQUMzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWTtJQUNuRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUMiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkNmYwYzMwZWE0NTM1YjgzNDRjMiIsImV4cG9ydCBpbnRlcmZhY2UgSVBvaW50IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50IGltcGxlbWVudHMgSVBvaW50IHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBvaW50RGF0YSh6ID0gMC4wKSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgel07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lIHtcclxuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBwb2ludHM6IEFycmF5PFBvaW50PjtcclxuICAgIHB1YmxpYyBidWZmZXI6IFdlYkdMQnVmZmVyO1xyXG4gICAgcHVibGljIGNvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIHB1YmxpYyBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBtYXJrZXJTaXplID0gMDtcclxuICAgIHB1YmxpYyB6T3JkZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBjb25zdHJ1Y3RvcihsaW5lOiBMaW5lKTtcclxuICAgIGNvbnN0cnVjdG9yKHBvaW50czogQXJyYXk8UG9pbnQ+KTtcclxuICAgIGNvbnN0cnVjdG9yKHBvaW50czogQXJyYXk8QXJyYXk8bnVtYmVyPj4pO1xyXG4gICAgY29uc3RydWN0b3Ioc291cmNlPzogTGluZSB8IEFycmF5PFBvaW50PiB8IEFycmF5PEFycmF5PG51bWJlcj4+KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgICAgICBpZiAoc291cmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlQb2ludHMoc291cmNlIGFzIGFueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBbMC4wLCAwLjAsIDAuMCwgMS4wXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFwcGx5UG9pbnRzKCk7XHJcbiAgICBwcml2YXRlIGFwcGx5UG9pbnRzKGxpbmU6IExpbmUpO1xyXG4gICAgcHJpdmF0ZSBhcHBseVBvaW50cyhwb2ludHM6IEFycmF5PFBvaW50Pik7XHJcbiAgICBwcml2YXRlIGFwcGx5UG9pbnRzKHBvaW50czogQXJyYXk8QXJyYXk8bnVtYmVyPj4pO1xyXG4gICAgcHJpdmF0ZSBhcHBseVBvaW50cyhzb3VyY2U/OiBMaW5lIHwgQXJyYXk8UG9pbnQ+IHwgQXJyYXk8QXJyYXk8bnVtYmVyPj4pIHtcclxuICAgICAgICB0aGlzLnBvaW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIExpbmUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBvaW50IG9mIHNvdXJjZS5wb2ludHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFBvaW50KHBvaW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBvaW50IG9mIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUG9pbnQocG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZFBvaW50KHBvaW50OiBQb2ludCB8IEFycmF5PG51bWJlcj4pIHtcclxuICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBQb2ludCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKG5ldyBQb2ludChwb2ludFswXSwgcG9pbnRbMV0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUG9pbnQocG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludHNbaV0gPT09IHBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UG9pbnRzKGxpbmU6IExpbmUpO1xyXG4gICAgc2V0UG9pbnRzKHBvaW50czogQXJyYXk8UG9pbnQ+KTtcclxuICAgIHNldFBvaW50cyhwb2ludHM6IEFycmF5PEFycmF5PG51bWJlcj4+KTtcclxuICAgIHNldFBvaW50cyhzb3VyY2U6IExpbmUgfCBBcnJheTxQb2ludD4gfCBBcnJheTxBcnJheTxudW1iZXI+Pikge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hcHBseVBvaW50cyhzb3VyY2UgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQb2ludEFycmF5KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHRoaXMucG9pbnRzLnJlZHVjZSgocCwgYykgPT4gcC5jb25jYXQoYy5nZXRQb2ludERhdGEoLXRoaXMuek9yZGVyKSksIFtdKSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZ2VvbWV0cnkudHMiLCJpbXBvcnQgeyBMaW5lLCBQb2ludCB9IGZyb20gXCIuL2dlb21ldHJ5XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHTFdyYXBwZXIge1xyXG4gICAgcHJpdmF0ZSBwcm9ncmFtSW5mbzogeyB2ZXJ0aWNlczogbnVtYmVyLCB1VkNvbG9yOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbiwgdU9mZnNldDogV2ViR0xVbmlmb3JtTG9jYXRpb24sIHVEU2l6ZTogV2ViR0xVbmlmb3JtTG9jYXRpb24gfTtcclxuICAgIHByaXZhdGUgcG9pbnRCdWZmZXI6IFdlYkdMQnVmZmVyO1xyXG5cclxuICAgIHByaXZhdGUgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICBwcml2YXRlIHByb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIHByaXZhdGUgc2hhZGVyczogQXJyYXk8V2ViR0xTaGFkZXI+O1xyXG4gICAgcHJpdmF0ZSBsaW5lczogQXJyYXk8TGluZT47XHJcblxyXG4gICAgcHVibGljIGNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbDInKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmdsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGluaXRpYWxpc2UgV2ViR0wnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLnByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICB0aGlzLnNoYWRlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmxpbmVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigxLjAsIDEuMCwgMS4wLCAxLjApO1xyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlKHRoaXMuZ2wuREVQVEhfVEVTVCk7XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZGVyKHZlcnRleFNvdXJjZSwgdGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRlcihmcmFnbWVudFNvdXJjZSwgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIodGhpcy5wcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBpbml0aWFsaXNlIHNoYWRlcnMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvZ3JhbUluZm8gPSB7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzOiB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgJ2FWZXJ0ZXhQb3NpdGlvbicpLFxyXG4gICAgICAgICAgICB1VkNvbG9yOiB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sICd1VkNvbG9yJyksXHJcbiAgICAgICAgICAgIHVPZmZzZXQ6IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgJ3VPZmZzZXQnKSxcclxuICAgICAgICAgICAgdURTaXplOiB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sICd1RFNpemUnKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnByb2dyYW1JbmZvLnZlcnRpY2VzKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludEJ1ZmZlciA9IHRoaXMuY3JlYXRlQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHBvaW50QXJyYXkucmVkdWNlKChwLCBjKSA9PiBwLmNvbmNhdChjKSwgW10pKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhdHRhY2hTaGFkZXIoc2hhZGVyU291cmNlLCB0eXBlOiBHTGVudW0pIHtcclxuICAgICAgICBjb25zdCBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNoYWRlclNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzLnB1c2goc2hhZGVyKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLnByb2dyYW0sIHNoYWRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVCdWZmZXIodGFyZ2V0PzogR0xlbnVtLCBkYXRhPzogQXJyYXlCdWZmZXIsIHVzYWdlPzogR0xlbnVtKSB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCAmJiBkYXRhICYmIHVzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0YXJnZXQsIGJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0YXJnZXQsIGRhdGEsIHVzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBidWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXREcmF3aW5nT3B0aW9ucyhvcHRpb25zPzogeyBzY2FsZT86IG51bWJlciwgb2Zmc2V0PzogUG9pbnQgfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlcj9dLCBjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIH0pIHtcclxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IG9wdGlvbnMgPSB7fTsgfVxyXG4gICAgICAgIGNvbnN0IHNjYWxlID0gb3B0aW9ucy5zY2FsZSB8fCAxO1xyXG4gICAgICAgIHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMucHJvZ3JhbUluZm8udURTaXplLCBzY2FsZSk7XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXQgPSBvcHRpb25zLm9mZnNldCBpbnN0YW5jZW9mIFBvaW50ID8gb3B0aW9ucy5vZmZzZXQuZ2V0UG9pbnREYXRhKCkgOiBvcHRpb25zLm9mZnNldDtcclxuICAgICAgICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gWzAsIDAsIDBdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0WzJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2Zmc2V0WzJdID0gMC4wO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnVuaWZvcm0zZnYodGhpcy5wcm9ncmFtSW5mby51T2Zmc2V0LCBuZXcgRmxvYXQzMkFycmF5KG9mZnNldCkpO1xyXG5cclxuICAgICAgICBjb25zdCBjb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgWzAuMCwgMC4wLCAwLjAsIDEuMF07XHJcbiAgICAgICAgdGhpcy5nbC51bmlmb3JtNGZ2KHRoaXMucHJvZ3JhbUluZm8udVZDb2xvciwgbmV3IEZsb2F0MzJBcnJheShjb2xvcikpO1xyXG5cclxuICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5wcm9ncmFtSW5mby52ZXJ0aWNlcywgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpbmUobGluZTogTGluZSkge1xyXG4gICAgICAgIGxpbmUuYnVmZmVyID0gdGhpcy5jcmVhdGVCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIGxpbmUuZ2V0UG9pbnRBcnJheSgpLCB0aGlzLmdsLkRZTkFNSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUxpbmUobGluZTogTGluZSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5lc1tpXSA9PT0gbGluZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3UG9pbnQocG9pbnQ6IFBvaW50LCBzaXplOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMucG9pbnRCdWZmZXIpO1xyXG4gICAgICAgIHRoaXMuc2V0RHJhd2luZ09wdGlvbnMoeyBzY2FsZTogc2l6ZSwgb2Zmc2V0OiBwb2ludCB9KTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRV9GQU4sIDAsIHBvaW50QXJyYXkubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3TGluZShsaW5lOiBMaW5lKSB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBsaW5lLmJ1ZmZlcik7XHJcbiAgICAgICAgaWYgKGxpbmUuY2hhbmdlZCB8fCB0aGlzLmNoYW5nZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBsaW5lLmdldFBvaW50QXJyYXkoKSwgdGhpcy5nbC5EWU5BTUlDX0RSQVcpO1xyXG4gICAgICAgICAgICBsaW5lLmNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXREcmF3aW5nT3B0aW9ucyh7IGNvbG9yOiBsaW5lLmNvbG9yIH0pO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLkxJTkVfU1RSSVAsIDAsIGxpbmUucG9pbnRzLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChsaW5lLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0xpbmUobGluZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGxpbmUubWFya2VyU2l6ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxpbmUucG9pbnRzLmZvckVhY2gocG9pbnQgPT4gdGhpcy5kcmF3UG9pbnQocG9pbnQsIGxpbmUubWFya2VyU2l6ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZWQgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbnR5cGUgQ29sb3IgPSBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb2xvciA9IHtcclxuICAgIEJMQUNLOiBbMCwgMCwgMCwgMV0gYXMgQ29sb3IsXHJcbiAgICBBMjU6IFswLCAwLCAwLCAwLjI1XSBhcyBDb2xvcixcclxuICAgIEE1MDogWzAsIDAsIDAsIDAuNV0gYXMgQ29sb3IsXHJcbiAgICBBNzU6IFswLCAwLCAwLCAwLjc1XSBhcyBDb2xvcixcclxuICAgIFdISVRFOiBbMSwgMSwgMSwgMV0gYXMgQ29sb3IsXHJcbiAgICBCMjU6IFswLjc1LCAwLjc1LCAwLjc1LCAxXSBhcyBDb2xvcixcclxuICAgIEI1MDogWzAuNSwgMC41LCAwLjUsIDFdIGFzIENvbG9yLFxyXG4gICAgQjc1OiBbMC4yNSwgMC4yNSwgMC4yNSwgMV0gYXMgQ29sb3IsXHJcbiAgICBSRUQ6IFsxLCAwLCAwLCAxXSBhcyBDb2xvcixcclxuICAgIEdSRUVOOiBbMCwgMSwgMCwgMV0gYXMgQ29sb3IsXHJcbiAgICBCTFVFOiBbMCwgMCwgMSwgMV0gYXMgQ29sb3IsXHJcbiAgICBPUkFOR0U6IFsxLCAwLjUsIDAuMjUsIDFdIGFzIENvbG9yLFxyXG4gICAgUFVSUExFOiBbMSwgMCwgMSwgMV0gYXMgQ29sb3IsXHJcbiAgICBZRUxMT1c6IFswLCAxLCAxLCAxXSBhcyBDb2xvclxyXG59XHJcblxyXG5jb25zdCB2ZXJ0ZXhTb3VyY2UgPSBgXHJcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcclxudW5pZm9ybSB2ZWM0IHVWQ29sb3I7XHJcbnVuaWZvcm0gdmVjMyB1T2Zmc2V0O1xyXG51bmlmb3JtIGZsb2F0IHVEU2l6ZTtcclxudmFyeWluZyB2ZWM0IHZYWVpXX0NvbG9yO1xyXG5cclxudm9pZCBtYWluKHZvaWQpIHtcclxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCh1RFNpemUgKiBhVmVydGV4UG9zaXRpb24gKyB1T2Zmc2V0LCAxLjApO1xyXG4gICAgdlhZWldfQ29sb3IgPSB1VkNvbG9yO1xyXG59XHJcbmA7XHJcblxyXG5jb25zdCBmcmFnbWVudFNvdXJjZSA9IGBcclxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XHJcbnZhcnlpbmcgdmVjNCB2WFlaV19Db2xvcjtcclxuXHJcbnZvaWQgbWFpbih2b2lkKSB7XHJcbiAgICBnbF9GcmFnQ29sb3IgPSB2WFlaV19Db2xvcjtcclxufVxyXG5gO1xyXG5cclxuY29uc3QgcG9pbnRQcmVjaXNpb24gPSAxMjtcclxuY29uc3QgcG9pbnRBcnJheSA9IFtcclxuICAgIFswLjAsIDAuMCwgLTEuMF1cclxuXS5jb25jYXQoKG5ldyBBcnJheShwb2ludFByZWNpc2lvbiArIDEpKS5maWxsKDApLm1hcCgocCwgaSkgPT4gWzAuMDIgKiBNYXRoLmNvcyhpICogTWF0aC5QSSAqIDIgLyBwb2ludFByZWNpc2lvbiksIDAuMDIgKiBNYXRoLnNpbihpICogTWF0aC5QSSAqIDIgLyBwb2ludFByZWNpc2lvbiksIC0xLjBdKSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dMV3JhcHBlci50cyIsImltcG9ydCBiaW5kVUkgZnJvbSAnLi91aSc7XHJcblxyXG5pbXBvcnQgR0xXcmFwcGVyLCB7IGNvbG9yIH0gZnJvbSAnLi9HTFdyYXBwZXInO1xyXG5pbXBvcnQgQmV6aWVyIGZyb20gJy4vQmV6aWVyJztcclxuaW1wb3J0IHsgTGluZSB9IGZyb20gJy4vZ2VvbWV0cnknO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHdlYkdMU3RhcnQoKSB7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBjdHggPSBuZXcgR0xXcmFwcGVyKGNhbnZhcyk7XHJcblxyXG4gICAgLyogQ09OVFJPTCBQT0xZR09OICovXHJcblxyXG4gICAgY29uc3QgcG9seWdvbiA9IG5ldyBMaW5lKFtcclxuICAgICAgICBbLTAuNCwgLTAuN10sXHJcbiAgICAgICAgWy0wLjcsIDAuMF0sXHJcbiAgICAgICAgWy0wLjEsIDAuNl0sXHJcbiAgICAgICAgWzAuNSwgMC4xXVxyXG4gICAgXSk7XHJcbiAgICBwb2x5Z29uLmNvbG9yID0gY29sb3IuQkxBQ0s7XHJcbiAgICBwb2x5Z29uLm1hcmtlclNpemUgPSAxO1xyXG4gICAgcG9seWdvbi56T3JkZXIgPSAwLjU7XHJcbiAgICBjdHguYWRkTGluZShwb2x5Z29uKTtcclxuXHJcbiAgICAvKiBCRVpJRVIgU1VCRElWSVNJT04gKi9cclxuXHJcbiAgICBjb25zdCBiZXppZXIgPSBuZXcgQmV6aWVyKHBvbHlnb24pO1xyXG5cclxuICAgIGZvciAobGV0IGxpbmUgb2YgYmV6aWVyLmxldmVscykge1xyXG4gICAgICAgIGN0eC5hZGRMaW5lKGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5hZGRMaW5lKGJlemllci5jdXJ2ZSk7XHJcbiAgICBjdHguYWRkTGluZShiZXppZXIuc3ViZGl2aXNpb24pO1xyXG5cclxuICAgIC8qIFJFTkRFUklORyBBTkQgVUkgKi9cclxuXHJcbiAgICBiaW5kVUkoY2FudmFzLCBwb2x5Z29uLCBiZXppZXIsIG9uQ2hhbmdlLCBzZXRTZWdtZW50cywgc2V0UHJvcG9ydGlvbik7XHJcblxyXG4gICAgdGljaygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2soKSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xyXG4gICAgICAgIGN0eC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcclxuICAgICAgICBjdHguY2hhbmdlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaWxlIChwb2x5Z29uLnBvaW50cy5sZW5ndGggPiBiZXppZXIubGV2ZWxzLmxlbmd0aCArIDIpIHtcclxuICAgICAgICAgICAgY29uc3QgYWRkZWQgPSBiZXppZXIuaW5jcmVtZW50TGV2ZWwoKTtcclxuICAgICAgICAgICAgY3R4LmFkZExpbmUoYWRkZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAocG9seWdvbi5wb2ludHMubGVuZ3RoIDwgYmV6aWVyLmxldmVscy5sZW5ndGggKyAyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBiZXppZXIuZGVjcmVtZW50TGV2ZWwoKTtcclxuICAgICAgICAgICAgY3R4LnJlbW92ZUxpbmUocmVtb3ZlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiZXppZXIudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0U2VnbWVudHMobmV3Q291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGJlemllci5zZWdtZW50cyA9IG5ld0NvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldFByb3BvcnRpb24obmV3UHJvcCkge1xyXG4gICAgICAgIGJlemllci5wcm9wb3J0aW9uID0gbmV3UHJvcDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgd2ViR0xTdGFydCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4udHMiLCJpbXBvcnQgeyBMaW5lLCBJUG9pbnQgfSBmcm9tICcuL2dlb21ldHJ5JztcclxuaW1wb3J0IEJlemllciBmcm9tICcuL0Jlemllcic7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmluZFVJKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHBvbHlnb246IExpbmUsIGJlemllcjogQmV6aWVyLCBvbkNoYW5nZTogRnVuY3Rpb24sIHNldFNlZ21lbnRzOiBGdW5jdGlvbiwgc2V0UHJvcG9ydGlvbjogRnVuY3Rpb24pIHtcclxuICAgIGxldCBkcmFnZ2luZyA9IG51bGw7XHJcblxyXG4gICAgY29uc3Qgdmlld3BvcnQgPSB7XHJcbiAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgbGVmdDogY2FudmFzLm9mZnNldExlZnQsXHJcbiAgICAgICAgdG9wOiBjYW52YXMub2Zmc2V0VG9wLFxyXG4gICAgICAgIHRocmVzaG9sZDogMC4wMDA0XHJcbiAgICB9O1xyXG5cclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd24pO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXApO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCByaWdodENsaWNrKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9seWdvbkVuYWJsZWQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xyXG4gICAgICAgIHBvbHlnb24uZW5hYmxlZCA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvaW50c0VuYWJsZWQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xyXG4gICAgICAgIHBvbHlnb24ubWFya2VyU2l6ZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID8gMSA6IDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NhZmZvbGRFbmFibGVkJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGJlemllci5sZXZlbHMpIHtcclxuICAgICAgICAgICAgbGluZS5lbmFibGVkID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlZ21lbnRzJykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgIHNldFNlZ21lbnRzKHBhcnNlSW50KChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb3BvcnRpb24nKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICAgICAgc2V0UHJvcG9ydGlvbihwYXJzZUludCgoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpIC8gMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vdXNlRG93bihlOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGUuYnV0dG9uID09IDIpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gZ2V0Vmlld3BvcnRYWShlKTtcclxuICAgICAgICBkcmFnZ2luZyA9IHBvbHlnb24ucG9pbnRzLmZpbmQocCA9PiBkaXN0KHAsIHsgeCwgeSB9KSA8PSB2aWV3cG9ydC50aHJlc2hvbGQpIHx8IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW91c2VVcCgpIHtcclxuICAgICAgICBkcmFnZ2luZyA9IG51bGw7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vdXNlTW92ZShlOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGRyYWdnaW5nICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBnZXRWaWV3cG9ydFhZKGUpO1xyXG4gICAgICAgICAgICBkcmFnZ2luZy54ID0geDtcclxuICAgICAgICAgICAgZHJhZ2dpbmcueSA9IHk7XHJcbiAgICAgICAgICAgIHBvbHlnb24uY2hhbmdlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBvbkNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByaWdodENsaWNrKGU6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBnZXRWaWV3cG9ydFhZKGUpO1xyXG4gICAgICAgIGNvbnN0IHJlbW92ZWQgPSBwb2x5Z29uLnBvaW50cy5maW5kKHAgPT4gZGlzdChwLCB7IHgsIHkgfSkgPD0gdmlld3BvcnQudGhyZXNob2xkKTtcclxuICAgICAgICBpZiAocmVtb3ZlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHBvbHlnb24ucmVtb3ZlUG9pbnQocmVtb3ZlZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcG9seWdvbi5hZGRQb2ludChbeCwgeV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcG9seWdvbi5jaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICBvbkNoYW5nZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0WFkoZTogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHggPSAtMSArIChlLnBhZ2VYIC0gdmlld3BvcnQubGVmdCkgKiAyIC8gdmlld3BvcnQud2lkdGg7XHJcbiAgICAgICAgY29uc3QgeSA9IC0xICogKC0xICsgKGUucGFnZVkgLSB2aWV3cG9ydC5sZWZ0KSAqIDIgLyB2aWV3cG9ydC53aWR0aCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IHgsIHkgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXN0KGE6IElQb2ludCwgYjogSVBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIChhLnggLSBiLngpICoqIDIgKyAoYS55IC0gYi55KSAqKiAyO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91aS50cyIsImltcG9ydCB7IExpbmUsIElQb2ludCB9IGZyb20gXCIuL2dlb21ldHJ5XCI7XHJcbmltcG9ydCB7IGNvbG9yIH0gZnJvbSBcIi4vR0xXcmFwcGVyXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmV6aWVyIHtcclxuICAgIHByaXZhdGUgcG9seWdvbjogTGluZTtcclxuICAgIHByaXZhdGUgX3Byb3BvcnRpb246IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlZ21lbnRzOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGxldmVsczogQXJyYXk8TGluZT47XHJcbiAgICBwdWJsaWMgY3VydmU6IExpbmU7XHJcbiAgICBwdWJsaWMgc3ViZGl2aXNpb246IExpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9seWdvbikge1xyXG4gICAgICAgIHRoaXMucG9seWdvbiA9IHBvbHlnb247XHJcbiAgICAgICAgdGhpcy5sZXZlbHMgPSBbXTtcclxuICAgICAgICB0aGlzLmN1cnZlID0gbmV3IExpbmUoKTtcclxuICAgICAgICB0aGlzLmN1cnZlLmNvbG9yID0gY29sb3IuT1JBTkdFO1xyXG4gICAgICAgIHRoaXMuc3ViZGl2aXNpb24gPSBuZXcgTGluZSgpO1xyXG4gICAgICAgIHRoaXMuc3ViZGl2aXNpb24uek9yZGVyID0gMC4yNTtcclxuICAgICAgICB0aGlzLnN1YmRpdmlzaW9uLmNvbG9yID0gY29sb3IuR1JFRU47XHJcbiAgICAgICAgdGhpcy5zdWJkaXZpc2lvbi5tYXJrZXJTaXplID0gMC41O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRMZXZlbHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wb3J0aW9uID0gMC41O1xyXG4gICAgICAgIHRoaXMuc2VnbWVudHMgPSAyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzZWdtZW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VnbWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNlZ21lbnRzKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fc2VnbWVudHMgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUN1cnZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByb3BvcnRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BvcnRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHByb3BvcnRpb24odmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9wcm9wb3J0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVTY2FmZm9sZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdExldmVscygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoIC0gMjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50TGV2ZWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVTY2FmZm9sZCgpIHtcclxuICAgICAgICB0aGlzLnN1YmRpdmlzaW9uLnBvaW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuc3ViZGl2aXNpb24uYWRkUG9pbnQodGhpcy5wb2x5Z29uLnBvaW50c1swXSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2TGV2ZWwgPSB0aGlzLmxldmVsc1tpIC0gMV0gfHwgdGhpcy5wb2x5Z29uO1xyXG4gICAgICAgICAgICB0aGlzLmxldmVsc1tpXS5zZXRQb2ludHMoZGVDYXN0ZWxqYXVJdGVyYXRpdmUocHJldkxldmVsLCB0aGlzLnByb3BvcnRpb24pKTtcclxuICAgICAgICAgICAgdGhpcy5sZXZlbHNbaV0uY2hhbmdlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YmRpdmlzaW9uLmFkZFBvaW50KHRoaXMubGV2ZWxzW2ldLnBvaW50c1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxhc3RMZXZlbCA9IHRoaXMubGV2ZWxzW3RoaXMubGV2ZWxzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IGludGVycG9sYXRlKGxhc3RMZXZlbC5wb2ludHNbMF0sIGxhc3RMZXZlbC5wb2ludHNbMV0sIHRoaXMucHJvcG9ydGlvbik7XHJcbiAgICAgICAgdGhpcy5zdWJkaXZpc2lvbi5hZGRQb2ludChtYXJrZXIpO1xyXG4gICAgICAgIHRoaXMuc3ViZGl2aXNpb24uY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVDdXJ2ZSgpIHtcclxuICAgICAgICBjb25zdCBzdGVwID0gMSAvICh0aGlzLnNlZ21lbnRzICogKHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoIC0gMSkpO1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gc3RlcDtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJ2ZS5wb2ludHMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLmN1cnZlLmFkZFBvaW50KHRoaXMucG9seWdvbi5wb2ludHNbMF0uZ2V0UG9pbnREYXRhKCkpO1xyXG4gICAgICAgIHdoaWxlIChjdXJyZW50IDwgMSkge1xyXG4gICAgICAgICAgICBsZXQgc2NhZmZvbGQgPSBuZXcgTGluZSh0aGlzLnBvbHlnb24pO1xyXG4gICAgICAgICAgICB3aGlsZSAoc2NhZmZvbGQucG9pbnRzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgIHNjYWZmb2xkID0gZGVDYXN0ZWxqYXVJdGVyYXRpdmUoc2NhZmZvbGQsIGN1cnJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VydmUuYWRkUG9pbnQoaW50ZXJwb2xhdGUoc2NhZmZvbGQucG9pbnRzWzBdLCBzY2FmZm9sZC5wb2ludHNbMV0sIGN1cnJlbnQpKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQgKz0gc3RlcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJ2ZS5hZGRQb2ludCh0aGlzLnBvbHlnb24ucG9pbnRzW3RoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoIC0gMV0uZ2V0UG9pbnREYXRhKCkpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlLmNoYW5nZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUocHJvcG9ydGlvbj8pIHtcclxuICAgICAgICBpZiAocHJvcG9ydGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcG9ydGlvbiA9IHByb3BvcnRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVNjYWZmb2xkKCk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVDdXJ2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluY3JlbWVudExldmVsKCkge1xyXG4gICAgICAgIGNvbnN0IGxhc3RMZXZlbCA9IHRoaXMubGV2ZWxzW3RoaXMubGV2ZWxzLmxlbmd0aCAtIDFdIHx8IHRoaXMucG9seWdvbjtcclxuICAgICAgICBjb25zdCBsaW5lID0gZGVDYXN0ZWxqYXVJdGVyYXRpdmUobGFzdExldmVsLCB0aGlzLnByb3BvcnRpb24pO1xyXG4gICAgICAgIGxpbmUuY29sb3IgPSBjb2xvci5BMjU7XHJcbiAgICAgICAgdGhpcy5sZXZlbHMucHVzaChsaW5lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgZGVjcmVtZW50TGV2ZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGV2ZWxzLnBvcCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVDYXN0ZWxqYXVJdGVyYXRpdmUobGluZTogTGluZSwgcHJvcDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBuZXdMaW5lID0gbmV3IExpbmUoKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZS5wb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcDEgPSBsaW5lLnBvaW50c1tpXTtcclxuICAgICAgICBjb25zdCBwMiA9IGxpbmUucG9pbnRzW2kgKyAxXTtcclxuICAgICAgICBuZXdMaW5lLmFkZFBvaW50KGludGVycG9sYXRlKHAxLCBwMiwgcHJvcCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld0xpbmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGludGVycG9sYXRlKGE6IElQb2ludCwgYjogSVBvaW50LCBwcm9wOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBbKDEgLSBwcm9wKSAqIGEueCArIHByb3AgKiBiLngsICgxIC0gcHJvcCkgKiBhLnkgKyBwcm9wICogYi55XVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9CZXppZXIudHMiXSwic291cmNlUm9vdCI6IiJ9
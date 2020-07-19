import bindUI from './ui';

import GLWrapper, { color } from './GLWrapper';
import Bezier from './Bezier';
import { Line } from './geometry';


function webGLStart() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = new GLWrapper(canvas);

    /* CONTROL POLYGON */

    const polygon = new Line([
        [-0.4, -0.7],
        [-0.7, 0.0],
        [-0.1, 0.6],
        [0.5, 0.1]
    ]);
    polygon.color = color.BLACK;
    polygon.markerSize = 1;
    polygon.zOrder = 0.5;
    ctx.addLine(polygon);

    /* BEZIER SUBDIVISION */

    const bezier = new Bezier(polygon);

    for (let line of bezier.levels) {
        ctx.addLine(line);
    }

    ctx.addLine(bezier.curve);
    ctx.addLine(bezier.subdivision);

    /* RENDERING AND UI */

    bindUI(canvas, polygon, bezier, onChange, setSegments, setProportion);

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

    function setSegments(newCount: number) {
        bezier.segments = newCount;
    }

    function setProportion(newProp) {
        bezier.proportion = newProp;
    }
}


window.addEventListener('load', webGLStart);
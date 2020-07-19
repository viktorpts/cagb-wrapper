import { Line, IPoint } from './geometry';
import Bezier from './Bezier';


export default function bindUI(canvas: HTMLCanvasElement, polygon: Line, bezier: Bezier, onChange: Function, setSegments: Function, setProportion: Function) {
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
        polygon.enabled = (e.target as HTMLInputElement).checked;
    });

    document.getElementById('pointsEnabled').addEventListener('change', (e) => {
        polygon.markerSize = (e.target as HTMLInputElement).checked ? 1 : 0;
    });

    document.getElementById('scaffoldEnabled').addEventListener('change', (e) => {
        for (let line of bezier.levels) {
            line.enabled = (e.target as HTMLInputElement).checked;
        }
    });

    document.getElementById('segments').addEventListener('input', (e) => {
        setSegments(parseInt((e.target as HTMLInputElement).value));
    });

    document.getElementById('proportion').addEventListener('input', (e) => {
        setProportion(parseInt((e.target as HTMLInputElement).value) / 100);
    });

    function mouseDown(e: MouseEvent) {
        if (e.button == 2) { return; }
        e.preventDefault();
        const { x, y } = getViewportXY(e);
        dragging = polygon.points.find(p => dist(p, { x, y }) <= viewport.threshold) || null;
    }

    function mouseUp() {
        dragging = null;
    };

    function mouseMove(e: MouseEvent) {
        if (dragging !== null) {
            e.preventDefault();
            const { x, y } = getViewportXY(e);
            dragging.x = x;
            dragging.y = y;
            polygon.changed = true;

            onChange();
        }
    }

    function rightClick(e: MouseEvent) {
        e.preventDefault();
        const { x, y } = getViewportXY(e);
        const removed = polygon.points.find(p => dist(p, { x, y }) <= viewport.threshold);
        if (removed !== undefined) {
            polygon.removePoint(removed);
        } else {
            polygon.addPoint([x, y]);
        }

        polygon.changed = true;
        onChange();
    }

    function getViewportXY(e: MouseEvent) {
        const x = -1 + (e.pageX - viewport.left) * 2 / viewport.width;
        const y = -1 * (-1 + (e.pageY - viewport.left) * 2 / viewport.width);

        return { x, y };
    }

    function dist(a: IPoint, b: IPoint) {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    }
}

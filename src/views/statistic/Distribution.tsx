import { useEffect, useRef } from "react";
function lerpColor(c1: string, c2: string, t: number): string {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * t)
        .toString(16)
        .padStart(2, "0");
    const g = Math.round(g1 + (g2 - g1) * t)
        .toString(16)
        .padStart(2, "0");
    const b = Math.round(b1 + (b2 - b1) * t)
        .toString(16)
        .padStart(2, "0");

    return `#${r}${g}${b}`;
}

export interface DistributionData {
    id: number;
    value: number;
    latitude: number;
    longitude: number;
}
export type DistributionBorder = Omit<DistributionData, "value">;

export default function Distribution(props: {
    border: DistributionBorder[];
    data: DistributionData[];
    type: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const offsetX = 20;
        const offsetY = 20;
        initCanvas(canvas, ctx);
        // fill white background using the actual canvas pixel size
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBorder(
            ctx,
            props.border,
            canvas.clientWidth - offsetX,
            canvas.clientHeight - offsetY,
            offsetY,
        );
        drawHeatmap(
            ctx,
            props.data,
            canvas.clientWidth - offsetX,
            canvas.clientHeight - offsetY,
            offsetY,
            "#1e3c72",
            "#ff512f",
        );

        return () => {
            unmountCanvas(canvas, ctx);
        };
    }, [props.border]);

    const initCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        // set the internale drawing buffer
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        // keep the canvas size on page the same
        canvas.style.width = `${canvas.clientWidth}px`;
        canvas.style.height = `${canvas.clientHeight}px`;
        // scale the context to match the device pixel ratio
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const unmountCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
    };

    // define the basic point
    const R = 6371000;
    const refLat = (props.border[0].latitude * Math.PI) / 180;
    const refLon = (props.border[0].longitude * Math.PI) / 180;

    const drawBorder = (
        ctx: CanvasRenderingContext2D,
        data: DistributionBorder[],
        width: number,
        height: number,
        offset: number,
    ) => {
        if (!data.length) return;

        const points = calcPoints(data);
        const { scale, minX, minY, offsetX, offsetY } = calcParams(points, {
            width,
            height,
            offset,
        });

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 1;

        points.forEach((p, i) => {
            const x = (p.x - minX) * scale + offsetX;
            const y = height - (p.y - minY) * scale - offsetY;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.closePath();
        ctx.stroke();
        // put every block inside of the border
        ctx.clip();
    };
    const calcPoints = (
        data: (DistributionBorder & { value?: number })[],
    ): { x: number; y: number; value?: number }[] => {
        return data.map((p) => {
            const latRad = (p.latitude * Math.PI) / 180;
            const lonRad = (p.longitude * Math.PI) / 180;

            const res: { x: number; y: number; value?: number } = {
                x: (lonRad - refLon) * R * Math.cos(refLat),
                y: (latRad - refLat) * R,
            };

            if (p.value) {
                res.value = p.value;
            }

            return res;
        });
    };
    const calcParams = (
        points: ReturnType<typeof calcPoints>,
        options: { width: number; height: number; offset: number },
    ): {
        scale: number;
        minX: number;
        minY: number;
        offsetX: number;
        offsetY: number;
    } => {
        const { width, height, offset } = options;

        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        const scaleX = width / (maxX - minX);
        const scaleY = height / (maxY - minY);
        const scale = Math.min(scaleX, scaleY);

        const scaleWidth = (maxX - minX) * scale;
        const scaleHeight = (maxY - minY) * scale;
        const offsetX = (width - scaleWidth) / 2;
        const offsetY = (height - scaleHeight - offset) / 2;

        return {
            scale,
            minX,
            minY,
            offsetX,
            offsetY,
        };
    };

    const drawHeatmap = (
        ctx: CanvasRenderingContext2D,
        data: DistributionData[],
        width: number,
        height: number,
        offset: number,
        startColor: string,
        endColor: string,
    ) => {
        const blockSizeX = 20;
        const blockSizeY = 10;
        const cols = Math.ceil(width / blockSizeX);
        const rows = Math.ceil(height / blockSizeY);

        const points = calcPoints(data);
        const { scale, minX, minY, offsetX, offsetY } = calcParams(points, {
            width,
            height,
            offset,
        });

        const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

        points.forEach((p) => {
            if (!p.value) return;

            const col = Math.min(
                Math.floor(((p.x - minX) * scale + offsetX) / blockSizeX),
                cols - 1,
            );
            const row = Math.min(
                Math.floor((height - (p.y - minY) * scale - offsetY) / blockSizeY),
                rows - 1,
            );
            grid[row][col] += p.value;
        });
        const allValues = grid.flat();
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);
        const colorScale = maxValue - minValue;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                ctx.fillStyle = lerpColor(startColor, endColor, grid[r][c] / colorScale);
                ctx.fillRect(c * 20, r * 10, (c + 1) * 20, (r + 1) * 20);
            }
        }
    };

    return (
        <canvas
            ref={canvasRef}
            style={{ height: "100%" }}
        />
    );
}

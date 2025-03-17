import Shape from './Shape';
import type { IPoint } from './interface';

export interface PolygonShapeOptions {
  x: number;
  y: number;
  width: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  corners?: number;
  startAngle?: number;
  points?: number[] | number[][] | IPoint[];
  dpr?: number;
}

class PolygonShape extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  corners: number;
  startAngle: number;
  points: number[];
  _points: number[] | number[][] | IPoint[] = [];
  get type() {
    return 'StarShape';
  }
  constructor(
    {
      x,
      y,
      width,
      height = 0,
      fillColor = '#000',
      strokeColor = '#000',
      corners = 3,
      startAngle = 270,
      points = [],
      dpr,
    }: PolygonShapeOptions,
    autoCalcPoint = true,
  ) {
    super({ width, height, dpr });
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.corners = corners;
    this.startAngle = ((startAngle % 360) + 360) % 360;
    this._points = points;
    if (autoCalcPoint) {
      this.points = this.getPoints();
    } else {
      this.points = [];
    }
  }

  calcPoints() {
    const points = [];
    for (let i = 0, angle = this.startAngle; i < this.corners; i++, angle += 360 / this.corners) {
      points.push(
        this.width / 2 + (this.width / 2) * Math.cos((angle / 180) * Math.PI),
        this.height / 2 + (this.height / 2) * Math.sin((angle / 180) * Math.PI),
      );
    }
    return points;
  }

  getPoints() {
    let points = [];
    if (this._points.length > 0) {
      const type = Array.isArray(this._points[0]) ? 'array' : typeof this._points[0];
      for (let i = 0; i < this._points.length; i++) {
        const t = Array.isArray(this._points[i]) ? 'array' : typeof this._points[i];
        if (t !== type) {
          points = [];
          break;
        }
        switch (t) {
          case 'array':
            points.push(...(this._points[i] as number[]));
            break;
          case 'number':
            points.push(this._points[i] as number);
            break;
          case 'object':
            points.push((this._points[i] as IPoint).x, (this._points[i] as IPoint).y);
            break;
        }
      }
    } else {
      points = [];
    }
    if (points.length < 6) {
      points = this.calcPoints();
    }
    return points;
  }

  update({
    x,
    y,
    width,
    height,
    fillColor,
    strokeColor,
    corners,
    startAngle,
    points,
  }: {
    [key in keyof PolygonShapeOptions]?: PolygonShapeOptions[key];
  }) {
    if (typeof x !== 'undefined') {
      this.x = x;
    }
    if (typeof y !== 'undefined') {
      this.y = y;
    }
    if (typeof width !== 'undefined') {
      this.width = width;
    }
    if (typeof height !== 'undefined') {
      this.height = height;
    }
    if (typeof width !== 'undefined' || typeof height !== 'undefined') {
      this.__updateSize({ width: this.width, height: this.height });
    }
    if (typeof fillColor !== 'undefined') {
      this.fillColor = fillColor;
    }
    if (typeof strokeColor !== 'undefined') {
      this.strokeColor = strokeColor;
    }
    if (typeof corners !== 'undefined') {
      this.corners = corners;
    }
    if (typeof startAngle !== 'undefined') {
      this.startAngle = ((startAngle % 360) + 360) % 360;
    }
    if (typeof points !== 'undefined') {
      this._points = points;
    }
    this.points = this.getPoints();
  }
  isInShape(x: number, y: number) {
    const dx = x - this.x * this.dpr;
    const dy = y - this.y * this.dpr;
    if (dx < 0 || dy < 0 || dx > this.width * this.dpr || dy > this.height * this.dpr) return false;
    const imageData = this.__ctx.getImageData(
      0,
      0,
      this.width * this.dpr,
      this.height * this.dpr,
    ).data;
    return imageData[(dy * this.width * this.dpr + dx) * 4 + 3] > 0;
  }
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    super.render(ctx);
    const { __ctx } = this;
    __ctx.fillStyle = this.fillColor;
    __ctx.beginPath();
    __ctx.moveTo(this.points[0] * this.dpr, this.points[1] * this.dpr);
    for (let i = 2; i < this.points.length; i += 2) {
      __ctx.lineTo(this.points[i] * this.dpr, this.points[i + 1] * this.dpr);
    }
    __ctx.fill();
    ctx.drawImage(
      this.__canvas,
      this.x * this.dpr,
      this.y * this.dpr,
      this.width * this.dpr,
      this.height * this.dpr,
    );
  }
}

export default PolygonShape;

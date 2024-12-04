import { clamp } from '@/utils';
import Shape from './Shape';

export interface StarShapeOldOptions {
  x: number;
  y: number;
  width: number;
  height?: number;
  innerRadius?: number;
  fillColor?: string;
  strokeColor?: string;
  corners?: number;
  startAngle?: number;
}

class StarShapeOld extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  innerRadius: number;
  corners: number;
  startAngle: number;
  points: number[];
  get type() {
    return 'StarShape';
  }
  constructor({
    x,
    y,
    width,
    height = 0,
    innerRadius = 0.382,
    fillColor = '#000',
    strokeColor = '#000',
    corners = 3,
    startAngle = 270,
  }: StarShapeOldOptions) {
    super({ width, height });
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.innerRadius = clamp(innerRadius, 0, 1);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.corners = corners;
    this.startAngle = ((startAngle % 360) + 360) % 360;
    this.points = this.calcPoints();
  }
  calcPoints() {
    const points = [];
    for (
      let i = 0, angle = this.startAngle;
      i < this.corners * 2;
      i++, angle += 360 / this.corners / 2
    ) {
      if (i % 2 === 1) {
        points.push(
          this.width / 2 + (this.width / 2) * this.innerRadius * Math.cos((angle / 180) * Math.PI),

          this.height / 2 +
            (this.height / 2) * this.innerRadius * Math.sin((angle / 180) * Math.PI),
        );
      } else {
        points.push(
          this.width / 2 + (this.width / 2) * Math.cos((angle / 180) * Math.PI),
          this.height / 2 + (this.height / 2) * Math.sin((angle / 180) * Math.PI),
        );
      }
    }
    return points;
  }
  update({
    x,
    y,
    width,
    height,
    innerRadius,
    fillColor,
    strokeColor,
    corners,
    startAngle,
  }: {
    [key in keyof StarShapeOldOptions]?: StarShapeOldOptions[key];
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
    if (typeof innerRadius !== 'undefined') {
      this.innerRadius = clamp(innerRadius, 0, 1);
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
    this.points = this.calcPoints();
  }
  isInShape(x: number, y: number) {
    const dx = x - this.x;
    const dy = y - this.y;
    if (dx < 0 || dy < 0 || dx > this.width || dy > this.height) return false;
    const imageData = this.__ctx.getImageData(0, 0, this.width, this.height).data;
    return imageData[(dy * this.width + dx) * 4 + 3] > 0;
  }
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    super.render(ctx);
    const { __ctx } = this;
    __ctx.fillStyle = this.fillColor;
    __ctx.beginPath();
    __ctx.moveTo(this.points[0], this.points[1]);
    for (let i = 2; i < this.points.length; i += 2) {
      __ctx.lineTo(this.points[i], this.points[i + 1]);
    }
    __ctx.fill();
    ctx.drawImage(this.__canvas, this.x, this.y, this.width, this.height);
  }
}

export default StarShapeOld;

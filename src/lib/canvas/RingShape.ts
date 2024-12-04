import Shape from './Shape';
import { getDistance } from './utils';

export interface RingShapeOptions {
  rx: number;
  ry: number;
  outerRadius: number;
  innerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fillColor?: string;
  strokeColor?: string;
}

class RingShape extends Shape {
  rx: number;
  ry: number;
  outerRadius: number;
  innerRadius: number;
  startAngle: number;
  endAngle: number;
  fillColor: string;
  strokeColor: string;
  get type() {
    return 'RingShape';
  }
  constructor({
    rx,
    ry,
    outerRadius,
    innerRadius = 0,
    startAngle = 0,
    endAngle = 360,
    fillColor = '#000',
    strokeColor = '#000',
  }: RingShapeOptions) {
    super();
    this.rx = rx;
    this.ry = ry;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }

  update({
    rx,
    ry,
    outerRadius,
    innerRadius,
    startAngle,
    endAngle,
    fillColor,
    strokeColor,
  }: {
    [key in keyof RingShapeOptions]?: RingShapeOptions[key];
  }) {
    if (typeof rx !== 'undefined') {
      this.rx = rx;
    }
    if (typeof ry !== 'undefined') {
      this.ry = ry;
    }
    if (typeof outerRadius !== 'undefined') {
      this.outerRadius = outerRadius;
    }
    if (typeof innerRadius !== 'undefined') {
      this.innerRadius = innerRadius;
    }
    if (typeof startAngle !== 'undefined') {
      this.startAngle = startAngle;
    }
    if (typeof endAngle !== 'undefined') {
      this.endAngle = endAngle;
    }
    if (typeof fillColor !== 'undefined') {
      this.fillColor = fillColor;
    }
    if (typeof strokeColor !== 'undefined') {
      this.strokeColor = strokeColor;
    }
  }
  isInShape(x: number, y: number) {
    const d = getDistance(x, y, this.rx, this.ry);
    if (d < this.innerRadius || d > this.outerRadius) return false;
    let angle = (Math.acos((x - this.rx) / d) / Math.PI) * 180;
    if (y < this.ry) {
      angle = 360 - angle;
    }
    if (
      angle < this.startAngle % 360 ||
      (this.startAngle % 360 > this.endAngle % 360
        ? angle < this.endAngle % 360
        : angle > this.endAngle % 360)
    )
      return false;
    return true;
  }
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    super.render(ctx);
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.moveTo(
      this.rx + this.innerRadius * Math.cos((this.endAngle / 180) * Math.PI),
      this.ry + this.innerRadius * Math.sin((this.endAngle / 180) * Math.PI),
    );
    ctx.arc(
      this.rx,
      this.ry,
      this.innerRadius,
      (this.endAngle / 180) * Math.PI,
      (this.startAngle / 180) * Math.PI,
      true,
    );
    ctx.lineTo(
      this.rx + this.outerRadius * Math.cos((this.startAngle / 180) * Math.PI),
      this.ry + this.outerRadius * Math.sin((this.startAngle / 180) * Math.PI),
    );
    ctx.arc(
      this.rx,
      this.ry,
      this.outerRadius,
      (this.startAngle / 180) * Math.PI,
      (this.endAngle / 180) * Math.PI,
    );
    ctx.fill();
  }
}

export default RingShape;

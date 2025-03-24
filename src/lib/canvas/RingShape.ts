import Shape, { type BaseShapeOptions } from './Shape';
import { getDistance } from './utils';

export interface RingShapeOptions extends BaseShapeOptions {
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
    ...restParams
  }: RingShapeOptions) {
    super({
      width: outerRadius * 2,
      height: outerRadius * 2,
      ...restParams,
      x: rx - outerRadius,
      y: ry - outerRadius,
    });
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
    dpr,
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
      this.__updateSize({ width: outerRadius * 2, height: outerRadius * 2 });
    }
    if (typeof dpr !== 'undefined') {
      this.dpr = dpr;
      this.__updateSize({ dpr });
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
    const _x = x / this.dpr;
    const _y = y / this.dpr;
    const d = getDistance(_x, _y, this.rx, this.ry);
    if (d < this.innerRadius || d > this.outerRadius) return false;
    if (this.startAngle % 360 === this.endAngle % 360) return true;
    let angle = (Math.acos((_x - this.rx) / d) / Math.PI) * 180;
    if (_y < this.ry) {
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
    const { __ctx, __canvas, dpr, rx, ry, innerRadius, outerRadius } = this;
    const _rx = rx * dpr;
    const _ry = ry * dpr;
    const _innerRadius = innerRadius * dpr;
    const _outerRadius = outerRadius * dpr;
    __ctx.fillStyle = this.fillColor;
    __ctx.beginPath();
    __ctx.moveTo(
      _outerRadius + _innerRadius * Math.cos((this.endAngle / 180) * Math.PI),
      _outerRadius + _innerRadius * Math.sin((this.endAngle / 180) * Math.PI),
    );
    __ctx.arc(
      _outerRadius,
      _outerRadius,
      _innerRadius,
      (this.endAngle / 180) * Math.PI,
      (this.startAngle / 180) * Math.PI,
      true,
    );
    __ctx.lineTo(
      _outerRadius + _outerRadius * Math.cos((this.startAngle / 180) * Math.PI),
      _outerRadius + _outerRadius * Math.sin((this.startAngle / 180) * Math.PI),
    );
    __ctx.arc(
      _outerRadius,
      _outerRadius,
      _outerRadius,
      (this.startAngle / 180) * Math.PI,
      (this.endAngle / 180) * Math.PI,
    );
    __ctx.fill();
    ctx.drawImage(
      __canvas,
      _rx - _outerRadius,
      _ry - _outerRadius,
      _outerRadius * 2,
      _outerRadius * 2,
    );
  }
}

export default RingShape;

import Shape, { type BaseShapeOptions } from './Shape';
import { getDistance } from './utils';

export interface RectShapeOptions extends BaseShapeOptions {
  radius?: number | number[];
  fillColor?: string;
  strokeColor?: string;
  lineWidth?: number;
}

class RectShape extends Shape {
  radius: number[];
  fillColor: string;
  strokeColor: string;
  lineWidth: number;
  get type() {
    return 'RectShape';
  }
  constructor({
    radius,
    fillColor = '#000',
    strokeColor = '#000',
    lineWidth = 0,
    ...restParams
  }: RectShapeOptions) {
    super({ ...restParams });
    this.radius = this.parseRaduisList(radius);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.lineWidth = lineWidth;
  }
  parseRaduisList(radius?: number | number[]) {
    if (typeof radius === 'number') {
      return [radius, radius, radius, radius];
    } else if (Array.isArray(radius)) {
      radius = radius.filter((el) => typeof el === 'number');
      if (radius.length >= 4) {
        return radius.slice(0, 4);
      } else if (radius.length === 1) {
        return [radius[0], radius[0], radius[0], radius[0]];
      } else if (radius.length === 2) {
        return [radius[0], radius[1], radius[0], radius[1]];
      } else if (radius.length === 3) {
        return [radius[0], radius[1], radius[2], radius[1]];
      } else {
        return [0, 0, 0, 0];
      }
    } else {
      return [0, 0, 0, 0];
    }
  }
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    super.render(ctx);
    const { __ctx, __canvas, x, y, radius, dpr, width, height } = this;
    const _x = x * dpr;
    const _y = y * dpr;
    const _width = width * dpr;
    const _height = height * dpr;
    const _radius = radius.map((el) => el * dpr);
    __ctx.fillStyle = this.fillColor;
    __ctx.strokeStyle = this.strokeColor;
    __ctx.lineWidth = this.lineWidth;
    __ctx.beginPath();
    __ctx.moveTo(_radius[0], 0);
    __ctx.lineTo(_width - _radius[1], 0);
    if (_radius[1] > 0) {
      __ctx.arc(_width - _radius[1], _radius[1], _radius[1], -Math.PI / 2, 0);
    }
    __ctx.lineTo(_width, _height - _radius[2]);
    if (_radius[2] > 0) {
      __ctx.arc(_width - _radius[2], _height - _radius[2], _radius[2], 0, Math.PI / 2);
    }
    __ctx.lineTo(_radius[3], _height);
    if (_radius[3] > 0) {
      __ctx.arc(_radius[3], _height - _radius[3], _radius[3], Math.PI / 2, Math.PI);
    }
    __ctx.lineTo(0, _radius[3]);
    if (_radius[0] > 0) {
      __ctx.arc(_radius[0], _radius[0], _radius[0], Math.PI, (Math.PI / 2) * 3);
    }
    __ctx.fill();
    __ctx.stroke();
    ctx.drawImage(__canvas, _x, _y, _width, _height);
  }
  update({
    x,
    y,
    width,
    height,
    radius,
    fillColor,
    strokeColor,
  }: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number | number[];
    fillColor?: string;
    strokeColor?: string;
  }): void {
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
    if (typeof radius !== 'undefined') {
      this.radius = this.parseRaduisList(radius);
    }
    if (fillColor) {
      this.fillColor = fillColor;
    }
    if (strokeColor) {
      this.strokeColor = strokeColor;
    }
  }
  isInShape(x: number, y: number): boolean {
    const _x = x / this.dpr;
    const _y = y / this.dpr;
    if (_x < this.x || _x > this.x + this.width || _y < this.y || _y > this.y + this.height)
      return false;
    if (
      this.radius[0] > 0 &&
      _x < this.x + this.radius[0] &&
      _y < this.y + this.radius[0] &&
      getDistance(_x, _y, this.x + this.radius[0], this.y + this.radius[0]) > this.radius[0]
    )
      return false;

    if (
      this.radius[1] > 0 &&
      _x > this.x + this.width - this.radius[1] &&
      _y < this.y + this.radius[1] &&
      getDistance(_x, _y, this.x + this.width - this.radius[1], this.y + this.radius[1]) >
        this.radius[1]
    )
      return false;

    if (
      this.radius[2] > 0 &&
      _x > this.x + this.width - this.radius[2] &&
      _y > this.y + this.height - this.radius[2] &&
      getDistance(
        _x,
        _y,
        this.x + this.width - this.radius[2],
        this.y + this.height - this.radius[2],
      ) > this.radius[2]
    )
      return false;

    if (
      this.radius[3] > 0 &&
      _x < this.x + this.radius[3] &&
      _y > this.y + this.height - this.radius[3] &&
      getDistance(_x, _y, this.x + this.radius[3], this.y + this.height - this.radius[3]) >
        this.radius[3]
    )
      return false;
    return true;
  }
}

export default RectShape;

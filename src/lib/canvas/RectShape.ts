import Shape from './Shape';
import { getDistance } from './utils';

class RectShape extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number[];
  fillColor: string;
  strokeColor: string;
  get type() {
    return 'RectShape';
  }
  constructor({
    x,
    y,
    width,
    height,
    radius,
    fillColor = '#000',
    strokeColor = '#000',
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number | number[];
    fillColor?: string;
    strokeColor?: string;
  }) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = this.parseRaduisList(radius);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
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
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius[0], this.y);
    ctx.lineTo(this.x + this.width - this.radius[1], this.y);
    if (this.radius[1] > 0) {
      ctx.arc(
        this.x + this.width - this.radius[1],
        this.y + this.radius[1],
        this.radius[1],
        -Math.PI / 2,
        0,
      );
    }
    ctx.lineTo(this.x + this.width, this.y + this.height - this.radius[2]);
    if (this.radius[2] > 0) {
      ctx.arc(
        this.x + this.width - this.radius[2],
        this.y + this.height - this.radius[2],
        this.radius[2],
        0,
        Math.PI / 2,
      );
    }
    ctx.lineTo(this.x + this.radius[3], this.y + this.height);
    if (this.radius[3] > 0) {
      ctx.arc(
        this.x + this.radius[3],
        this.y + this.height - this.radius[3],
        this.radius[3],
        Math.PI / 2,
        Math.PI,
      );
    }
    ctx.lineTo(this.x, this.y + this.radius[3]);
    if (this.radius[0] > 0) {
      ctx.arc(
        this.x + this.radius[0],
        this.y + this.radius[0],
        this.radius[0],
        Math.PI,
        (Math.PI / 2) * 3,
      );
    }
    ctx.fill();
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
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height)
      return false;
    if (
      this.radius[0] > 0 &&
      x < this.x + this.radius[0] &&
      y < this.y + this.radius[0] &&
      getDistance(x, y, this.x + this.radius[0], this.y + this.radius[0]) > this.radius[0]
    )
      return false;

    if (
      this.radius[1] > 0 &&
      x > this.x + this.width - this.radius[1] &&
      y < this.y + this.radius[1] &&
      getDistance(x, y, this.x + this.width - this.radius[1], this.y + this.radius[1]) >
        this.radius[1]
    )
      return false;

    if (
      this.radius[2] > 0 &&
      x > this.x + this.width - this.radius[2] &&
      y > this.y + this.height - this.radius[2] &&
      getDistance(
        x,
        y,
        this.x + this.width - this.radius[2],
        this.y + this.height - this.radius[2],
      ) > this.radius[2]
    )
      return false;

    if (
      this.radius[3] > 0 &&
      x < this.x + this.radius[3] &&
      y > this.y + this.height - this.radius[3] &&
      getDistance(x, y, this.x + this.radius[3], this.y + this.height - this.radius[3]) >
        this.radius[3]
    )
      return false;
    return true;
  }
}

export default RectShape;

import Shape from './Shape';

class GroupShape extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  shapeList: Shape[] = [];
  constructor({
    x,
    y,
    width,
    height,
    dpr,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    dpr?: number;
  }) {
    super({ dpr });
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    this.shapeList.forEach((shape) => {
      shape.render(ctx);
    });
  }
  update({
    x,
    y,
    width,
    height,
  }: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
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
  }
  isInShape(x: number, y: number): boolean {
    const _x = x / this.dpr;
    const _y = y / this.dpr;
    if (_x < this.x || _x > this.x + this.width || _y < this.y || _y > this.y + this.height)
      return false;
    return true;
  }

  addShape(shape: Shape) {
    this.shapeList.push(shape);
  }
  removeShape(shape: Shape) {
    const index = this.shapeList.indexOf(shape);
    if (index > -1) {
      this.shapeList.splice(index, 1);
    }
  }
}

export default GroupShape;

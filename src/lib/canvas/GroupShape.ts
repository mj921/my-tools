import Shape, { type BaseShapeOptions } from './Shape';

export interface GroupShapeOptions extends BaseShapeOptions {}

class GroupShape extends Shape {
  shapeList: Shape[] = [];
  constructor({ ...restParams }: GroupShapeOptions) {
    super({ ...restParams });
  }
  get type() {
    return 'GroupShape';
  }
  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    this.shapeList.forEach((shape) => {
      shape.render(this.__ctx);
    });
    ctx.drawImage(
      this.__canvas,
      this.x * this.dpr,
      this.y * this.dpr,
      this.width * this.dpr,
      this.height * this.dpr,
    );
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
    shape.rootRender = this.rootRender;
    shape.parentShape = this;
    if (shape instanceof GroupShape) {
      shape.updateChildRoot();
    }
  }
  updateChildRoot() {
    this.shapeList.forEach((shape) => {
      shape.rootRender = this.rootRender;
      if (shape instanceof GroupShape) {
        shape.updateChildRoot();
      }
    });
  }
  removeShape(shape: Shape) {
    const index = this.shapeList.indexOf(shape);
    if (index > -1) {
      this.shapeList.splice(index, 1);
      shape.rootRender = null;
      shape.parentShape = null;
      if (shape instanceof GroupShape) {
        shape.updateChildRoot();
      }
    }
  }
}

export default GroupShape;

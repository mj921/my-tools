/* eslint-disable @typescript-eslint/no-unused-vars */
import ShapeEventTrigger from './EventTrigger';
import type { IShape } from './interface';

class Shape extends ShapeEventTrigger implements IShape {
  visible = true;
  zIndex = 0;
  __canvas: OffscreenCanvas;
  __ctx: OffscreenCanvasRenderingContext2D;
  get type() {
    return 'Shape';
  }
  constructor({ width = 0, height = 0 }: { width?: number; height?: number } = {}) {
    super();
    this.__canvas = new OffscreenCanvas(width, height);
    const ctx = this.__canvas.getContext('2d');
    if (ctx) {
      this.__ctx = ctx;
    } else {
      throw new Error('获取离线canvas上下文失败');
    }
  }
  __updateSize({ width, height }: { width?: number; height?: number } = {}) {
    if (width) {
      this.__canvas.width = width;
    }
    if (height) {
      this.__canvas.height = height;
    }
  }
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    if (!this.visible) return;
  }
  update(params: any) {
    console.log(params);
  }
  isInShape(x: number, y: number) {
    console.log(x, y);
    return false;
  }
  onMouseEnter() {
    this.emitEvent('mouseenter');
  }
  onMouseOut() {
    this.emitEvent('mouseout');
  }
  onClick() {
    this.emitEvent('click');
  }
}

export default Shape;

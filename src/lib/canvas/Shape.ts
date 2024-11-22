/* eslint-disable @typescript-eslint/no-unused-vars */
import type BaseShape from './BaseShape';
import ShapeEventTrigger from './EventTrigger';

class Shape extends ShapeEventTrigger implements BaseShape {
  visible = true;
  zIndex = 0;
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

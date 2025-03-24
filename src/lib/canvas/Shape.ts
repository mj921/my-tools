/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateUUID } from 'three/src/math/MathUtils.js';
import ShapeEventTrigger, { type ShapeMouseEvent } from './EventTrigger';
import type ShapeRender from './ShapeRender';
import type { IShape } from './interface';
import type GroupShape from './GroupShape';

export interface BaseShapeOptions {
  dpr?: number;
  allowDrop?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

class Shape extends ShapeEventTrigger implements IShape {
  visible = true;
  zIndex = 0;
  uuid = generateUUID();
  x: number;
  y: number;
  width: number;
  height: number;
  dpr: number;
  allowDrop: boolean;
  __canvas: OffscreenCanvas;
  __ctx: OffscreenCanvasRenderingContext2D;
  rootRender: ShapeRender | null = null;
  parentShape: GroupShape | null = null;
  get type() {
    return 'Shape';
  }
  constructor({
    width = 0,
    height = 0,
    dpr = window.devicePixelRatio,
    allowDrop = false,
    x = 0,
    y = 0,
  }: BaseShapeOptions = {}) {
    super();
    this.dpr = dpr;
    this.allowDrop = allowDrop;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.__canvas = new OffscreenCanvas(width * dpr, height * dpr);
    const ctx = this.__canvas.getContext('2d');
    if (ctx) {
      this.__ctx = ctx;
    } else {
      throw new Error('获取离线canvas上下文失败');
    }
  }
  __updateSize({ width, height, dpr }: { width?: number; height?: number; dpr?: number } = {}) {
    if (dpr) {
      this.dpr = dpr;
    }
    if (width) {
      this.__canvas.width = width * this.dpr;
    }
    if (height) {
      this.__canvas.height = height * this.dpr;
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
}

export default Shape;

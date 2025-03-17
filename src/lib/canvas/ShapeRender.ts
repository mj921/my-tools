import type { IShape } from './interface';

class ShapeRender {
  canvasEle: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  offScreenCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  shapeList: IShape[] = [];
  width: number = 0;
  height: number = 0;
  dpr: number;
  offscreenCanvas: OffscreenCanvas;
  hoverShape: IShape | null = null;
  constructor({
    ele,
    dpr = window.devicePixelRatio,
    width,
    height,
  }: {
    ele?: HTMLCanvasElement | string;
    dpr?: number;
    width?: number;
    height?: number;
  } = {}) {
    this.dpr = dpr;
    let canvasEle: HTMLCanvasElement | null = null;
    if (ele) {
      if (typeof ele === 'string') {
        canvasEle = document.querySelector(ele);
      } else if (ele instanceof HTMLCanvasElement) {
        canvasEle = ele;
      }
    } else {
      canvasEle = document.createElement('canvas');
      document.body.appendChild(canvasEle);
    }
    if (!canvasEle) {
      throw new Error('canvas不存在');
    }
    this.canvasEle = canvasEle;
    this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
    this.setCanvasSize({ width, height });
    const offScreenCtx = this.offscreenCanvas.getContext('2d');
    if (!offScreenCtx) {
      throw new Error('获取离线canvas上下文失败');
    }
    this.offScreenCtx = offScreenCtx;
    const ctx = this.canvasEle.getContext('2d');
    if (!ctx) {
      throw new Error('获取canvas上下文失败');
    }
    this.ctx = ctx;
    this.canvasEle.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvasEle.addEventListener('click', (e) => this.onClick(e));
  }

  private onMouseMove(e: MouseEvent) {
    const x = e.offsetX * this.dpr;
    const y = e.offsetY * this.dpr;
    const oldHoverShape = this.hoverShape;
    let hoverShape = null;
    for (let index = 0; index < this.shapeList.length; index++) {
      const element = this.shapeList[index];
      if (element.isInShape(x, y)) {
        hoverShape = element;
        break;
      }
    }
    this.hoverShape = hoverShape;
    if (oldHoverShape !== this.hoverShape) {
      if (oldHoverShape) {
        oldHoverShape.onMouseOut();
      }
      if (this.hoverShape) {
        this.hoverShape.onMouseEnter();
      }
    }
  }

  private onClick(e: MouseEvent) {
    const x = e.offsetX * this.dpr;
    const y = e.offsetY * this.dpr;
    for (let index = 0; index < this.shapeList.length; index++) {
      const element = this.shapeList[index];
      if (element.isInShape(x, y)) {
        element.onClick();
        break;
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.offScreenCtx.clearRect(0, 0, this.width, this.height);
  }

  setCanvasSize({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  } = {}) {
    if (width) {
      this.canvasEle.style.width = `${width}px`;
    }
    if (height) {
      this.canvasEle.style.height = `${height}px`;
    }
    this.width = this.canvasEle.offsetWidth * this.dpr;
    this.height = this.canvasEle.offsetHeight * this.dpr;
    this.canvasEle.width = this.width;
    this.canvasEle.height = this.height;
    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = this.height;
  }

  addShape(shape: IShape) {
    this.shapeList.push(shape);
  }
  removeShape(shape: IShape) {
    const index = this.shapeList.indexOf(shape);
    if (index > -1) {
      this.shapeList.splice(index, 1);
    }
  }

  render() {
    this.clear();
    this.shapeList.sort((a, b) => a.zIndex - b.zIndex);
    this.shapeList.forEach((shape) => {
      shape.render(this.offScreenCtx);
    });
    this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height);
  }
}

export default ShapeRender;

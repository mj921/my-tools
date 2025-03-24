import type Shape from './Shape';

class ShapeRender {
  canvasEle: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  offScreenCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  shapeList: Shape[] = [];
  width: number = 0;
  height: number = 0;
  dpr: number;
  offscreenCanvas: OffscreenCanvas;
  hoverShape: Shape | null = null;
  allowDrop: boolean;
  zIndex = 1;
  dropInfo: {
    shape: Shape;
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null = null;
  constructor({
    ele,
    dpr = window.devicePixelRatio,
    width,
    height,
    allowDrop = false,
  }: {
    ele?: HTMLCanvasElement | string;
    dpr?: number;
    width?: number;
    height?: number;
    allowDrop?: boolean;
  } = {}) {
    this.dpr = dpr;
    this.allowDrop = allowDrop;
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
    this.canvasEle.addEventListener('contextmenu', (e) => this.onContextMenu(e));
    this.canvasEle.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvasEle.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvasEle.addEventListener('click', (e) => this.onClick(e));
    let throttleFlag = true;
    window.addEventListener('mousemove', (e) => {
      if (throttleFlag) {
        throttleFlag = false;
        setTimeout(() => {
          throttleFlag = true;
        }, 30);
        this.onShapeDropMove(e);
      }
    });
    window.addEventListener('mouseup', (e) => {
      this.onShapeDropEnd(e);
    });
  }

  private onShapeDropMove(e: MouseEvent) {
    if (this.dropInfo) {
      const { shape, x, y, startX, startY } = this.dropInfo;
      shape.update({ x: startX + e.clientX - x, y: startY + e.clientY - y });
      this.render();
    }
  }
  private onShapeDropEnd(e: MouseEvent) {
    if (this.dropInfo) {
      const { shape, x, y, startX, startY } = this.dropInfo;
      shape.update({ x: startX + e.clientX - x, y: startY + e.clientY - y });
      this.render();
      shape.emitEvent('dropend', this.dropInfo);
      this.dropInfo = null;
    }
  }

  private onMouseDown(e: MouseEvent) {
    const x = e.offsetX * this.dpr;
    const y = e.offsetY * this.dpr;
    for (let index = this.shapeList.length - 1; index >= 0; index--) {
      const element = this.shapeList[index];
      if (element.isInShape(x, y)) {
        if (e.button === 0 && this.allowDrop && element.allowDrop) {
          this.dropInfo = {
            shape: element,
            x: e.clientX,
            y: e.clientY,
            startX: element.x,
            startY: element.y,
          };
          element.emitEvent('dropstart', this.dropInfo);
          this.render();
        }
        element.emitEvent('mousedown', {
          shape: element,
          ...e,
        });
        break;
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    const x = e.offsetX * this.dpr;
    const y = e.offsetY * this.dpr;
    const oldHoverShape = this.hoverShape;
    let hoverShape = null;
    for (let index = this.shapeList.length - 1; index >= 0; index--) {
      const element = this.shapeList[index];
      if (element.hasEventListener('mousemove') && element.isInShape(x, y)) {
        hoverShape = element;
        break;
      }
    }
    this.hoverShape = hoverShape;
    if (oldHoverShape !== this.hoverShape) {
      if (oldHoverShape) {
        oldHoverShape.emitEvent('mouseout');
      }
      if (this.hoverShape) {
        this.hoverShape.emitEvent('mouseenter');
      }
    }
  }

  private onClick(e: MouseEvent) {
    const x = e.offsetX * this.dpr;
    const y = e.offsetY * this.dpr;
    for (let index = this.shapeList.length - 1; index >= 0; index--) {
      const element = this.shapeList[index];
      if (element.hasEventListener('click') && element.isInShape(x, y)) {
        element.emitEvent('click');
        break;
      }
    }
  }

  private onContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const x = e.offsetX * this.dpr;
    const y = e.offsetY * this.dpr;
    for (let index = this.shapeList.length - 1; index >= 0; index--) {
      const element = this.shapeList[index];
      if (element.hasEventListener('contextmenu') && element.isInShape(x, y)) {
        element.emitEvent('contextmenu');
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

  addShape(shape: Shape) {
    this.shapeList.push(shape);
    shape.zIndex = this.zIndex++;
    shape.rootRender = this;
    shape.parentShape = null;
  }
  removeShape(shape: Shape) {
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

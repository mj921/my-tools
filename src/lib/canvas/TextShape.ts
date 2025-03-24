import Shape, { type BaseShapeOptions } from './Shape';

export interface TextShapeOptions extends BaseShapeOptions {
  fillColor?: string;
  strokeColor?: string;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;

  textAlign?: 'left' | 'center' | 'right';
}

class TextShape extends Shape {
  text: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  textAlign: 'left' | 'center' | 'right';
  constructor({
    text,
    fontSize = 14,
    fontFamily = 'sans-serif',
    fontWeight,
    fillColor = '#000',
    strokeColor = '#000',
    textAlign = 'left',
    ...restParams
  }: TextShapeOptions) {
    super({ ...restParams });
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    const offscreenCanvas = new OffscreenCanvas(100, 100);
    const ctx = offscreenCanvas.getContext('2d')!;
    ctx.font = `${this.fontWeight || ''} ${this.fontSize}px ${this.fontFamily || ''}`;
    this.width = ctx.measureText(text).width;
    this.height = fontSize;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.textAlign = textAlign;
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
    ctx.font = `${this.fontWeight || ''} ${this.fontSize * this.dpr}px ${this.fontFamily || ''}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = this.textAlign;
    ctx.fillText(
      this.text,
      this.x * this.dpr,
      (this.y + this.height / 2) * this.dpr,
      this.width * this.dpr,
    );
  }
  update({
    x,
    y,
    fillColor,
    strokeColor,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    dpr,
  }: {
    x?: number;
    y?: number;
    fillColor?: string;
    strokeColor?: string;
    text: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    dpr?: number;
  }): void {
    if (dpr) {
      this.dpr = dpr;
    }
    if (typeof x !== 'undefined') {
      this.x = x;
    }
    if (typeof y !== 'undefined') {
      this.y = y;
    }
    if (fillColor) {
      this.fillColor = fillColor;
    }
    if (strokeColor) {
      this.strokeColor = strokeColor;
    }

    if (text) {
      this.text = text;
    }

    if (fontSize) {
      this.fontSize = fontSize;
    }

    if (fontFamily) {
      this.fontFamily = fontFamily;
    }

    if (fontWeight) {
      this.fontWeight = fontWeight;
    }
    const offscreenCanvas = new OffscreenCanvas(100, 100);
    const ctx = offscreenCanvas.getContext('2d')!;
    ctx.font = `${this.fontWeight || ''} ${this.fontSize}px ${this.fontFamily || ''}`;
    this.width = ctx.measureText(text).width;
  }
  isInShape(x: number, y: number): boolean {
    const _x = x / this.dpr;
    const _y = y / this.dpr;
    if (_x < this.x || _x > this.x + this.width || _y < this.y || _y > this.y + this.height)
      return false;
    return true;
  }
}

export default TextShape;

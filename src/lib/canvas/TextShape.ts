import Shape from './Shape';

class TextShape extends Shape {
  text: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  constructor({
    text,
    fontSize = 14,
    fontFamily = 'sans-serif',
    fontWeight,
    x,
    y,
    fillColor = '#000',
    strokeColor = '#000',
  }: {
    x: number;
    y: number;
    fillColor?: string;
    strokeColor?: string;
    text: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
  }) {
    super();
    this.x = x;
    this.y = y;
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
    ctx.font = `${this.fontWeight || ''} ${this.fontSize}px ${this.fontFamily || ''}`;
    ctx.textBaseline = 'middle';

    ctx.fillText(this.text, this.x, this.y + this.height / 2, this.width);
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
  }: {
    x?: number;
    y?: number;
    fillColor?: string;
    strokeColor?: string;
    text: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
  }): void {
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
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height)
      return false;
    return true;
  }
}

export default TextShape;

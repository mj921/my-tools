import { GroupShape, RectShape, TextShape } from '@/lib/canvas';
import type { ShapeEventTriggerHandle } from '@/lib/canvas/EventTrigger';
import { boxCollision } from '@/lib/canvas/utils';

class TextGroupShape extends GroupShape {
  rectShape: RectShape;
  textShape: TextShape;
  text: string;
  static onCombination: ShapeEventTriggerHandle<TextGroupShape[]> = () => {};
  static onShapeRemove = () => {};
  static onShapeMouseDown: ShapeEventTriggerHandle<any> = () => {};
  constructor({
    x,
    y,
    width = 40,
    height = 50,
    dpr,
    text,
    fontSize = 24,
  }: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    dpr?: number;
    text: string;
    fontSize?: number;
  }) {
    super({ x, y, width, height, dpr });
    this.text = text;
    this.allowDrop = true;
    this.rectShape = new RectShape({
      x: 0,
      y: 0,
      width,
      height,
      fillColor: '#222',
      strokeColor: '#fff',
      lineWidth: 2,
      radius: 4,
    });
    this.textShape = new TextShape({
      text,
      fontSize,
      x: width / 2,
      y: (height - fontSize) / 2,
      fillColor: '#fff',
      textAlign: 'center',
    });
    this.addShape(this.rectShape);
    this.addShape(this.textShape);
    this.addEventListener('dropstart', () => {
      this.zIndex = this.rootRender!.zIndex++;
    });
    this.addEventListener('dropend', () => {
      this.onDropEnd();
    });
    this.addEventListener('contextmenu', () => {
      this.remove();
      TextGroupShape.onShapeRemove();
    });
    this.addEventListener('combination', TextGroupShape.onCombination);
    this.addEventListener('mousedown', (e) => {
      TextGroupShape.onShapeMouseDown(e);
    });
  }

  onDropEnd() {
    for (let i = (this.rootRender?.shapeList?.length || 0) - 2; i >= 0; i--) {
      const shape = this.rootRender!.shapeList[i];
      if (
        shape instanceof TextGroupShape &&
        shape !== this &&
        boxCollision(
          { x: this.x, y: this.y, w: this.width, h: this.height },
          { x: shape.x, y: shape.y, w: shape.width, h: shape.height },
        )
      ) {
        this.emitEvent('combination', [this, shape]);
        break;
      }
    }
  }
  remove() {
    if (this.parentShape) {
      this.parentShape.removeShape(this);
    } else if (this.rootRender) {
      this.rootRender.removeShape(this);
    }
  }
}

export default TextGroupShape;

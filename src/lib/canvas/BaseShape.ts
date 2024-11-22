abstract class BaseShape {
  visible = true;
  zIndex = 0;
  abstract render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
  abstract update(params: any): void;
  abstract isInShape(x: number, y: number): boolean;
  abstract onMouseEnter(): void;
  abstract onMouseOut(): void;
  abstract onClick(): void;
}

export default BaseShape;

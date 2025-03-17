export interface IShape {
  visible: boolean;
  zIndex: number;
  type: string;
  dpr: number;
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
  update(params: any): void;
  isInShape(x: number, y: number): boolean;
  onMouseEnter(): void;
  onMouseOut(): void;
  onClick(): void;
}

export interface IPoint {
  x: number;
  y: number;
}

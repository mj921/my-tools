import Board from './Board';

export enum ChessGroupStatus {
  Ready = 1,
  Move = 2,
  Finish = 3,
  Merge = 4,
}

class ChessGroup {
  color: string;
  level = 1;
  status: ChessGroupStatus;
  homePoint: number;
  position: number;
  size: number;
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
  constructor(color: string, homePoint: number, size: number) {
    this.homePoint = homePoint;
    this.color = color;
    this.status = ChessGroupStatus.Ready;
    this.position = -1;
    this.size = size;
    this.canvas = new OffscreenCanvas(size, size);
    this.ctx = this.canvas.getContext('2d')!;
    this.draw();
  }

  merge(group: ChessGroup) {
    this.level += group.level;
    group.level = 0;
    group.status = ChessGroupStatus.Merge;
    this.draw();
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Board.dpr;
    ctx.beginPath();
    ctx.ellipse(
      0.5 * this.size,
      (0.5 + 0.05 - 0.1 * this.level) * this.size,
      0.45 * this.size,
      0.35 * this.size,
      0,
      0,
      Math.PI * 2,
    );
    ctx.lineTo((0.5 + 0.45) * this.size, (0.5 + 0.15 - 0.1 * this.level) * this.size);
    ctx.ellipse(
      0.5 * this.size,
      (0.5 + 0.15 - 0.1 * this.level) * this.size,
      0.45 * this.size,
      0.35 * this.size,
      0,
      0,
      Math.PI,
    );
    ctx.lineTo((0.5 - 0.45) * this.size, (0.5 + 0.05 - 0.1 * this.level) * this.size);
    ctx.fill();
    ctx.stroke();
  }
}

export default ChessGroup;

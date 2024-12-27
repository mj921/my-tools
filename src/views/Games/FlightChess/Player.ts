import ChessGroup, { ChessGroupStatus } from './ChessGroup';
import type { Point } from './interface';

class Player {
  color: string;
  chessGroups: ChessGroup[] = [];
  birthPoint: Point;
  plantPoint: Point;
  size: number;
  constructor(color: string, birthPoint: Point, plantPoint: Point, size: number) {
    this.size = size;
    this.color = color;
    this.plantPoint = plantPoint;
    this.chessGroups = [
      new ChessGroup(color, 0, size),
      new ChessGroup(color, 1, size),
      new ChessGroup(color, 2, size),
      new ChessGroup(color, 3, size),
    ];
    this.birthPoint = birthPoint;
  }

  drawChess(ctx: OffscreenCanvasRenderingContext2D) {
    this.chessGroups.forEach((group, i) => {
      switch (group.status) {
        case ChessGroupStatus.Ready:
        case ChessGroupStatus.Finish:
          ctx.drawImage(
            group.canvas,
            (this.plantPoint.x - 0.5 + (i % 2 === 1 ? 1 : -1)) * this.size,
            (this.plantPoint.y - 0.5 + (Math.floor(i / 2) === 1 ? 1 : -1)) * this.size,
          );
          break;
        case ChessGroupStatus.Move:
          break;
        case ChessGroupStatus.Merge:
          break;
      }
    });
  }
}

export default Player;

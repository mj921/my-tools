import ChessGroup, { ChessGroupStatus } from './ChessGroup';
import type { Cell, Point } from './interface';

class Player {
  color: string;
  chessGroups: ChessGroup[] = [];
  birthPoint: Point;
  plantPoint: Point;
  size: number;
  pathCell: Cell[];
  constructor(color: string, birthPoint: Point, plantPoint: Point, size: number, pathCell: Cell[]) {
    this.size = size;
    this.color = color;
    this.plantPoint = plantPoint;
    this.pathCell = pathCell;
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
          if (group.position === -1) {
            ctx.drawImage(
              group.canvas,
              this.birthPoint.x * this.size,
              this.birthPoint.y * this.size,
            );
          } else {
            const groupCell = this.pathCell[group.position];
            let _x = groupCell.x;
            let _y = groupCell.y;
            switch (groupCell.type) {
              case 'rect':
                if (groupCell.rectType === 'horizontal') {
                  _x += 0.5;
                } else if (groupCell.rectType === 'vertical') {
                  _y += 0.5;
                }
                break;
              case 'triangle':
                switch (groupCell.triangleType) {
                  case 'topLeft':
                    _x += 0.05;
                    _y += 0.05;
                    break;
                  case 'topRight':
                    _x += 0.95;
                    _y += 0.05;
                    break;
                  case 'bottomLeft':
                    _x += 0.05;
                    _y += 0.95;
                    break;
                  case 'bottomRight':
                    _x += 0.95;
                    _y += 0.95;
                    break;
                }
                break;
            }
            ctx.drawImage(group.canvas, _x * this.size, _y * this.size);
          }
          break;
        case ChessGroupStatus.Merge:
          break;
      }
    });
  }
}

export default Player;

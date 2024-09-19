export enum MineClearanceCellType {
  Closed = 0,
  Mark = 1,
  Opened = 2,
}

class MineClearanceCell {
  x: number;
  y: number;
  /** 周围炸弹数 -1炸弹 0 空 1-8 周围炸弹数 */
  status: number;
  type = MineClearanceCellType.Closed;
  arroundCells: MineClearanceCell[] = [];
  constructor(x: number, y: number, status: number) {
    this.x = x;
    this.y = y;
    this.status = status;
  }
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      status: this.status,
      type: this.type,
      arroundCellNum: this.arroundCells.length,
    };
  }
  toString() {
    return {
      x: this.x,
      y: this.y,
      status: this.status,
      type: this.type,
      arroundCellNum: this.arroundCells.length,
    };
  }
}

export default MineClearanceCell;

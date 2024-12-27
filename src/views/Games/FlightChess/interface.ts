export interface Cell {
  x: number;
  y: number;
  type: string;
  rectType?: string;
  triangleType?: string;
  color: string;
}

export interface Point {
  x: number;
  y: number;
}

export enum GameStatus {
  Dice,
  SelectChess,
  Move,
}

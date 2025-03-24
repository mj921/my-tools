export const getDistance = (x: number, y: number, x1: number, y1: number) =>
  Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

export const boxCollision = ({ x, y, w, h }: Box, box: Box) => {
  if (pointInBox(box, { x, y })) return true;
  if (pointInBox(box, { x: x + w, y })) return true;
  if (pointInBox(box, { x, y: y + h })) return true;
  if (pointInBox(box, { x: x + w, y: y + h })) return true;
  return false;
};

export const pointInBox = ({ x, y, w, h }: Box, { x: x1, y: y1 }: Point) =>
  x1 >= x && x1 <= x + w && y1 >= y && y1 <= y + h;

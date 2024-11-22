export const getDistance = (x: number, y: number, x1: number, y1: number) =>
  Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));

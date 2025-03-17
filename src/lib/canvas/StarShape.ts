import { clamp } from '@/utils';
import PolygonShape from './PolygonShape';

export interface StarShapeOptions {
  x: number;
  y: number;
  width: number;
  height?: number;
  innerRadius?: number;
  fillColor?: string;
  strokeColor?: string;
  corners?: number;
  startAngle?: number;
  dpr?: number;
}

class StarShape extends PolygonShape {
  innerRadius: number;
  get type() {
    return 'StarShape1';
  }
  constructor({
    x,
    y,
    width,
    height = 0,
    innerRadius = 0.382,
    fillColor = '#000',
    strokeColor = '#000',
    corners = 3,
    startAngle = 270,
    dpr,
  }: StarShapeOptions) {
    super({ x, y, width, height, fillColor, strokeColor, corners, startAngle, dpr }, false);
    this.innerRadius = clamp(innerRadius, 0, 1);
    this.points = this.getPoints();
  }

  calcPoints() {
    const points = [];
    for (
      let i = 0, angle = this.startAngle;
      i < this.corners * 2;
      i++, angle += 360 / this.corners / 2
    ) {
      if (i % 2 === 1) {
        points.push(
          this.width / 2 + (this.width / 2) * this.innerRadius * Math.cos((angle / 180) * Math.PI),

          this.height / 2 +
            (this.height / 2) * this.innerRadius * Math.sin((angle / 180) * Math.PI),
        );
      } else {
        points.push(
          this.width / 2 + (this.width / 2) * Math.cos((angle / 180) * Math.PI),
          this.height / 2 + (this.height / 2) * Math.sin((angle / 180) * Math.PI),
        );
      }
    }
    return points;
  }

  update({
    x,
    y,
    width,
    height,
    innerRadius,
    fillColor,
    strokeColor,
    corners,
    startAngle,
  }: {
    [key in keyof StarShapeOptions]?: StarShapeOptions[key];
  }) {
    if (typeof innerRadius !== 'undefined') {
      this.innerRadius = clamp(innerRadius, 0, 1);
    }
    super.update({
      x,
      y,
      width,
      height,
      fillColor,
      strokeColor,
      corners,
      startAngle,
    });
  }
}

export default StarShape;

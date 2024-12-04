import { clamp } from '@/utils';
import BaseChart from './BaseChart';
import { RectShape, RingShape, ShapeRender, TextShape } from '../canvas';

export interface PieOptions {
  radius?: string | number | Array<string | number>;
  data?: { name: string; value: number }[];
  startAngle?: number;
  endAngle?: number;
}

interface PieRenderOptions {
  radius: Array<string | number>;
  data: { name: string; value: number }[];
  startAngle: number;
  endAngle: number;
}

class PieChart extends BaseChart {
  shapeRender: ShapeRender;
  options?: PieRenderOptions;
  shapeList: { legendShape: RectShape; legendTextShape: TextShape; ringShape: RingShape }[] = [];
  constructor(ele?: HTMLCanvasElement | string) {
    super();
    this.shapeRender = new ShapeRender({ ele, dpr: this.dpr });
  }

  setOption({ radius, startAngle, endAngle, ...otherOptions }: PieOptions) {
    const _options = {
      ...(this.options || {
        radius: [0, '75%'],
        data: [],
        startAngle: 90,
        endAngle: 450,
      }),
      ...otherOptions,
    };
    if (radius) {
      _options.radius = Array.isArray(radius)
        ? radius.length > 1
          ? radius
          : [0, radius[0]]
        : [0, radius];
    }
    if (startAngle || endAngle) {
      _options.startAngle = (startAngle || _options.startAngle) % 360;
      _options.endAngle = this.options?.endAngle || _options.startAngle + 360;
      if (endAngle) {
        _options.endAngle = endAngle % 360;
        if (_options.endAngle < _options.startAngle) {
          _options.endAngle += 360;
        }
      }
    }

    this.options = _options;
    this.render();
  }

  private calcRadius(val: string | number, size: number) {
    if (typeof val === 'number') {
      return clamp(val, 0, size);
    }
    if (typeof val === 'string') {
      if (/^\d+(\.\d+)?%$/.test(val)) {
        return Math.floor((clamp(Number(val.replace('%', '')), 0, 100) * size) / 100);
      }
      if (/^\d+(\.\d+)?(px)?/.test(val)) {
        return Math.floor(clamp(Number(val.replace('px', '')), 0, size));
      }
      return 0;
    }
    return 0;
  }
  render() {
    const { radius, data, startAngle, endAngle } = this.options!;
    this.shapeRender.clear();
    this.shapeRender.setCanvasSize();
    const size = Math.min(this.shapeRender.width, this.shapeRender.height);

    let innerRadius = this.calcRadius(radius[0], size / 2);
    let outerRadius = this.calcRadius(radius[1], size / 2);
    if (innerRadius > outerRadius) {
      [outerRadius, innerRadius] = [innerRadius, outerRadius];
    }
    const total = data.reduce((prev, el) => prev + el.value, 0);
    let start = 0;
    const rangeLen = endAngle - startAngle;

    data.forEach((el, i) => {
      const end = start + el.value / total;
      if (this.shapeList[i]) {
        this.shapeList[i].legendShape.update({
          x: 20 * this.dpr,
          y: (20 + i * 24) * this.dpr,
          width: 24 * this.dpr,
          height: 12 * this.dpr,
          radius: 4 * this.dpr,
          fillColor: this.colors[i % this.colors.length],
        });
        this.shapeList[i].legendTextShape.update({
          x: 50 * this.dpr,
          y: (20 + i * 24) * this.dpr,
          fontSize: 14 * this.dpr,
          text: el.name,
          fillColor: this.colors[i % this.colors.length],
        });
        this.shapeList[i].ringShape.update({
          rx: this.shapeRender!.width / 2,
          ry: this.shapeRender!.height / 2,
          innerRadius,
          outerRadius,
          startAngle: start * rangeLen + startAngle,
          endAngle: end * rangeLen + startAngle,
          fillColor: this.colors[i % this.colors.length],
        });
      } else {
        this.shapeList.push({
          legendShape: new RectShape({
            x: 20 * this.dpr,
            y: (20 + i * 24) * this.dpr,
            width: 24 * this.dpr,
            height: 12 * this.dpr,
            radius: 4 * this.dpr,
            fillColor: this.colors[i % this.colors.length],
          }),
          legendTextShape: new TextShape({
            x: 50 * this.dpr,
            y: (20 + i * 24) * this.dpr,
            fontSize: 14 * this.dpr,
            text: el.name,
            fillColor: this.colors[i % this.colors.length],
          }),
          ringShape: new RingShape({
            rx: this.shapeRender!.width / 2,
            ry: this.shapeRender!.height / 2,
            innerRadius,
            outerRadius,
            startAngle: start * rangeLen + startAngle,
            endAngle: end * rangeLen + startAngle,
            fillColor: this.colors[i % this.colors.length],
          }),
        });

        this.shapeList[i].legendShape.addEventListener('mouseenter', () => {
          this.shapeList[i].ringShape.update({
            outerRadius: outerRadius + 5 * this.dpr,
          });
          this.shapeList[i].ringShape.zIndex = 1;
          this.shapeRender?.render();
        });
        this.shapeList[i].legendShape.addEventListener('mouseout', () => {
          this.shapeList[i].ringShape.update({
            outerRadius,
          });
          this.shapeList[i].ringShape.zIndex = 0;
          this.shapeRender?.render();
        });

        this.shapeList[i].legendTextShape.addEventListener('mouseenter', () => {
          this.shapeList[i].ringShape.update({
            outerRadius: outerRadius + 5 * this.dpr,
          });
          this.shapeList[i].ringShape.zIndex = 1;
          this.shapeRender?.render();
        });
        this.shapeList[i].legendTextShape.addEventListener('mouseout', () => {
          this.shapeList[i].ringShape.update({
            outerRadius,
          });
          this.shapeList[i].ringShape.zIndex = 0;
          this.shapeRender?.render();
        });

        this.shapeList[i].ringShape.addEventListener('mouseenter', () => {
          this.shapeList[i].ringShape.update({
            outerRadius: outerRadius + 5 * this.dpr,
          });
          this.shapeList[i].ringShape.zIndex = 1;
          this.shapeRender?.render();
        });
        this.shapeList[i].ringShape.addEventListener('mouseout', () => {
          this.shapeList[i].ringShape.update({
            outerRadius,
          });
          this.shapeList[i].ringShape.zIndex = 0;
          this.shapeRender?.render();
        });
        this.shapeRender?.addShape(this.shapeList[i].legendShape);
        this.shapeRender?.addShape(this.shapeList[i].legendTextShape);
        this.shapeRender?.addShape(this.shapeList[i].ringShape);
      }
      start = end;
    });

    let i = this.shapeList.length - 1;
    while (i > data.length) {
      const shape = this.shapeList.pop();
      i--;
      if (shape) {
        this.shapeRender.removeShape(shape.legendShape);
        this.shapeRender.removeShape(shape.legendTextShape);
        this.shapeRender.removeShape(shape.ringShape);
      }
    }
    this.shapeRender.render();
  }
}

export default PieChart;

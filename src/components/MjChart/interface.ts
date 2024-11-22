export interface MjChartProps {}

export interface MjChartPieProps extends MjChartProps {
  data: {
    value: number;
    name: string;
  }[];
  radius?: number | string | Array<number | string>;
  startAngle?: number;
  endAngle?: number;
}

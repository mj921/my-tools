export interface MjRowProps {
  tag?: string;
  justify?:
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end';
  align?: 'start' | 'center' | 'end';
  gap?: number | string | (number | string)[];
}

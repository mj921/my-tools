export const addZero = (val: number, count = 2) =>
  (new Array(count).fill('0').join('') + val).slice(-count);

export const isUndefined = (val: any) => typeof val === 'undefined';

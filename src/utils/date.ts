import { addZero } from '.';

export const dateFmt = (fmt = 'YYYY-MM-DD HH:mm:ss', date = new Date()) => {
  const map: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: addZero(date.getMonth() + 1),
    M: (date.getMonth() + 1).toString(),
    DD: addZero(date.getDate()),
    D: date.getDate().toString(),
    HH: addZero(date.getHours()),
    H: date.getHours().toString(),
    mm: addZero(date.getMinutes()),
    m: date.getMinutes().toString(),
    ss: addZero(date.getSeconds()),
    s: date.getSeconds().toString(),
  };
  const reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
  return fmt.replace(reg, ($0, $1) => {
    return map[$1];
  });
};

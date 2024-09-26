import { writeFileSync } from 'fs';

const globalColor = [
  {
    name: 'colorPrimary',
    color: '#1677ff',
  },
  {
    name: 'colorSuccess',
    color: '#52c41a',
  },
  {
    name: 'colorWarning',
    color: '#faad14',
  },
  {
    name: 'colorError',
    color: '#ff4d4f',
  },
];
let themeContent = '';

const nameToLine = (name) => {
  return name
    .toString()
    .replace(/([A-Z])/g, ($0) => `-${$0.toLowerCase()}`)
    .replace(/^-/, '');
};

const rgbToHsv = (color) => {
  let r = 0,
    g = 0,
    b = 0;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color)) {
    const str = '0123456789abcdef';
    if (color.length === 4) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    r = str.indexOf(color[1]) * 16 + str.indexOf(color[2]);
    g = str.indexOf(color[3]) * 16 + str.indexOf(color[4]);
    b = str.indexOf(color[5]) * 16 + str.indexOf(color[6]);
  } else if (/^rgb\(\d{1,3}(,\d{1,3}){2}\)$/.test(color.replace(/\s/g, ''))) {
    [, r, g, b] = color.replace(/\s/g, '').match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/) || [];
    r = +r;
    g = +g;
    b = +b;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = ((60 * (g - b)) / diff + 360) % 360;
  } else if (max === g) {
    h = ((60 * (b - r)) / diff + 120) % 360;
  } else if (max === b) {
    h = ((60 * (r - g)) / diff + 240) % 360;
  }
  let s = max === 0 ? 0 : diff / max;
  let v = max / 255;
  return {
    h,
    s,
    v,
  };
};

// const hsvToRgb = (h, s, v) => {
//   const th = Math.floor(h / 60);
//   const t1 = h / 60 - th;
//   const t2 = v * (1 - s);
//   const t3 = v * (1 - t1 * s);
//   const t4 = v * (1 - (1 - t1) * s);
//   const r = [v, t3, t2, t2, t4, v][th] * 255;
//   const g = [t4, v, v, t3, t2, t2][th] * 255;
//   const b = [t2, t2, t4, v, v, t3][th] * 255;
//   return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
// };

const hsvToHex = (h, s, v) => {
  const str = '0123456789abcdef';
  const th = Math.floor(h / 60);
  const t1 = h / 60 - th;
  const t2 = v * (1 - s);
  const t3 = v * (1 - t1 * s);
  const t4 = v * (1 - (1 - t1) * s);
  const r = [v, t3, t2, t2, t4, v][th] * 255;
  const g = [t4, v, v, t3, t2, t2][th] * 255;
  const b = [t2, t2, t4, v, v, t3][th] * 255;
  return `#${str[Math.floor(r / 16)]}${str[Math.floor(r % 16)]}${str[Math.floor(g / 16)]}${str[Math.floor(g % 16)]}${str[Math.floor(b / 16)]}${str[Math.floor(b % 16)]}`;
};

globalColor.forEach(({ name, color }) => {
  let { h, s, v } = rgbToHsv(color);
  for (let i = 1; i < 6; i++) {
    const n = 6 - i;
    themeContent += `$${name}-${i}: ${hsvToHex(Math.min(359, h + 2 * n), Math.max(0.05, s - 0.16 * n), Math.min(1, v + 0.05 * n))};\n`;
  }
  themeContent += `$${name}-6: ${color};\n`;
  for (let i = 1; i < 5; i++) {
    themeContent += `$${name}-${6 + i}: ${hsvToHex(Math.max(0, h - 2 * i), Math.min(1, s + 0.05 * i), Math.max(0.05, v - 0.15 * i))};\n`;
  }
  themeContent += '\n';

  themeContent += `$${name}Bg: $${name}-1;\n`;
  themeContent += `$${name}BgHover: $${name}-2;\n`;
  themeContent += `$${name}Border: $${name}-3;\n`;
  themeContent += `$${name}BorderHover: $${name}-4;\n`;
  themeContent += `$${name}Hover: $${name}-5;\n`;
  themeContent += `$${name}: $${name}-6;\n`;
  themeContent += `$${name}Active: $${name}-7;\n`;
  themeContent += `$${name}TextHover: $${name}-5;\n`;
  themeContent += `$${name}Text: $${name}-6;\n`;
  themeContent += `$${name}TextActive: $${name}-7;\n`;
});
themeContent += '\n';

themeContent += `$colorLinkHover: $colorPrimary-4;\n`;
themeContent += `$colorLinkActive: $colorPrimary-7;\n`;

themeContent += ':root {\n';
globalColor.forEach(({ name }) => {
  themeContent += `  --mj-${nameToLine(name)}-bg: $${name}Bg;\n`;
  themeContent += `  --mj-${nameToLine(name)}-bg-hover: $${name}BgHover;\n`;
  themeContent += `  --mj-${nameToLine(name)}-border: $${name}Border;\n`;
  themeContent += `  --mj-${nameToLine(name)}-border-hover: $${name}BorderHover;\n`;
  themeContent += `  --mj-${nameToLine(name)}-hover: $${name}Hover;\n`;
  themeContent += `  --mj-${nameToLine(name)}: $${name};\n`;
  themeContent += `  --mj-${nameToLine(name)}-active: $${name}Active;\n`;
  themeContent += `  --mj-${nameToLine(name)}-text-hover: $${name}TextHover;\n`;
  themeContent += `  --mj-${nameToLine(name)}-text: $${name}Text;\n`;
  themeContent += `  --mj-${nameToLine(name)}-text-active: $${name}TextActive;\n`;
});

themeContent += `  --mj-color-link-hover: $colorLinkHover;\n`;
themeContent += `  --mj-color-link-active: $colorLinkActive;\n`;
themeContent += '}\n';

writeFileSync('./theme.scss', themeContent);

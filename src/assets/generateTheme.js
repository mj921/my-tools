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
    color: '#f53f3f',
  },
  {
    name: 'colorGray',
    color: '#a6abb0',
  },
  {
    name: 'colorBlack',
    color: '#4e5969',
  },
];
const hueStep = 2; // 色相阶梯
const saturationStep = 0.16; // 饱和度阶梯，浅色部分
const saturationStep2 = 0.05; // 饱和度阶梯，深色部分
const brightnessStep1 = 0.05; // 亮度阶梯，浅色部分
const brightnessStep2 = 0.15; // 亮度阶梯，深色部分
const lightColorCount = 5; // 浅色数量，主色上
const darkColorCount = 4; // 深色数量，主色下
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

const colorMap = {};

function getHue(hsv, i, light) {
  let hue;
  // 根据色相不同，色相转向不同
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}

function getSaturation(hsv, i, light) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  let saturation;
  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }
  // 边界值修正
  if (saturation > 1) {
    saturation = 1;
  }
  // 第一格的 s 限制在 0.06-0.1 之间
  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }
  if (saturation < 0.06) {
    saturation = 0.06;
  }
  return Number(saturation.toFixed(2));
}

function getValue(hsv, i, light) {
  let value;
  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  if (value > 1) {
    value = 1;
  } else if (value < 0) {
    value = 0;
  }
  return Number(value.toFixed(2));
}

themeContent += ':root {\n';
globalColor.forEach(({ name, color }) => {
  let { h, s, v } = rgbToHsv(color);
  for (let i = 1; i < lightColorCount + 1; i++) {
    const n = lightColorCount + 1 - i;
    colorMap[`${name}-${i}`] = hsvToHex(
      getHue({ h, s, v }, n, true),
      getSaturation({ h, s, v }, n, true),
      getValue({ h, s, v }, n, true),
    );
    themeContent += `  --mj-${nameToLine(name)}-${i}: ${colorMap[`${name}-${i}`]};\n`;
  }
  colorMap[`${name}-6`] = color;
  themeContent += `  --mj-${nameToLine(name)}-6: ${colorMap[`${name}-6`]};\n`;
  for (let i = 1; i < darkColorCount + 1; i++) {
    colorMap[`${name}-${lightColorCount + 1 + i}`] = hsvToHex(
      getHue({ h, s, v }, i),
      getSaturation({ h, s, v }, i),
      getValue({ h, s, v }, i),
    );
    themeContent += `  --mj-${nameToLine(name)}-${lightColorCount + 1 + i}: ${colorMap[`${name}-${lightColorCount + 1 + i}`]};\n`;
  }
});
globalColor.forEach(({ name }) => {
  themeContent += `  --mj-${nameToLine(name)}-bg-disabled: ${colorMap[`${name}-1`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-bg: ${colorMap[`${name}-1`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-bg-hover: ${colorMap[`${name}-2`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-bg-active: ${colorMap[`${name}-3`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-border-disabled: ${colorMap[`${name}-2`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-border: ${colorMap[`${name}-2`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-border-hover: ${colorMap[`${name}-3`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-border-active: ${colorMap[`${name}-4`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-disabled: ${colorMap[`${name}-3`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-hover: ${colorMap[`${name}-5`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}: ${colorMap[`${name}-6`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-active: ${colorMap[`${name}-7`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-text-disabled: ${colorMap[`${name}-3`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-text-hover: ${colorMap[`${name}-5`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-text: ${colorMap[`${name}-6`]};\n`;
  themeContent += `  --mj-${nameToLine(name)}-text-active: ${colorMap[`${name}-7`]};\n`;
});

themeContent += `  --mj-color-link-hover: ${colorMap['colorPrimary-4']};\n`;
themeContent += `  --mj-color-link-active: ${colorMap[['colorPrimary-7']]};\n`;
themeContent += '}\n';

writeFileSync('./theme.css', themeContent);

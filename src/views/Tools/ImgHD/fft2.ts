interface Complex {
  re: Pixel;
  im: Pixel;
}

interface Pixel {
  gray: number;
  r: number;
  g: number;
  b: number;
  a: number;
}
const defPixel = { gray: 0, r: 0, g: 0, b: 0, a: 0 };

const getPixel = (val: number) => ({ gray: val, r: val, g: val, b: val, a: val });

const pixelMax = (max: Pixel, val: Pixel): Pixel => ({
  gray: Math.max(max.gray, val.gray),
  r: Math.max(max.r, val.r),
  g: Math.max(max.g, val.g),
  b: Math.max(max.b, val.b),
  a: Math.max(max.a, val.a),
});
const pixelMin = (min: Pixel, val: Pixel): Pixel => ({
  gray: Math.min(min.gray, val.gray),
  r: Math.min(min.r, val.r),
  g: Math.min(min.g, val.g),
  b: Math.min(min.b, val.b),
  a: Math.min(min.a, val.a),
});
const pixelKeyHandle = (arr: Pixel[], handle: (v1: number[]) => number): Pixel => ({
  gray: handle(arr.map((v) => v.gray)),
  r: handle(arr.map((v) => v.r)),
  g: handle(arr.map((v) => v.g)),
  b: handle(arr.map((v) => v.b)),
  a: handle(arr.map((v) => v.a)),
});
const complexToPixelHandle = (
  val: Complex,
  fn: (reVal: number, imVal: number) => number,
): Pixel => {
  return {
    gray: fn(val.re.gray, val.im.gray),
    r: fn(val.re.r, val.im.r),
    g: fn(val.re.g, val.im.g),
    b: fn(val.re.b, val.im.b),
    a: fn(val.re.a, val.im.a),
  };
};

const pixelMultiplyNum = (val: Pixel, num: number) => ({
  a: val.a * num,
  r: val.r * num,
  g: val.g * num,
  b: val.b * num,
  gray: val.gray * num,
});

const complexMultiplyNum = (val: Complex, num: number) => ({
  re: pixelMultiplyNum(val.re, num),
  im: pixelMultiplyNum(val.im, num),
});

const pixelAdd = (a: Pixel, b: Pixel): Pixel => ({
  a: a.a + b.a,
  r: a.r + b.r,
  g: a.g + b.g,
  b: a.b + b.b,
  gray: a.gray + b.gray,
});

const pixelSub = (a: Pixel, b: Pixel): Pixel => ({
  a: a.a - b.a,
  r: a.r - b.r,
  g: a.g - b.g,
  b: a.b - b.b,
  gray: a.gray - b.gray,
});

function adjustToPowerOfTwo(width: number, height: number) {
  return [nextPowerOfTwo(width), nextPowerOfTwo(height)];
}

function nextPowerOfTwo(n: number) {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}
export const computeFftData = (imageData: ImageData) => {
  const originWidth = imageData.width;
  const originHeight = imageData.height;
  const [width, height] = adjustToPowerOfTwo(originWidth, originHeight);
  const grayData = getRGBAData(imageData, width, height);
  const fftData = performFFT2D(grayData, width, height);
  return { fftData, width, height };
};

export function computeSpectrum(imageData: ImageData) {
  const originWidth = imageData.width;
  const originHeight = imageData.height;
  const [width, height] = adjustToPowerOfTwo(originWidth, originHeight);
  const grayData = getRGBAData(imageData, width, height);
  const fftData = performFFT2D(grayData, width, height);
  const spectrum = createSpectrumImage(fftData, width, height, originWidth, originHeight);
  return spectrum;
}

// 转换为灰度二维数组
function getRGBAData(imageData: ImageData, width: number, height: number) {
  const data = imageData.data;
  const startX = Math.floor((width - imageData.width) / 2);
  const startY = Math.floor((height - imageData.height) / 2);
  const gray = new Array<Pixel[]>(height);
  for (let y = 0; y < height; y++) {
    gray[y] = new Array(width).fill(0);
    if (y >= startY && y < imageData.height + startY) {
      for (let x = 0; x < imageData.width; x++) {
        const i = ((y - startY) * imageData.width + x) * 4;
        gray[y][x + startX] = {
          gray: 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
          a: data[i + 3],
        };
      }
    }
  }
  return gray;
}

// 二维FFT处理核心
function performFFT2D(matrix: Pixel[][], width: number, height: number) {
  // 先对行进行FFT
  const rowFFT = matrix.map((row) =>
    FFT(
      row.map((v) => ({ re: v, im: { ...defPixel } })),
      width,
    ),
  );

  // 转置矩阵并对列进行FFT
  const colFFT = transpose(rowFFT).map((col) =>
    FFT(
      col.map((v) => v),
      height,
    ),
  );
  return transpose(colFFT);
}

// 复数运算FFT（基2算法）
function base2FFT(signal: Complex[]) {
  const N = signal.length;
  if (N <= 1) return signal;

  const even = base2FFT(signal.filter((_, i) => i % 2 === 0));
  const odd = base2FFT(signal.filter((_, i) => i % 2 === 1));
  const output = new Array<Complex>(N).fill({ re: { ...defPixel }, im: { ...defPixel } });

  for (let k = 0; k < Math.floor(N / 2); k++) {
    const angle = (-2 * Math.PI * k) / N;
    const twiddle = {
      re: {
        gray: Math.cos(angle),
        r: Math.cos(angle),
        g: Math.cos(angle),
        b: Math.cos(angle),
        a: Math.cos(angle),
      },
      im: {
        gray: Math.sin(angle),
        r: Math.sin(angle),
        g: Math.sin(angle),
        b: Math.sin(angle),
        a: Math.sin(angle),
      },
    };
    if (!twiddle || !odd[k]) {
      console.log(k, twiddle, odd[k], odd, N);
    }
    const term = multiplyComplex(twiddle, odd[k]);

    output[k] = addComplex(even[k], term);
    output[k + N / 2] = subtractComplex(even[k], term);
  }
  return output;
}

// 工具函数
function isPowerOfTwo(n: number) {
  return n && (n & (n - 1)) === 0;
}

function inverseFFT(spectrum: Complex[]) {
  const N = spectrum.length;

  // 基础情况处理
  if (N <= 1) return spectrum;

  // 共轭复数转换（第一步）
  const conjugated: Complex[] = spectrum.map((c) => ({
    re: c.re,
    im: pixelMultiplyNum(c.im, -1),
  }));

  // 正向FFT（第二步）
  let transformed: Complex[];
  if (isPowerOfTwo(N)) {
    transformed = base2FFT(conjugated);
  } else {
    transformed = bluesteinFFT(conjugated, N);
  }

  // 归一化处理（第三步）
  return transformed.map((c) => ({
    re: pixelMultiplyNum(c.re, 1 / N),
    im: pixelMultiplyNum(c.im, 1 / N),
  }));
}

// Bluestein算法实现（支持任意长度）
function bluesteinFFT(signal: Complex[], N: number) {
  const M = signal.length;
  const logN = Math.ceil(Math.log2(N + M - 1));
  const paddedSize = Math.pow(2, logN);

  // 创建扩展信号
  const a = new Array(paddedSize).fill(0).map(() => ({ re: { ...defPixel }, im: { ...defPixel } }));
  const b = new Array(paddedSize).fill(0).map(() => ({ re: { ...defPixel }, im: { ...defPixel } }));

  // 填充信号
  for (let n = 0; n < M; n++) {
    const angle = (Math.PI * n * n) / N;
    a[n] = multiplyComplex(signal[n], {
      re: getPixel(Math.cos(angle)),
      im: getPixel(-Math.sin(angle)),
    });
  }

  // 创建卷积核
  for (let k = 0; k < paddedSize; k++) {
    const angle = (Math.PI * (k % (2 * N)) * (k % (2 * N))) / N;
    b[k] = {
      re: getPixel(Math.cos(angle)),
      im: getPixel(Math.sin(angle)),
    };
  }

  // 执行卷积
  const A = base2FFT(a);
  const B = base2FFT(b);
  const C: Complex[] = A.map((val, i) => multiplyComplex(val, B[i]));
  const c = inverseFFT(C).slice(0, N);

  // 提取结果
  const output = new Array<Complex>(N);
  for (let k = 0; k < N; k++) {
    const angle = (Math.PI * k * k) / N;
    const factor: Complex = {
      re: getPixel(Math.cos(angle)),
      im: getPixel(-Math.sin(angle)),
    };
    output[k] = multiplyComplex(c[k], factor);
  }
  return output;
}

// 频谱可视化生成
function createSpectrumImage(
  fftData: Complex[][],
  width: number,
  height: number,
  originWidth: number,
  originHeight: number,
) {
  const spectrum = new ImageData(width, height);
  const magnitudes = new Array<Pixel>(width * height);
  // const magnitudesR = new Float32Array(width * height);
  // const magnitudesG = new Float32Array(width * height);
  // const magnitudesB = new Float32Array(width * height);
  // const magnitudesA = new Float32Array(width * height);
  // const magnitudesGray = new Float32Array(width * height);

  // 计算幅度并中心化
  let max = getPixel(-Infinity),
    min = getPixel(Infinity);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = ((y + height / 2) % height) * width + ((x + width / 2) % width);
      // TODO 目前用灰度值 后续改
      // const val = Math.log(1 + Math.hypot(fftData[y][x].re.gray, fftData[y][x].im.gray));
      const val = complexToPixelHandle(fftData[y][x], (reVal, imVal) =>
        Math.log(1 + Math.hypot(reVal, imVal)),
      );
      magnitudes[idx] = val;
      max = pixelMax(max, val);
      min = pixelMin(min, val);
    }
  }

  // 归一化到0-255
  const range = pixelKeyHandle([max, min], (arr) => arr[0] - arr[1] || 1);
  for (let i = 0; i < magnitudes.length; i++) {
    // const intensity = ((magnitudes[i] - min) / range) * 255;
    const intensity = pixelKeyHandle(
      [magnitudes[i], min, range],
      (arr) => ((arr[0] - arr[1]) / arr[2]) * 255,
    );
    spectrum.data[4 * i] = intensity.r;
    spectrum.data[4 * i + 1] = intensity.g;
    spectrum.data[4 * i + 2] = intensity.b;
    spectrum.data[4 * i + 3] = 255;
  }

  // 最终绘制时裁剪中心区域
  const startX = Math.floor((width - originWidth) / 2);
  const startY = Math.floor((height - originHeight) / 2);
  const newImgData = new ImageData(originWidth, originHeight);

  for (let y = 0; y < originHeight; y++) {
    for (let x = 0; x < originWidth; x++) {
      const srcIdx = ((y + startY) % height) * width + ((x + startX) % width);
      const dstIdx = (y * originWidth + x) * 4;
      newImgData.data[dstIdx] = spectrum.data[srcIdx * 4];
      newImgData.data[dstIdx + 1] = spectrum.data[srcIdx * 4 + 1];
      newImgData.data[dstIdx + 2] = spectrum.data[srcIdx * 4 + 2];
      newImgData.data[dstIdx + 3] = 255;
    }
  }
  return newImgData;
}

// 改进的FFT实现（自动补零到2的幂）
function FFT(signal: Complex[], requiredLength: number) {
  const N = signal.length;
  if (N === requiredLength && isPowerOfTwo(N)) {
    return base2FFT(signal);
  }

  // 非2的幂时使用Bluestein算法
  return bluesteinFFT(signal, requiredLength);
}

// 辅助函数
function transpose(matrix: Complex[][]) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

function addComplex(a: Complex, b: Complex) {
  return { re: pixelAdd(a.re, b.re), im: pixelAdd(a.im, b.im) };
}

function subtractComplex(a: Complex, b: Complex) {
  return { re: pixelSub(a.re, b.re), im: pixelSub(a.im, b.im) };
}

function multiplyComplex(a: Complex, b: Complex): Complex {
  return {
    re: {
      gray: a.re.gray * b.re.gray - a.im.gray * b.im.gray,
      r: a.re.r * b.re.r - a.im.r * b.im.r,
      g: a.re.g * b.re.g - a.im.g * b.im.g,
      b: a.re.b * b.re.b - a.im.b * b.im.b,
      a: a.re.a * b.re.a - a.im.a * b.im.a,
    },
    im: {
      gray: a.re.gray * b.im.gray + a.im.gray * b.re.gray,
      r: a.re.r * b.im.r + a.im.r * b.re.r,
      g: a.re.g * b.im.g + a.im.g * b.re.g,
      b: a.re.b * b.im.b + a.im.b * b.re.b,
      a: a.re.a * b.im.a + a.im.a * b.re.a,
    },
  };
}

// 主函数：频域去噪处理
export function denoiseImage(
  fftData: Complex[][],
  {
    width,
    height,
    originHeight,
    originWidth,
  }: { width: number; height: number; originWidth: number; originHeight: number },
  options: {
    type?: 'gaussian' | 'ideal';
    cutoff?: number;
    radius?: number;
  } = {},
) {
  // 参数设置
  const {
    type = 'gaussian', // 可选 'ideal' 或 'gaussian'
    cutoff = 600, // 截止频率（像素单位）
    radius = 20, // 高斯滤波器半径（仅对高斯有效）
  } = options;

  // 创建滤波器
  const filter = createFilter(width, height, {
    type,
    cutoff,
    radius,
  });

  // 应用滤波器
  const filtered = applyFrequencyFilter(fftData, width, height, filter);

  // 执行逆FFT获取空间域数据
  const spatialData = inverseFFT2D(filtered);

  // 转换为图像数据
  return createDenoisedImage(spatialData, originWidth, originHeight);
}

export const denoiseImageByImageData = (
  imageData: ImageData,
  options: {
    type?: 'gaussian' | 'ideal';
    cutoff?: number;
    radius?: number;
  } = {},
) => {
  const { fftData, width, height } = computeFftData(imageData);
  return denoiseImage(
    fftData,
    { width, height, originWidth: imageData.width, originHeight: imageData.height },
    options,
  );
};

export const checkInverse = (imageData: ImageData) => {
  const { fftData } = computeFftData(imageData);
  const spatialData = inverseFFT2D(fftData);
  return createDenoisedImage(spatialData, imageData.width, imageData.height);
};

// 创建频域滤波器
function createFilter(
  width: number,
  height: number,
  options: {
    type: 'gaussian' | 'ideal';
    cutoff: number;
    radius: number;
  },
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const filter = new Array(height).fill(0).map(() => new Array<number>(width));

  let count = 0;
  let total = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      switch (options.type) {
        case 'ideal':
          filter[y][x] = distance <= options.cutoff ? 1 : 0;
          count += filter[y][x];
          total++;
          break;
        case 'gaussian':
          filter[y][x] = Math.exp(-(distance ** 2) / (2 * options.radius ** 2));
          break;
      }
    }
  }
  console.log(options.type, options.cutoff, options.radius, count, total, Math.log2(width));

  return filter;
}

// 应用频域滤波器
function applyFrequencyFilter(
  fftData: Complex[][],
  width: number,
  height: number,
  filter: number[][],
) {
  const filtered = new Array<Complex[]>(height);
  for (let y = 0; y < height; y++) {
    filtered[y] = new Array(width);
    for (let x = 0; x < width; x++) {
      // 应用滤波器到复数数据
      filtered[y][x] = complexMultiplyNum(fftData[y][x], filter[y][x]);
    }
  }
  return filtered;
}

// 二维逆FFT处理
function inverseFFT2D(filteredData: Complex[][]) {
  // 转置后处理列
  const transposed = transpose(filteredData);
  const colProcessed = transposed.map((col) => inverseFFT(col));

  // 转置并处理行
  const rowInput = transpose(colProcessed);
  return rowInput.map((row) => inverseFFT(row));
}

// 生成去噪后的图像数据
function createDenoisedImage(spatialData: Complex[][], width: number, height: number) {
  const imageData = new ImageData(width, height);
  let min = Infinity,
    max = -Infinity;

  const startX = Math.floor(((spatialData?.[0]?.length || 0) - width) / 2);
  const startY = Math.floor((spatialData.length - height) / 2);

  // 第一次遍历：寻找数值范围
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = spatialData[y][x].re; // 取实部
      // TODO 目前用灰度值 后续改
      min = Math.min(min, value.gray);
      max = Math.max(max, value.gray);
    }
  }

  // 第二次遍历：归一化到0-255
  const range = max - min || 1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // TODO 目前用灰度值 后续改
      const value = ((spatialData[y + startY][x + startX].re.gray - min) / range) * 255;

      imageData.data[idx] = value; // R
      imageData.data[idx + 1] = value; // G
      imageData.data[idx + 2] = value; // B
      imageData.data[idx + 3] = spatialData[y + startY][x + startX].re.a; // A
    }
  }
  return imageData;
}

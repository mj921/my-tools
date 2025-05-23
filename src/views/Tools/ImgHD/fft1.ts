interface Complex {
  re: number;
  im: number;
}

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
  const grayData = getGrayData(imageData, width, height);
  const fftData = performFFT2D(grayData, width, height);
  return { fftData, width, height };
};

export function computeSpectrum(imageData: ImageData) {
  const originWidth = imageData.width;
  const originHeight = imageData.height;
  const [width, height] = adjustToPowerOfTwo(originWidth, originHeight);
  const grayData = getGrayData(imageData, width, height);
  const fftData = performFFT2D(grayData, width, height);
  const spectrum = createSpectrumImage(fftData, width, height, originWidth, originHeight);
  return spectrum;
}

// 转换为灰度二维数组
function getGrayData(imageData: ImageData, width: number, height: number) {
  const data = imageData.data;
  const startX = Math.floor((width - imageData.width) / 2);
  const startY = Math.floor((height - imageData.height) / 2);
  const gray = new Array<number[]>(height);
  for (let y = 0; y < height; y++) {
    gray[y] = new Array(width).fill(0);
    if (y >= startY && y < imageData.height + startY) {
      for (let x = 0; x < imageData.width; x++) {
        const i = ((y - startY) * imageData.width + x) * 4;
        gray[y][x + startX] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
    }
  }
  return gray;
}

// 二维FFT处理核心
function performFFT2D(matrix: number[][], width: number, height: number) {
  // 先对行进行FFT
  const rowFFT = matrix.map((row) =>
    FFT(
      row.map((v) => ({ re: v, im: 0 })),
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
  const output = new Array<Complex>(N).fill({ re: 0, im: 0 });

  for (let k = 0; k < Math.floor(N / 2); k++) {
    const angle = (-2 * Math.PI * k) / N;
    const twiddle = {
      re: Math.cos(angle),
      im: Math.sin(angle),
    };
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
  const conjugated = spectrum.map((c) => ({
    re: c.re,
    im: -c.im,
  }));

  // 正向FFT（第二步）
  let transformed;
  if (isPowerOfTwo(N)) {
    transformed = base2FFT(conjugated);
  } else {
    transformed = bluesteinFFT(conjugated, N);
  }

  // 归一化处理（第三步）
  return transformed.map((c) => ({
    re: c.re / N,
    im: c.im / N,
  }));
}

// Bluestein算法实现（支持任意长度）
function bluesteinFFT(signal: Complex[], N: number): Complex[] {
  const M = signal.length;
  const logN = Math.ceil(Math.log2(N + M - 1));
  const paddedSize = Math.pow(2, logN);

  // 创建扩展信号
  const a = new Array(paddedSize).fill({ re: 0, im: 0 });
  const b = new Array(paddedSize).fill({ re: 0, im: 0 });

  // 填充信号
  for (let n = 0; n < M; n++) {
    const angle = (Math.PI * n * n) / N;
    a[n] = multiplyComplex(signal[n], {
      re: Math.cos(angle),
      im: -Math.sin(angle),
    });
  }

  // 创建卷积核
  for (let k = 0; k < paddedSize; k++) {
    const angle = (Math.PI * (k % (2 * N)) * (k % (2 * N))) / N;
    b[k] = {
      re: Math.cos(angle),
      im: Math.sin(angle),
    };
  }

  // 执行卷积
  const A = base2FFT(a);
  const B = base2FFT(b);
  const C = A.map((val, i) => multiplyComplex(val, B[i]));
  const c = inverseFFT(C).slice(0, N);

  // 提取结果
  const output = new Array(N);
  for (let k = 0; k < N; k++) {
    const angle = (Math.PI * k * k) / N;
    const factor = {
      re: Math.cos(angle),
      im: -Math.sin(angle),
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
  const magnitudes = new Float32Array(width * height);

  // 计算幅度并中心化
  let max = -Infinity,
    min = Infinity;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = ((y + height / 2) % height) * width + ((x + width / 2) % width);
      const val = Math.log(1 + Math.hypot(fftData[y][x].re, fftData[y][x].im));
      magnitudes[idx] = val;
      max = Math.max(max, val);
      min = Math.min(min, val);
    }
  }

  // 归一化到0-255
  const range = max - min || 1;
  for (let i = 0; i < magnitudes.length; i++) {
    const intensity = ((magnitudes[i] - min) / range) * 255;
    spectrum.data[4 * i] = spectrum.data[4 * i + 1] = spectrum.data[4 * i + 2] = intensity;
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
      newImgData.data[dstIdx] =
        newImgData.data[dstIdx + 1] =
        newImgData.data[dstIdx + 2] =
          spectrum.data[srcIdx * 4];
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
  return { re: a.re + b.re, im: a.im + b.im };
}

function subtractComplex(a: Complex, b: Complex) {
  return { re: a.re - b.re, im: a.im - b.im };
}

function multiplyComplex(a: Complex, b: Complex) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
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
      filtered[y][x] = {
        re: fftData[y][x].re * filter[y][x],
        im: fftData[y][x].im * filter[y][x],
      };
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
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }

  // 第二次遍历：归一化到0-255
  const range = max - min || 1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const value = ((spatialData[y + startY][x + startX].re - min) / range) * 255;

      imageData.data[idx] = value; // R
      imageData.data[idx + 1] = value; // G
      imageData.data[idx + 2] = value; // B
      imageData.data[idx + 3] = 255; // A
    }
  }
  return imageData;
}

/**
 * 双边滤波
 */
export function BBcolor(
  imgData: ImageData,
  radius = 5,
  sigma?: number,
  sigma_color?: number,
  channels = 3,
) {
  const pixes = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  const color_weight = [];
  channels = channels || 3;
  sigma_color = sigma_color || radius / 3;
  const coeff_color = -1 / (2 * sigma_color * sigma_color);
  radius = radius || 5;

  sigma = sigma || radius / 3;

  const gaussEdge = radius * 2 + 1; // 高斯矩阵的边长
  for (let i = 0; i < channels * 256; i++) {
    color_weight[i] = Math.exp(i * i * coeff_color);
  }
  const gaussMatrix = [];
  const gaussSum = 0;
  const a = 1 / (2 * sigma * sigma * Math.PI);
  const b = -a * Math.PI;

  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      const gxy = a * Math.exp((i * i + j * j) * b);
      gaussMatrix.push(gxy);
      // gaussSum += gxy; // 得到高斯矩阵的和，用来归一化
    }
  }

  // 循环计算整个图像每个像素高斯处理之后的值
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let wsum = 0;
      const currentPixId0 = (y * width + x) * 4;
      const r0 = pixes[currentPixId0];
      const g0 = pixes[currentPixId0 + 1];
      const b0 = pixes[currentPixId0 + 2];
      // 计算每个点的高斯处理之后的值
      for (let i = -radius; i <= radius; i++) {
        // 处理边缘
        const m = handleEdge(i, x, width);
        for (let j = -radius; j <= radius; j++) {
          // 处理边缘
          const mm = handleEdge(j, y, height);

          const currentPixId = (mm * width + m) * 4;

          const jj = j + radius,
            ii = i + radius,
            r1 = pixes[currentPixId],
            g1 = pixes[currentPixId + 1],
            b1 = pixes[currentPixId + 2];

          const weight =
            gaussMatrix[jj * gaussEdge + ii] *
            color_weight[Math.abs(r1 - r0) + Math.abs(g1 - g0) + Math.abs(b1 - b0)];
          r += pixes[currentPixId] * weight;
          g += pixes[currentPixId + 1] * weight;
          b += pixes[currentPixId + 2] * weight;
          wsum += weight;
        }
      }
      wsum = 1 / wsum;
      const pixId = (y * width + x) * 4;
      pixes[pixId] = ~~(wsum * r);
      pixes[pixId + 1] = ~~(wsum * g);
      pixes[pixId + 2] = ~~(wsum * b);
    }
  }
  // imgData.data = pixes;
  return imgData;
}
function handleEdge(i: number, x: number, w: number) {
  let m = x + i;
  if (m < 0) {
    m = -m;
  } else if (m >= w) {
    m = w + i - x;
  }
  return m;
}

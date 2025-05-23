function fft1d(signal: { re: number; im: number }[]) {
  const N = signal.length;
  const log2N = Math.log2(N);
  const result = [...signal];
  const N1 = Math.pow(2, Math.ceil(log2N));
  for (let i = N; i < N1; i++) {
    result.push({ re: 0, im: 0 }); // 填充零
  }

  //--- 位逆序置换 ---//
  for (let i = 0; i < N; i++) {
    const rev = bitReverse(i, log2N);
    if (i < rev) [result[i], result[rev]] = [result[rev], result[i]];
  }

  //--- 蝶形运算分层计算 ---//
  for (let stage = 1; stage <= log2N; stage++) {
    const span = 1 << stage; // 当前处理块大小
    const halfSpan = span / 2;
    const angleStep = (-2 * Math.PI) / span;

    for (let k = 0; k < N; k += span) {
      let w = { re: 1, im: 0 }; // 旋转因子初始值
      const wn = {
        re: Math.cos(angleStep),
        im: Math.sin(angleStep),
      };

      for (let j = 0; j < halfSpan; j++) {
        const idx1 = k + j;
        const idx2 = idx1 + halfSpan;
        let temp;
        // 复数乘法
        try {
          temp = {
            re: w.re * result[idx2].re - w.im * result[idx2].im,
            im: w.re * result[idx2].im + w.im * result[idx2].re,
          };
        } catch (error) {
          console.log({ halfSpan, j, k, idx1, idx2, N, log2N, span });

          throw new Error();
        }
        // 蝶形加法
        const even = {
          re: result[idx1].re + temp.re,
          im: result[idx1].im + temp.im,
        };
        const odd = {
          re: result[idx1].re - temp.re,
          im: result[idx1].im - temp.im,
        };
        // 更新结果
        result[idx1] = even;
        result[idx2] = odd;
        // 更新旋转因子
        w = {
          re: w.re * wn.re - w.im * wn.im,
          im: w.re * wn.im + w.im * wn.re,
        };
      }
    }
  }
  return result;
}

// 位逆序计算函数
function bitReverse(num: number, bits: number) {
  let reversed = 0;
  for (let i = 0; i < bits; i++) {
    reversed |= ((num >> i) & 1) << (bits - 1 - i);
  }
  return reversed;
}

// 将图像转换为灰度矩阵
function imageToGrayMatrix(imageData: ImageData) {
  const grayMatrix = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    grayMatrix.push(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return { matrix: grayMatrix, width: imageData.width, height: imageData.height };
}

function fft2d(matrix: { re: number; im: number }[], width: number, height: number) {
  // 行方向FFT
  const rowFFT = [];
  for (let y = 0; y < height; y++) {
    const row = matrix.slice(y * width, (y + 1) * width);
    rowFFT.push(...fft1d(row));
  }

  // 列方向FFT
  const colFFT = [];
  for (let x = 0; x < width; x++) {
    const col = [];
    for (let y = 0; y < height; y++) col.push(rowFFT[y * width + x]);
    colFFT.push(...fft1d(col));
  }

  return colFFT; // 返回复数形式的频谱数据
}

function centerSpectrum(spectrum: { re: number; im: number }[], width: number, height: number) {
  const halfW = Math.floor(width / 2),
    halfH = Math.floor(height / 2);
  const shifted = new Array<{ re: number; im: number }>(width * height);

  // 四象限交换
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = y * width + x;
      const newY = (y + halfH) % height;
      const newX = (x + halfW) % width;
      shifted[newY * width + newX] = spectrum[srcIdx];
    }
  }
  return shifted;
}

function drawSpectrum(spectrum: { re: number; im: number }[], width: number, height: number) {
  const imageData = new ImageData(width, height);

  let maxMag = -Infinity;
  // 计算最大幅度值
  const magnitudes = spectrum.map((c) => {
    const val = Math.sqrt(c.re ** 2 + c.im ** 2);
    if (maxMag < val) maxMag = val;
    return val;
  });
  // const maxMag = Math.max(...magnitudes);

  // 应用对数压缩
  for (let i = 0; i < magnitudes.length; i++) {
    const logMag = Math.log(1 + magnitudes[i]); // 动态范围压缩:ml-citation{ref="1" data="citationList"}
    const normalized = logMag / Math.log(1 + maxMag);
    // 使用颜色映射
    imageData.data[i * 4] = normalized * 255;
    imageData.data[i * 4 + 1] = normalized * 255;
    imageData.data[i * 4 + 2] = normalized * 255;
    imageData.data[i * 4 + 3] = 255;
  }
  return imageData;
}

export const getPinPu = async (imageData: ImageData) => {
  const { matrix, width, height } = imageToGrayMatrix(imageData);
  const spectrum = fft2d(
    matrix.map((v) => ({ re: v, im: 0 })),
    width,
    height,
  );
  const centered = centerSpectrum(spectrum, width, height);
  return { imageData: drawSpectrum(centered, width, height), centered };
};

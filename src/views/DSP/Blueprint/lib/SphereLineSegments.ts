import { BufferAttribute, BufferGeometry } from 'three';

const segArr = [200, 160, 120, 100, 80, 60, 40, 32, 20, 16, 8, 4, 1];
const arr = [16, 26, 31, 36, 39, 42, 44, 46, 47, 48, 49, 50];

class SphereLineGeometry extends BufferGeometry {
  constructor(private r: number) {
    super();
    const { points, indexs } = this.generateVertexLine();
    this.setAttribute('position', points);
    this.setIndex(indexs);
  }
  // generateVertexLine() {
  //   const points = [];
  //   const indexs = [];
  //   let count = 0;
  //   let seg = 360;
  //   let prevSeg;
  //   let step = (Math.PI * 2) / seg;
  //   for (let i = 0; i < seg; i++) {
  //     points.push(Math.sin(i * step) * this.r, 0, Math.cos(i * step) * this.r);
  //     if (i > 0) {
  //       indexs.push(i - 1, i);
  //     } else {
  //       indexs.push(i + 359, i);
  //     }
  //   }
  //   count += 360;
  //   for (let a = 1; a < 90; a++) {
  //     const currR = Math.cos((a / 180) * Math.PI) * this.r;
  //     const currY = Math.sin((a / 180) * Math.PI) * this.r;
  //     prevSeg = seg;
  //     seg = 360;
  //     step = (Math.PI * 2) / seg;
  //     for (let i = 0; i < seg; i++) {
  //       points.push(Math.sin(i * step) * currR, currY, Math.cos(i * step) * currR);
  //       indexs.push(count - (a == 1 ? prevSeg : prevSeg * 2) + i, count + i);
  //       if (i > 0) {
  //         indexs.push(count + i - 1, count + i);
  //       } else {
  //         indexs.push(count + i + prevSeg - 1, count + i);
  //       }
  //     }
  //     count += 360;
  //     for (let i = 0; i < seg; i++) {
  //       points.push(
  //         Math.sin((i / 180) * Math.PI) * currR,
  //         -currY,
  //         Math.cos((i / 180) * Math.PI) * currR,
  //       );
  //       indexs.push(count - prevSeg * 2 + i, count + i);
  //       if (i > 0) {
  //         indexs.push(count + i - 1, count + i);
  //       } else {
  //         indexs.push(count + i + prevSeg - 1, count + i);
  //       }
  //     }
  //     count += 360;
  //   }
  //   points.push(0, this.r, 0);
  //   step = (Math.PI * 2) / seg;
  //   for (let i = 0; i < seg; i++) {
  //     indexs.push(count - seg * 2 + i, count);
  //   }
  //   points.push(0, -this.r, 0);
  //   for (let i = 0; i < seg; i++) {
  //     indexs.push(count - seg + i, count + 1);
  //   }
  //   count += 2;
  //   return {
  //     points: new BufferAttribute(new Float32Array(points), 3),
  //     indexs,
  //   };
  // }
  generateVertexLine() {
    const points: number[] = [];
    const indexs: number[] = [];
    let count = 0;
    let index = 0;
    let seg = segArr[index];
    let step = (Math.PI * 2) / seg;
    for (let i = 0; i < seg; i++) {
      points.push(Math.sin(i * step) * this.r, 0, Math.cos(i * step) * this.r);
      if (i > 0) {
        indexs.push(i - 1, i);
      } else {
        indexs.push(i + seg - 1, i);
      }
    }

    count += seg;
    for (let a = 1; a < 50; a++) {
      const currR = Math.cos((a / 100) * Math.PI) * this.r;
      const currY = Math.sin((a / 100) * Math.PI) * this.r;

      if (a > arr[index]) {
        index++;
        seg = segArr[index];
        const prevR = Math.cos(((a - 1) / 100) * Math.PI) * this.r;
        const prevY = Math.sin(((a - 1) / 100) * Math.PI) * this.r;
        step = (Math.PI * 2) / seg;
        for (let i = 0; i < seg; i++) {
          points.push(Math.sin(i * step) * prevR, prevY, Math.cos(i * step) * prevR);
        }
        count += seg;
      }
      step = (Math.PI * 2) / seg;
      for (let i = 0; i < seg; i++) {
        points.push(Math.sin(i * step) * currR, currY, Math.cos(i * step) * currR);
        indexs.push(count - seg + i, count + i);
        if (i < seg - 1) {
          indexs.push(count + i, count + i + 1);
        } else {
          indexs.push(count + i, count);
        }
      }
      count += seg;
    }
    points.push(0, this.r, 0);
    step = (Math.PI * 2) / seg;
    for (let i = 0; i < seg; i++) {
      indexs.push(count - seg + i, count);
    }
    return {
      points: new BufferAttribute(new Float32Array(points), 3),
      indexs,
    };
  }
}

export default SphereLineGeometry;

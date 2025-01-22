<template>
  <div
    ref="container"
    class="flight-chess"
    :style="{ '--flight-chess-size': `${cellSize / Board.dpr}px` }"
  >
    <div class="flight-chess-dice">
      <div
        class="flight-chess-current-player"
        :style="{ backgroundColor: players[playerIndex]?.color || colors[0] }"
      ></div>
      <MjButton
        type="primary"
        :disabled="gameStatus !== GameStatus.Dice || diceLoading"
        @click="dice"
        >🎲 投骰子</MjButton
      >
    </div>
    <div class="flight-chess-dice-num">{{ diceLoading ? diceAnimateNum : diceNum }}</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { GameStatus, type Cell } from './interface';
import Board from './Board';
import Player from './Player';
import MjButton from '@/components/MjButton/MjButton.vue';
import ChessGroup, { ChessGroupStatus } from './ChessGroup';

const gameStatus = ref(GameStatus.Dice);
const playerIndex = ref(0);
const container = ref<HTMLDivElement>();
const mainCtx = ref<CanvasRenderingContext2D>();
/** 棋盘离线画布 */
const boardCanvas = ref<OffscreenCanvas>();
const boardCtx = ref<OffscreenCanvasRenderingContext2D>();
/** 棋子离线画布 */
const chessCanvas = ref<OffscreenCanvas>();
const chessCtx = ref<OffscreenCanvasRenderingContext2D>();
const cellSize = ref(Math.floor(Math.min(window.innerWidth, window.innerHeight) / 17) * Board.dpr);
const pathCells = ref<number[][]>([]);
const players = ref<Player[]>([]);
const diceLoading = ref(false);
const diceNum = ref<number>(6);
const diceAnimateNum = ref<number>();
const translateSelect = () => {
  gameStatus.value = GameStatus.SelectChess;
};
const translateNextPlayer = (again = false) => {
  gameStatus.value = GameStatus.Dice;
  if (!again) {
    playerIndex.value = (playerIndex.value + 1) % players.value.length;
  }
};
const translateMove = (group: ChessGroup) => {
  if (diceNum.value !== 6 && group.status !== ChessGroupStatus.Move) return;
  if (group.status === ChessGroupStatus.Ready) {
    group.status = ChessGroupStatus.Move;
    group.position = -1;
    drawChesses();
    translateNextPlayer(true);
  } else {
    gameStatus.value = GameStatus.Move;
    let step = 1;
    const moveAnimate = (timer: number) => {
      group.position += step;
      if (group.position === 58) {
        step = -1;
      }
      drawChesses();
      if (timer > 1) {
        setTimeout(() => moveAnimate(timer - 1), 500);
      } else {
        translateNextPlayer(diceNum.value === 6);
      }
    };
    moveAnimate(diceNum.value);
    drawChesses();
  }
};
const diceAnimat = (timer = 180) => {
  diceAnimateNum.value = Math.floor(Math.random() * 6) + 1;
  if (!diceLoading.value || timer === 0) {
    diceLoading.value = false;
    // diceNum.value = Math.floor(Math.random() * 6) + 1;
    diceNum.value = Math.floor(Math.random() * 2) + 5;
    if (
      diceNum.value === 6 ||
      players.value[playerIndex.value].chessGroups.find((el) => el.status === ChessGroupStatus.Move)
    ) {
      translateSelect();
    } else {
      translateNextPlayer();
    }
  } else {
    requestAnimationFrame(() => diceAnimat(timer - 1));
  }
};
const dice = () => {
  if (diceLoading.value) return;
  diceLoading.value = true;
  diceAnimat();
};
const fillRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  options?: {
    fillColor?: string;
    ctx?: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
  },
) => {
  const { fillColor, ctx = boardCtx.value } = options || {};
  if (!ctx) return;
  if (fillColor) {
    ctx.fillStyle = fillColor;
  }
  drawChesses();
  ctx.fillRect(x * cellSize.value, y * cellSize.value, w * cellSize.value, h * cellSize.value);
};
const drawLine = (
  x: number,
  y: number,
  w: number,
  h: number,
  options?: {
    fillColor?: string;
    wSegments?: number;
    hSegments?: number;
    wSpace?: number;
    hSpace?: number;
    marginInline?: number;
    marginBlock?: number;
    ctx?: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
  },
) => {
  const {
    fillColor,
    wSegments = 1,
    hSegments = 1,
    wSpace = 0,
    hSpace = 0,
    marginBlock = 0,
    marginInline = 0,
    ctx = boardCtx.value,
  } = options || {};
  if (!ctx) return;
  if (fillColor) {
    ctx.fillStyle = fillColor;
  }
  const wSize = (w - (wSegments - 1) * wSpace - marginInline * 2) / wSegments;
  const hSize = (h - (hSegments - 1) * hSpace - marginBlock * 2) / hSegments;
  for (let i = 0; i < wSegments; i++) {
    for (let j = 0; j < hSegments; j++) {
      fillRect(
        marginInline + x + (wSize + wSpace) * i,
        marginBlock + y + (hSize + hSpace) * j,
        wSize,
        hSize,
        { fillColor },
      );
    }
  }
};
const drawPath = (
  path: { x: number; y: number }[] | number[],
  options?: {
    fillColor?: string;
    ctx?: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
  },
) => {
  const { fillColor, ctx = boardCtx.value } = options || {};
  if (!ctx || path.length < 2) return;
  if (fillColor) {
    ctx.fillStyle = fillColor;
  }
  let newPath: { x: number; y: number }[] = [];
  if (typeof path[0] === 'number') {
    for (let i = 0; i < path.length; i += 2) {
      newPath.push({
        x: path[i] as number,
        y: path[i + 1] as number,
      });
    }
  } else {
    newPath = path as { x: number; y: number }[];
  }
  ctx.beginPath();
  ctx.moveTo(newPath[0].x * cellSize.value, newPath[0].y * cellSize.value);
  newPath.slice(1).forEach(({ x, y }) => {
    ctx.lineTo(x * cellSize.value, y * cellSize.value);
  });
  ctx.fill();
};

const drawCircle = (
  x: number,
  y: number,
  r: number,
  options?: {
    fillColor?: string;
    ctx?: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
  },
) => {
  const { fillColor, ctx = boardCtx.value } = options || {};
  if (!ctx) return;
  if (fillColor) {
    ctx.fillStyle = fillColor;
  }
  ctx.beginPath();
  ctx.arc(x * cellSize.value, y * cellSize.value, r * cellSize.value, 0, Math.PI * 2);
  ctx.fill();
};
const boradCells = ref<Cell[]>([]);
const colors = ['green', 'blue', 'red', 'gold'];
const firstType = ['bottomRight', 'bottomLeft', 'topLeft', 'topRight'];
const createCells = () => {
  const cells: Cell[] = [];
  let type = 'beforeFirst';
  let areaNo = 0;
  let cellNum = 0;
  for (let i = 0; i < 52; i++) {
    switch (type) {
      case 'beforeFirst':
        cells.push({
          color: colors[i % 4],
          x:
            areaNo % 2 === 0
              ? areaNo === 0
                ? 0
                : 15
              : (areaNo === 1 ? 9 : 7) + (areaNo === 1 ? 1 : -1) * cellNum,
          y:
            areaNo % 2 === 1
              ? areaNo === 1
                ? 0
                : 15
              : (areaNo === 0 ? 7 : 9) + (areaNo === 2 ? 1 : -1) * cellNum,
          type: 'rect',
          rectType: areaNo % 2 === 0 ? 'horizontal' : 'vertical',
        });
        cellNum++;
        if (cellNum === 2) {
          type = 'first';
          cellNum = 0;
        }
        break;
      case 'first':
        cells.push({
          color: colors[i % 4],
          x: [0, 11, 15, 4][areaNo],
          y: [4, 0, 11, 15][areaNo],
          type: 'triangle',
          triangleType: firstType[areaNo],
        });
        type = 'afterFirst';
        break;
      case 'afterFirst':
        cells.push({
          color: colors[i % 4],
          x:
            areaNo % 2 === 1
              ? areaNo === 1
                ? 11
                : 4
              : (areaNo === 2 ? 14 : 2) + (areaNo === 2 ? -1 : 1) * cellNum,
          y:
            areaNo % 2 === 0
              ? areaNo === 0
                ? 4
                : 11
              : (areaNo === 1 ? 2 : 14) + (areaNo === 1 ? 1 : -1) * cellNum,
          type: 'rect',
          rectType: areaNo % 2 === 1 ? 'horizontal' : 'vertical',
        });
        cellNum++;
        if (cellNum === 2) {
          type = 'jumpEnd';
          cellNum = 0;
        }
        break;
      case 'jumpEnd':
        cells.push({
          color: colors[i % 4],
          x: [4, 11, 11, 4][areaNo],
          y: [4, 4, 11, 11][areaNo],
          type: 'triangle',
          triangleType: firstType[(areaNo + 1) % 4],
        });
        type = 'jumpStart';
        break;
      case 'jumpStart':
        cells.push({
          color: colors[i % 4],
          x: [4, 11, 11, 4][areaNo],
          y: [4, 4, 11, 11][areaNo],
          type: 'triangle',
          triangleType: firstType[(areaNo + 3) % 4],
        });
        type = 'beforeEnd';
        break;
      case 'beforeEnd':
        cells.push({
          color: colors[i % 4],
          x:
            areaNo % 2 === 0
              ? areaNo === 0
                ? 4
                : 11
              : (areaNo === 1 ? 13 : 3) + (areaNo === 1 ? 1 : -1) * cellNum,
          y:
            areaNo % 2 === 1
              ? areaNo === 1
                ? 4
                : 11
              : (areaNo === 2 ? 13 : 3) + (areaNo === 2 ? 1 : -1) * cellNum,
          type: 'rect',
          rectType: areaNo % 2 === 0 ? 'horizontal' : 'vertical',
        });
        cellNum++;
        if (cellNum === 2) {
          type = 'end';
          cellNum = 0;
        }
        break;
      case 'end':
        cells.push({
          color: colors[i % 4],
          x: [4, 15, 11, 0][areaNo],
          y: [0, 4, 15, 11][areaNo],
          type: 'triangle',
          triangleType: firstType[areaNo],
        });
        type = 'afterEnd';
        break;
      case 'afterEnd':
        cells.push({
          color: colors[i % 4],
          x:
            areaNo % 2 === 1
              ? areaNo === 1
                ? 15
                : 0
              : (areaNo === 0 ? 6 : 10) + (areaNo === 0 ? 1 : -1) * cellNum,
          y:
            areaNo % 2 === 0
              ? areaNo === 0
                ? 0
                : 15
              : (areaNo === 1 ? 6 : 10) + (areaNo === 1 ? 1 : -1) * cellNum,
          type: 'rect',
          rectType: areaNo % 2 === 1 ? 'horizontal' : 'vertical',
        });
        cellNum++;
        if (cellNum === 2) {
          type = 'final';
          cellNum = 0;
        }
        break;
      case 'final':
        cells.push({
          color: colors[i % 4],
          x: areaNo % 2 === 1 ? (areaNo === 1 ? 15 : 0) : 8,
          y: areaNo % 2 === 0 ? (areaNo === 0 ? 0 : 15) : 8,
          type: 'rect',
          rectType: areaNo % 2 === 1 ? 'horizontal' : 'vertical',
        });
        areaNo++;
        cellNum = 0;
        type = 'beforeFirst';
        break;
    }
  }

  const movePaths: number[][] = [[], [], [], []];
  for (let i = 0; i < 13; i++) {
    movePaths[3].push((i + 2) % 52);
    movePaths[0].push((i + 15) % 52);
    movePaths[1].push((i + 28) % 52);
    movePaths[2].push((i + 41) % 52);
  }
  const finalCells: Cell[][] = [[], [], [], []];
  for (let i = 0; i < 5; i++) {
    finalCells[0].push({
      color: colors[0],
      x: 8,
      y: i + 2,
      type: 'rect',
      rectType: 'square',
    });
    finalCells[1].push({
      color: colors[1],
      x: 14 - i,
      y: 8,
      type: 'rect',
      rectType: 'square',
    });
    finalCells[2].push({
      color: colors[2],
      x: 8,
      y: 14 - i,
      type: 'rect',
      rectType: 'square',
    });
    finalCells[3].push({
      color: colors[3],
      x: i + 2,
      y: 8,
      type: 'rect',
      rectType: 'square',
    });
    movePaths[0].push(52 + i);
    movePaths[1].push(57 + i);
    movePaths[2].push(62 + i);
    movePaths[3].push(67 + i);
  }
  cells.push(...finalCells[0], ...finalCells[1], ...finalCells[2], ...finalCells[3]);
  boradCells.value = cells;
  pathCells.value = movePaths;
};
const drawRectCell = ({ x, y, rectType, color }: Cell) => {
  fillRect(x, y, rectType === 'horizontal' ? 2 : 1, rectType === 'vertical' ? 2 : 1, {
    fillColor: color,
  });
  drawCircle(
    x + (rectType === 'horizontal' ? 1 : 0.5),
    y + (rectType === 'vertical' ? 1 : 0.5),
    0.35,
    { fillColor: 'white' },
  );
};
const drawTriangle = ({ x, y, triangleType, color }: Cell) => {
  switch (triangleType) {
    case 'topLeft':
      drawPath([x, y, x + 2, y, x, y + 2], { fillColor: color });
      drawCircle(x + 0.55, y + 0.55, 0.35, { fillColor: 'white' });
      break;
    case 'topRight':
      drawPath([x, y, x + 2, y, x + 2, y + 2], { fillColor: color });
      drawCircle(x + 1.45, y + 0.55, 0.35, { fillColor: 'white' });
      break;
    case 'bottomLeft':
      drawPath([x, y, x + 2, y + 2, x, y + 2], { fillColor: color });
      drawCircle(x + 0.55, y + 1.45, 0.35, { fillColor: 'white' });
      break;
    case 'bottomRight':
      drawPath([x + 2, y, x + 2, y + 2, x, y + 2], { fillColor: color });
      drawCircle(x + 1.45, y + 1.45, 0.35, { fillColor: 'white' });
      break;
  }
};
const drawPlant = (x: number, y: number, fillColor: string) => {
  fillRect(x, y, 4, 4, { fillColor });
  drawCircle(x + 1, y + 1, 0.45, { fillColor: 'white' });
  drawCircle(x + 3, y + 1, 0.45, { fillColor: 'white' });
  drawCircle(x + 1, y + 3, 0.45, { fillColor: 'white' });
  drawCircle(x + 3, y + 3, 0.45, { fillColor: 'white' });
};
const drawChesses = () => {
  if (!mainCtx.value || !chessCtx.value) return;
  chessCtx.value.clearRect(0, 0, cellSize.value * 17, cellSize.value * 17);
  players.value.forEach((player) => {
    player.drawChess(chessCtx.value!);
  });
  mainCtx.value.clearRect(0, 0, cellSize.value * 17, cellSize.value * 17);
  mainCtx.value.drawImage(boardCanvas.value!, 0, 0);
  mainCtx.value.drawImage(chessCanvas.value!, 0, 0);
};
onMounted(() => {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize.value * 17;
  canvas.height = cellSize.value * 17;
  canvas.style.width = canvas.width / Board.dpr + 'px';
  canvas.style.height = canvas.height / Board.dpr + 'px';

  boardCanvas.value = new OffscreenCanvas(canvas.width, canvas.height);
  boardCtx.value = boardCanvas.value.getContext('2d')!;

  chessCanvas.value = new OffscreenCanvas(canvas.width, canvas.height);
  chessCtx.value = chessCanvas.value.getContext('2d')!;

  container.value!.appendChild(canvas);
  mainCtx.value = canvas.getContext('2d')!;

  drawPath([7, 7, 10, 7, 8.5, 8.5], { fillColor: colors[0] });
  drawCircle(8.5, 7.5, 0.35, { fillColor: 'white' });
  drawPath([10, 7, 10, 10, 8.5, 8.5], { fillColor: colors[1] });
  drawCircle(9.5, 8.5, 0.35, { fillColor: 'white' });
  drawPath([10, 10, 7, 10, 8.5, 8.5], { fillColor: colors[2] });
  drawCircle(8.5, 9.5, 0.35, { fillColor: 'white' });
  drawPath([7, 7, 8.5, 8.5, 7, 10], { fillColor: colors[3] });
  drawCircle(7.5, 8.5, 0.35, { fillColor: 'white' });

  createCells();
  boradCells.value.forEach((cell) => {
    switch (cell.type) {
      case 'rect':
        drawRectCell(cell);
        break;
      case 'triangle':
        drawTriangle(cell);
        break;
    }
  });
  drawLine(6, 12.45, 5, 0.1, {
    fillColor: colors[0],
    wSegments: 10,
    hSegments: 1,
    wSpace: 0.1,
    marginInline: 0.1,
  });
  drawLine(4.45, 6, 0.1, 5, {
    fillColor: colors[1],
    wSegments: 1,
    hSegments: 10,
    hSpace: 0.1,
    marginBlock: 0.1,
  });
  drawLine(6, 4.45, 5, 0.1, {
    fillColor: colors[2],
    wSegments: 10,
    hSegments: 1,
    wSpace: 0.1,
    marginInline: 0.1,
  });
  drawLine(12.45, 6, 0.1, 5, {
    fillColor: colors[3],
    wSegments: 1,
    hSegments: 10,
    hSpace: 0.1,
    marginBlock: 0.1,
  });
  players.value = [
    new Player(
      colors[0],
      { x: 12, y: 0 },
      { x: 15, y: 2 },
      cellSize.value,
      pathCells.value[0].map((index) => boradCells.value[index]),
    ),
    new Player(
      colors[1],
      { x: 16, y: 12 },
      { x: 15, y: 15 },
      cellSize.value,
      pathCells.value[1].map((index) => boradCells.value[index]),
    ),
    new Player(
      colors[2],
      { x: 4, y: 16 },
      { x: 2, y: 15 },
      cellSize.value,
      pathCells.value[2].map((index) => boradCells.value[index]),
    ),
    new Player(
      colors[3],
      { x: 0, y: 4 },
      { x: 2, y: 2 },
      cellSize.value,
      pathCells.value[3].map((index) => boradCells.value[index]),
    ),
  ];
  players.value.forEach((player) => {
    const { plantPoint, color } = player;
    drawPlant(plantPoint.x - 2, plantPoint.y - 2, color);
    player.drawChess(chessCtx.value!);
  });
  mainCtx.value.drawImage(boardCanvas.value, 0, 0);
  mainCtx.value.drawImage(chessCanvas.value, 0, 0);

  canvas.addEventListener('click', (e) => {
    if (gameStatus.value !== GameStatus.SelectChess) return;
    const x = Math.floor((e.offsetX * Board.dpr) / cellSize.value);
    const y = Math.floor((e.offsetY * Board.dpr) / cellSize.value);
    const currPlayer = players.value[playerIndex.value];
    let groupChess;
    if (
      x >= currPlayer.plantPoint.x - 2 &&
      x < currPlayer.plantPoint.x + 2 &&
      y >= currPlayer.plantPoint.y - 2 &&
      y < currPlayer.plantPoint.y + 2
    ) {
      for (let i = 0; i < currPlayer.chessGroups.length; i++) {
        const group = currPlayer.chessGroups[i];
        if (group.status === ChessGroupStatus.Ready) {
          const groupX = currPlayer.plantPoint.x - 2 + (i % 2 === 1 ? 2 : 0);
          const groupY = currPlayer.plantPoint.y - 2 + (Math.floor(i / 2) === 1 ? 2 : 0);
          if (x >= groupX && x < groupX + 2 && y >= groupY && y < groupY + 2) {
            groupChess = group;
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < currPlayer.chessGroups.length; i++) {
        const group = currPlayer.chessGroups[i];
        if (group.status === ChessGroupStatus.Move) {
          if (group.position === -1) {
            if (x === currPlayer.birthPoint.x && y === currPlayer.birthPoint.y) {
              groupChess = group;
              break;
            }
          } else {
            const groupCell = currPlayer.pathCell[group.position];
            let _w = 1;
            let _h = 1;
            let _x = groupCell.x;
            let _y = groupCell.y;
            switch (groupCell.type) {
              case 'rect':
                if (groupCell.rectType === 'horizontal') {
                  _x += 1;
                } else if (groupCell.rectType === 'vertical') {
                  _y += 1;
                }
                break;
              case 'triangle':
                switch (groupCell.triangleType) {
                  case 'topLeft':
                    _x += 0.05;
                    _y += 0.05;
                    break;
                  case 'topRight':
                    _x += 0.95;
                    _y += 0.05;
                    break;
                  case 'bottomLeft':
                    _x += 0.05;
                    _y += 0.95;
                    break;
                  case 'bottomRight':
                    _x += 0.95;
                    _y += 0.95;
                    break;
                }
                break;
            }

            if (x >= _x && x < _x + _w && y >= _y && y < _y + _h) {
              groupChess = group;
              break;
            }
          }
        }
      }
    }
    if (groupChess) {
      translateMove(groupChess);
    }
  });
});
</script>
<style scoped lang="scss">
.flight-chess {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .flight-chess-dice {
    position: absolute;
    left: 8px;
    top: 8px;
    .flight-chess-current-player {
      width: var(--flight-chess-size);
      height: var(--flight-chess-size);
      margin-bottom: 16px;
    }
  }
  .flight-chess-dice-num {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: var(--flight-chess-size);
    height: var(--flight-chess-size);
    font-size: calc(0.618 * var(--flight-chess-size));
    background-color: rgba($color: #fff, $alpha: 0.5);
    color: #000;
    line-height: var(--flight-chess-size);
    text-align: center;
    border-radius: 50%;
  }
}
</style>

import BinaryWriter from '@/lib/saver/BinaryWriter';
import { gunzipSync, strToU8 } from 'fflate';

export interface BlueprintArea {
  index: number;
  parentIndex: number;
  tropicAnchor: number;
  areaSegments: number;
  anchorLocalOffset: {
    x: number;
    y: number;
  };
  size: {
    x: number;
    y: number;
  };
}
interface XYZ {
  x: number;
  y: number;
  z: number;
}
export interface BlueprintBuilding {
  index: number;
  areaIndex: number;
  localOffset: [XYZ, XYZ];
  yaw: [number, number];
  tilt: number;
  itemId: number;
  modelIndex: number;
  outputObjIdx: number;
  inputObjIdx: number;
  outputToSlot: number;
  inputFromSlot: number;
  outputFromSlot: number;
  inputToSlot: number;
  outputOffset: number;
  inputOffset: number;
  recipeId: number;
  filterId: number;
  parameters: null | AllParameters;
}

export enum ItemCode {
  Belt = 2001,
  HightSpeedBelt = 2002,
  TopSpeedBelt = 2003,
}

const CODE_START = 'BLUEPRINT:';

const BASE_TIMESTAMP = new Date(0).setUTCFullYear(1);

const LAST_QUOT_INDEX_OFFSET = 33;

export type ParamParser<T> = {
  encodedSize: (p: UnknownParamerters) => number;
  decode: (dv: DataView) => T;
};

export interface BeltParameters {
  iconId: number;
  count: number;
}
export interface UnknownParamerters {
  parameters: Int32Array;
}

export type AllParameters = BeltParameters | UnknownParamerters;

const beltParamParser: ParamParser<BeltParameters> = {
  encodedSize() {
    return 2;
  },
  // encode(p, a) {
  //   setParam(a, 0, p.iconId);
  //   setParam(a, 1, p.count);
  // },
  decode(a) {
    return {
      iconId: getParam(a, 0),
      count: getParam(a, 1, 0),
    };
  },
};

const unknownParamParser: ParamParser<UnknownParamerters> = {
  encodedSize(p) {
    return p.parameters.length;
  },
  // encode(p, a) {
  //   for (let i = 0; i < p.parameters.length; i++) setParam(a, i, p.parameters[i]);
  // },
  decode(a) {
    const p: UnknownParamerters = {
      parameters: new Int32Array(a.byteLength / Int32Array.BYTES_PER_ELEMENT),
    };
    for (let i = 0; i < p.parameters.length; i++) p.parameters[i] = getParam(a, i);
    return p;
  },
};

const parameterParsers = new Map<number, ParamParser<AllParameters>>([
  // [2103, stationParamsParser(stationDesc)],
  // [2104, stationParamsParser(interstellarStationDesc)],
  // [2316, advancedMiningMachineParamParser()],
  // [2020, splitterParamParser],
  // [2901, labParamParser],
  // [2902, labParamParser],
  [ItemCode.Belt, beltParamParser],
  [ItemCode.HightSpeedBelt, beltParamParser],
  [ItemCode.TopSpeedBelt, beltParamParser],
  // [2011, inserterParamParser],
  // [2012, inserterParamParser],
  // [2013, inserterParamParser],
  // [2014, inserterParamParser],
  // [2101, storageParamParser(30)],
  // [2102, storageParamParser(60)],
  // [2106, tankParamParser],
  // [2311, ejectorParamParser],
  // [2208, powerGeneratorParamParser],
  // [2210, artifacialStarParamParser],
  // [2209, energyExchangerParamParser],
  // [2030, MonitorParamParser],
  // [3009, battleBaseParamParser()],
  // [2107, dispenserParamParser],
]);

const btoUint8Array = (b: string) => {
  const arr = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) {
    arr[i] = b.charCodeAt(i);
  }
  return arr;
};

const importArea = (r: BinaryWriter) => {
  return {
    index: r.readInt8(),
    parentIndex: r.readInt8(),
    tropicAnchor: r.readInt16(true),
    areaSegments: r.readInt16(true),
    anchorLocalOffset: {
      x: r.readInt16(true),
      y: r.readInt16(true),
    },
    size: {
      x: r.readInt16(true),
      y: r.readInt16(true),
    },
  };
};

function parserFor(itemId: number) {
  const parser = parameterParsers.get(itemId);
  if (parser !== undefined) return parser;
  return unknownParamParser;
}

function getParam(v: DataView, pos: number, defaultValue?: number) {
  const p = pos * Int32Array.BYTES_PER_ELEMENT;
  if (p >= v.byteLength) {
    if (defaultValue === undefined) {
      throw new Error('参数解析错误：数据段太短');
    } else {
      return defaultValue;
    }
  }
  return v.getInt32(p, true);
}
const importBuilding = (r: BinaryWriter) => {
  function readXYZ() {
    return {
      x: r.readFloat32(true),
      y: r.readFloat32(true),
      z: r.readFloat32(true),
    };
  }
  const index = r.readInt32(true);
  const v2 = index <= -100;
  const b: BlueprintBuilding = {
    index: v2 ? r.readInt32(true) : index,
    areaIndex: r.readInt8(),
    localOffset: [readXYZ(), readXYZ()],
    yaw: [r.readFloat32(true), r.readFloat32(true)],
    tilt: v2 ? r.readFloat32(true) : 0.0,
    itemId: r.readInt16(true),
    modelIndex: r.readInt16(true),
    outputObjIdx: r.readInt32(true),
    inputObjIdx: r.readInt32(true),
    outputToSlot: r.readInt8(),
    inputFromSlot: r.readInt8(),
    outputFromSlot: r.readInt8(),
    inputToSlot: r.readInt8(),
    outputOffset: r.readInt8(),
    inputOffset: r.readInt8(),
    recipeId: r.readInt16(true),
    filterId: r.readInt16(true),
    parameters: null,
  };
  const length = r.readInt16(true);
  if (length > 0) {
    const p = r.readView(length * Int32Array.BYTES_PER_ELEMENT);
    b.parameters = parserFor(b.itemId).decode(p);
  }
  return b;
};

export const parseBlueprintCode = (code: string) => {
  if (!code.startsWith(CODE_START))
    throw new Error('Invalid blueprint code(start): 无效的蓝图代码(蓝图代码开头不正确)');
  const firstQuotIndex = code.indexOf('"');
  const headerInfos = code.substring(CODE_START.length, firstQuotIndex).split(',');
  if (headerInfos.length < 12)
    throw new Error('Invalid blueprint code(header): 无效的蓝图代码(蓝图代码头部信息太短)');

  const headerInfo = {
    layout: headerInfos[1],
    icon: headerInfos.slice(2, 7).map((el) => +el),
    timestamp: new Date(BASE_TIMESTAMP + +headerInfos[8] / 10000),
    gameVersion: headerInfos[9],
    name: decodeURIComponent(headerInfos[10]),
    desc: decodeURIComponent(headerInfos[11]),
  };

  const lastQuotIndex = code.length - LAST_QUOT_INDEX_OFFSET;
  if (code[lastQuotIndex] !== '"')
    throw new Error('Invalid blueprint code(checksum): 无效的蓝图代码(校验码没找到)');

  const mainCode = code.substring(firstQuotIndex + 1, lastQuotIndex);
  const reader = new BinaryWriter('Read', 1);
  reader.setRawData(gunzipSync(strToU8(atob(mainCode), true)).buffer);
  const meta = {
    version: reader.readInt32(true),
    cursorOffset: {
      x: reader.readInt32(true),
      y: reader.readInt32(true),
    },
    cursorTargetArea: reader.readInt32(true),
    dragBoxSize: {
      x: reader.readInt32(true),
      y: reader.readInt32(true),
    },
    primaryAreaIdx: reader.readInt32(true),
  };

  const numAreas = reader.readUint8();

  const areas: Array<BlueprintArea> = [];
  for (let i = 0; i < numAreas; i++) areas.push(importArea(reader));

  const numBuildings = reader.readInt32(true);

  const buildings: Array<BlueprintBuilding> = [];
  for (let i = 0; i < numBuildings; i++) buildings.push(importBuilding(reader));

  return {
    header: headerInfo,
    ...meta,
    areas,
    buildings,
  };
};

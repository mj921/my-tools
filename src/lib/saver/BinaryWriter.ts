import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate';

const Uint32Max = 4294967295;

class BinaryWriter {
  mode: 'Read' | 'Write';
  dataExtensionLength: number;
  _data: ArrayBuffer;
  dataView: DataView;
  uint8View: Uint8Array;
  stringEncoder = new TextEncoder();
  stringDecoder = new TextDecoder();
  byteOffset: number;
  numericToStringIDMap: Map<any, any>;
  constructor(
    mode: 'Read' | 'Write',
    dataExtensionLength: number,
    initialSize = dataExtensionLength,
  ) {
    this.mode = mode;
    this.dataExtensionLength = dataExtensionLength;
    this._data = new ArrayBuffer(initialSize);
    this.dataView = new DataView(this._data);
    this.uint8View = new Uint8Array(this._data);
    this.byteOffset = 0;
    this.numericToStringIDMap = new Map();
  }

  set data(newData: ArrayBuffer) {
    this._data = newData;
    this.dataView = new DataView(this._data);
    this.uint8View = new Uint8Array(this._data);
  }

  get data() {
    return this._data;
  }

  get remainingBytes() {
    return this._data.byteLength - this.byteOffset;
  }

  checkDataSize(bytes: number) {
    if (this.remainingBytes < bytes) {
      throw new Error('存储不足！');
    }
  }

  checkWriteAccess() {
    if (this.mode !== 'Write') throw new Error('当前不是写模式，不能写入！');
  }
  checkReadAccess() {
    if (this.mode !== 'Read') throw new Error('当前不是读模式，不能读取！');
  }

  setRawData(data: ArrayBuffer | string) {
    this.checkReadAccess();
    if (typeof data === 'string') {
      this.data = unzlibSync(strToU8(atob(data), true)).buffer;
    } else {
      this.data = data;
    }
  }

  readBigInt64() {
    this.checkReadAccess();
    const int = this.dataView.getBigInt64(this.byteOffset);
    this.byteOffset += BigInt64Array.BYTES_PER_ELEMENT;
    return int;
  }
  readBigUint64() {
    this.checkReadAccess();
    const int = this.dataView.getBigUint64(this.byteOffset);
    this.byteOffset += BigUint64Array.BYTES_PER_ELEMENT;
    return int;
  }
  readFloat32(littleEndian?: boolean) {
    this.checkReadAccess();
    const value = this.dataView.getFloat32(this.byteOffset, littleEndian);
    this.byteOffset += Float32Array.BYTES_PER_ELEMENT;
    return value;
  }
  readFloat64() {
    this.checkReadAccess();
    const value = this.dataView.getFloat64(this.byteOffset);
    this.byteOffset += Float64Array.BYTES_PER_ELEMENT;
    return value;
  }
  readInt8() {
    this.checkReadAccess();
    const value = this.dataView.getInt8(this.byteOffset);
    this.byteOffset += Int8Array.BYTES_PER_ELEMENT;
    return value;
  }
  readInt16(littleEndian?: boolean) {
    this.checkReadAccess();
    const value = this.dataView.getInt16(this.byteOffset, littleEndian);
    this.byteOffset += Int16Array.BYTES_PER_ELEMENT;
    return value;
  }
  readInt32(littleEndian?: boolean) {
    this.checkReadAccess();
    const value = this.dataView.getInt32(this.byteOffset, littleEndian);
    this.byteOffset += Int32Array.BYTES_PER_ELEMENT;
    return value;
  }
  readUint8() {
    this.checkReadAccess();
    const value = this.dataView.getUint8(this.byteOffset);
    this.byteOffset += Uint8Array.BYTES_PER_ELEMENT;
    return value;
  }
  readUint16() {
    this.checkReadAccess();
    const value = this.dataView.getUint16(this.byteOffset);
    this.byteOffset += Uint16Array.BYTES_PER_ELEMENT;
    return value;
  }
  readUint32() {
    this.checkReadAccess();
    const value = this.dataView.getUint32(this.byteOffset);
    this.byteOffset += Uint32Array.BYTES_PER_ELEMENT;
    return value;
  }
  readString() {
    this.checkReadAccess();
    const stringLength = this.readUint32();
    const encodedString = this.uint8View.slice(this.byteOffset, this.byteOffset + stringLength);
    const string = this.stringDecoder.decode(encodedString);
    this.byteOffset += stringLength;
    return string;
  }
  readBoolean() {
    this.checkReadAccess();
    return this.readUint8() === 1;
  }
  readArray<T>(decodeArray: (val: BinaryWriter) => T) {
    this.checkReadAccess();
    const arrayLength = this.readUint32();
    const array = [];
    for (let i = 0; i < arrayLength; i++) {
      const newElement = decodeArray(this);
      if (newElement !== undefined) array.push(newElement);
    }
    return array;
  }
  readMap(
    decodeKey: (val: BinaryWriter) => any,
    decodeValue: (val: BinaryWriter, key: any) => any,
  ) {
    this.checkReadAccess();
    const map = new Map();
    const mapSize = this.readUint32();
    for (let i = 0; i < mapSize; i++) {
      const key = decodeKey(this);
      const value = decodeValue(this, key);
      if (key !== undefined && value !== undefined) map.set(key, value);
    }
    return map;
  }

  readJSON(
    decodeKey: (val: BinaryWriter) => any,
    decodeValue: (val: BinaryWriter, key: any) => any,
  ) {
    this.checkReadAccess();
    const map: Record<any, any> = {};
    const mapSize = this.readUint32();
    for (let i = 0; i < mapSize; i++) {
      const key = decodeKey(this);
      const value = decodeValue(this, key);
      if (key !== undefined && value !== undefined) map[key] = value;
    }
    return map;
  }
  readFixedLengthBuffer(length: number) {
    this.checkReadAccess();
    const buffer = this._data.slice(this.byteOffset, this.byteOffset + length);
    this.byteOffset += length;
    return buffer;
  }
  readBuffer() {
    this.checkReadAccess();
    const bufferByteLength = this.readUint32();
    const buffer = this._data.slice(this.byteOffset, this.byteOffset + bufferByteLength);
    this.byteOffset += bufferByteLength;
    return buffer;
  }

  readView(length?: number) {
    this.checkReadAccess();
    let bufferByteLength = length;
    if (typeof bufferByteLength === 'undefined') {
      bufferByteLength = this.readUint32();
    }

    const dataView = new DataView(this._data, this.byteOffset, bufferByteLength);
    this.byteOffset += bufferByteLength;
    return dataView;
  }

  readSet(decodeValue: (r: BinaryWriter) => any) {
    this.checkReadAccess();
    const set = new Set();
    const setSize = this.readUint32();
    for (let i = 0; i < setSize; i++) {
      const newValue = decodeValue(this);
      if (newValue !== undefined) set.add(newValue);
    }
    return set;
  }

  writeBigInt64(value: bigint) {
    this.checkWriteAccess();
    this.checkDataSize(BigInt64Array.BYTES_PER_ELEMENT);
    this.dataView.setBigInt64(this.byteOffset, value);
    this.byteOffset += BigInt64Array.BYTES_PER_ELEMENT;
  }
  writeBigUInt64(value: bigint) {
    this.checkWriteAccess();
    this.checkDataSize(BigUint64Array.BYTES_PER_ELEMENT);
    this.dataView.setBigUint64(this.byteOffset, value);
    this.byteOffset += BigUint64Array.BYTES_PER_ELEMENT;
  }
  writeFloat32(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Float32Array.BYTES_PER_ELEMENT);
    this.dataView.setFloat32(this.byteOffset, value);
    this.byteOffset += Float32Array.BYTES_PER_ELEMENT;
  }
  writeFloat64(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Float64Array.BYTES_PER_ELEMENT);
    this.dataView.setFloat64(this.byteOffset, value);
    this.byteOffset += Float64Array.BYTES_PER_ELEMENT;
  }
  writeInt8(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Int8Array.BYTES_PER_ELEMENT);
    this.dataView.setInt8(this.byteOffset, value);
    this.byteOffset += Int8Array.BYTES_PER_ELEMENT;
  }
  writeInt16(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Int16Array.BYTES_PER_ELEMENT);
    this.dataView.setInt16(this.byteOffset, value);
    this.byteOffset += Int16Array.BYTES_PER_ELEMENT;
  }
  writeInt32(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Int32Array.BYTES_PER_ELEMENT);
    this.dataView.setInt32(this.byteOffset, value);
    this.byteOffset += Int32Array.BYTES_PER_ELEMENT;
  }
  writeUint8(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Uint8Array.BYTES_PER_ELEMENT);
    this.dataView.setUint8(this.byteOffset, value);
    this.byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  }
  writeUint16(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Uint16Array.BYTES_PER_ELEMENT);
    this.dataView.setUint16(this.byteOffset, value);
    this.byteOffset += Uint16Array.BYTES_PER_ELEMENT;
  }
  writeUint32(value: number) {
    this.checkWriteAccess();
    this.checkDataSize(Uint32Array.BYTES_PER_ELEMENT);
    this.dataView.setUint32(this.byteOffset, value);
    this.byteOffset += Uint32Array.BYTES_PER_ELEMENT;
  }

  writeString(value: string) {
    this.checkWriteAccess();
    const encodedString = this.stringEncoder.encode(value);
    if (encodedString.byteLength > Uint32Max) {
      throw new Error(`Tried to write string but length exceeds: ${Uint32Max}`);
    }
    this.writeUint32(encodedString.byteLength);
    this.checkDataSize(encodedString.byteLength);
    this.uint8View.set(encodedString, this.byteOffset);
    this.byteOffset += encodedString.byteLength;
  }
  writeBoolean(value: boolean) {
    this.checkWriteAccess();
    this.writeUint8(value ? 1 : 0);
  }
  writeArray(array: any, encodeArray: (val: any, self: BinaryWriter) => void) {
    this.checkWriteAccess();
    if (array.length > Uint32Max) {
      throw new Error(`Tried to write array but length exceeds: ${Uint32Max}`);
    }
    this.writeUint32(array.length);
    array.forEach((value: any) => encodeArray(value, this));
  }
  writeMap(
    map: Map<any, any>,
    encodeKey: (key: any, self: BinaryWriter, value: any) => void,
    encodeValue: (key: any, self: BinaryWriter, value: any) => void,
  ) {
    this.checkWriteAccess();
    if (map.size > Uint32Max) {
      throw new Error(`Tried to write map, but size exceeds: ${Uint32Max}`);
    }
    this.writeUint32(map.size);
    map.forEach((value, key) => {
      encodeKey(key, this, value);
      encodeValue(value, this, key);
    });
  }

  writeComplexMap(map: Map<any, any>, encode: (key: any, value: any, self: BinaryWriter) => void) {
    this.checkWriteAccess();
    if (map.size > Uint32Max) {
      throw new Error(`Tried to write map, but size exceeds: ${Uint32Max}`);
    }
    this.writeUint32(map.size);
    map.forEach((value, key) => {
      encode(key, value, this);
    });
  }

  writeJSON(
    map: Object,
    encodeKey: (key: any, self: BinaryWriter, value: any) => void,
    encodeValue: (key: any, self: BinaryWriter, value: any) => void,
  ) {
    this.checkWriteAccess();
    const arr = Object.entries(map);
    if (arr.length > Uint32Max) {
      throw new Error(`Tried to write JSON, but size exceeds: ${Uint32Max}`);
    }
    this.writeUint32(arr.length);
    arr.forEach(([key, value]) => {
      encodeKey(key, this, value);
      encodeValue(value, this, key);
    });
  }

  writeComplexJSON(map: Object, encode: (key: any, value: any, self: BinaryWriter) => void) {
    this.checkWriteAccess();
    const arr = Object.entries(map);
    if (arr.length > Uint32Max) {
      throw new Error(`Tried to write JSON, but size exceeds: ${Uint32Max}`);
    }
    this.writeUint32(arr.length);
    arr.forEach((key, value) => {
      encode(key, value, this);
    });
  }
  getRawData() {
    this.checkWriteAccess();
    return this._data.slice(0, this.byteOffset);
  }
  getRawDataStr() {
    this.checkWriteAccess();
    return btoa(strFromU8(zlibSync(new Uint8Array(this._data.slice(0, this.byteOffset))), true));
  }
}

export default BinaryWriter;

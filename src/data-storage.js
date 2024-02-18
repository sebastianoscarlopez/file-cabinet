import { global } from '@/helpers/index';

export class DataStorage {

  constructor() {
    this.memory = new Map();
  }

  addMemory(key) {
    const { gl, dataStorageMaxMemory } = global;

    const buffer = gl.createBuffer();
    const bufferOffset = 0;
    this.memory.set(key, {
      bufferOffset,
      buffer
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, dataStorageMaxMemory, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  addData(key, data) {
    const { gl } = global;
    const currentMemory = this.memory.get(key);
    gl.bindBuffer(gl.ARRAY_BUFFER, currentMemory.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, currentMemory.bufferOffset, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    currentMemory.bufferOffset += data.byteLength;
  }

  replaceData(key, data) {
    const { gl } = global;
    const currentMemory = this.memory.get(key);
    gl.bindBuffer(gl.ARRAY_BUFFER, currentMemory.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    currentMemory.bufferOffset = data.byteLength;
  }

  getData(key) {
    const { buffer, bufferOffset } = this.memory.get(key);
    if(!bufferOffset) {
      return new Float32Array(0);
    }
    const { gl } = global;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const data = new Float32Array(bufferOffset);
    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return data;
  }
}

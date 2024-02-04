import { global } from '@/helpers/index';

export class DataStorage {
  constructor() {
    this.memoryBuffer = [];
    this.memoryBufferOffset = [];
  }

  init() {
    const { gl, CARDS_MAX, dataStorageMaxMemory } = global;

    for (let i = 0; i < CARDS_MAX; i++) {
      this.memoryBufferOffset[i] = 0;
      this.memoryBuffer[i] = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.memoryBuffer[i]);
      gl.bufferData(gl.ARRAY_BUFFER, dataStorageMaxMemory, gl.DYNAMIC_DRAW);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  addData(index, data) {
    const { gl } = global;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.memoryBuffer[index]);
    gl.bufferSubData(gl.ARRAY_BUFFER, this.memoryBufferOffset[index], data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.memoryBufferOffset[index] += data.byteLength;
  }

  replaceData(index, data) {
    const { gl } = global;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.memoryBuffer[index]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.memoryBufferOffset[index] = data.byteLength;
  }
}

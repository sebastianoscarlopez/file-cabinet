import { global } from '@/helpers/index';

export class DataStorage {
  constructor() {
    this.MAX_MEMORY = 4 * 1000;
    this.memoryBuffer = null;
    this.memoryBufferOffset = 0;
  }

  init() {
    const { gl } = global;

    this.memoryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.memoryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.MAX_MEMORY, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  addData(data) {
    const { gl } = global;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.memoryBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, this.memoryBufferOffset, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.memoryBufferOffset += data.byteLength;
  }

  replaceData(data) {
    const { gl } = global;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.memoryBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.memoryBufferOffset = data.byteLength;
  }
}

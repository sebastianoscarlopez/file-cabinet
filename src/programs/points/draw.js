import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

export function init() {
  const { gl, programs } = global;

  const programConfig = programs.find((program) => program.name === 'points');
  gl.useProgram(programConfig.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export function draw(index) {
  const { gl, cardsFrameBuffers, cardsTextureSize, dataStorage } = global;


  const {glProgram} = global.programs.find((program) => program.name === 'points');
  gl.useProgram(glProgram);

  gl.bindFramebuffer(gl.FRAMEBUFFER, cardsFrameBuffers[index + 1]);
  gl.viewport(0, 0, cardsTextureSize, cardsTextureSize);

  gl.clearColor(0.0, 0.0, 0.0, 0.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, dataStorage.memoryBuffer[index]);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  const totalPoints = dataStorage.memoryBufferOffset[index] / 4 / 2; // 2 floats per point
  gl.drawArrays(
    gl.POINTS,
    0,
    totalPoints
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
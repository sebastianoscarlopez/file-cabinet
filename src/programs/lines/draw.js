import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

export function init({
  vertexBuffer
}) {
  const { gl, programs } = global;

  const programConfigLines = programs.find((program) => program.name === 'lines');
  const glProgramLines = programConfigLines.program
  gl.useProgram(glProgramLines);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export function draw(index) {
  const { gl, cardsFrameBuffers, cardsTextureSize, dataStorage } = global;


  const {glProgram} = global.programs.find((program) => program.name === 'lines');
  gl.useProgram(glProgram);

  gl.bindFramebuffer(gl.FRAMEBUFFER, cardsFrameBuffers[index + 1]);
  gl.viewport(0, 0, cardsTextureSize, cardsTextureSize);

  console.log('clear lines');
  // gl.clearColor(0.0, 0.0, 0.0, 0.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, dataStorage.memoryBuffer[index]);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  const totalLines = dataStorage.memoryBufferOffset[index] / 4 / 2; // 2 floats per point
  gl.drawArrays(
    gl.POINTS,
    0,
    totalLines
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
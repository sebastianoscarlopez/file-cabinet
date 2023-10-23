import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

let rayVAO;

export function init({
  rayBuffer,
  modelsBuffer
}) {
  const { gl, programs } = global;

  const glProgram = programs.find((program) => program.name === 'ray').program;
  gl.useProgram(glProgram);

  rayVAO = gl.createVertexArray();
  gl.bindVertexArray(rayVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, modelsBuffer);

  const locModel = gl.getAttribLocation(glProgram, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, rayBuffer);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
  for (let i = 0; i < 4; i++) {
    gl.disableVertexAttribArray(locModel + i);
  }
}

export function draw() {

  const { gl } = global;

  const glProgram = global.programs.find((program) => program.name === 'ray').program;
  gl.useProgram(glProgram);

  gl.bindVertexArray(rayVAO);
  gl.drawArrays(
    gl.LINES,
    0,
    2
  );
  gl.bindVertexArray(null);
};
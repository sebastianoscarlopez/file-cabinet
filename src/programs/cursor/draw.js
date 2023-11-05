import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

let cursorVAO;

export function init({
  cursorBuffer
}) {
  const { gl, programs } = global;

  const glProgram = programs.find((program) => program.name === 'cursor').glProgram;
  gl.useProgram(glProgram);

  cursorVAO = gl.createVertexArray();
  gl.bindVertexArray(cursorVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
}

export function draw() {

  const { gl } = global;

  const glProgram = global.programs.find((program) => program.name === 'cursor').glProgram;
  gl.useProgram(glProgram);

  gl.bindVertexArray(cursorVAO);
  gl.drawArrays(
    gl.POINTS,
    0,
    1
  );
  gl.bindVertexArray(null);
};
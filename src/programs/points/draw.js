import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

let pointsVAO;

export function init({
  vertexBuffer,
  modelsBuffer
}) {
  const { gl, programs } = global;

  const glProgram = programs.find((program) => program.name === 'points').program;
  gl.useProgram(glProgram);

  pointsVAO = gl.createVertexArray();
  gl.bindVertexArray(pointsVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, modelsBuffer);

  const locModel = gl.getAttribLocation(glProgram, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
  for (let i = 0; i < 4; i++) {
    gl.disableVertexAttribArray(locModel + i);
  }
}

export function draw(totalPoints) {

  const { gl } = global;

  const glProgram = global.programs.find((program) => program.name === 'points').program;
  gl.useProgram(glProgram);

  // const index = gl.getUniformBlockIndex(glProgram, "Settings");
  // gl.uniformBlockBinding(glProgram, index, 0);


  // var u_color = gl.getUniformLocation(glProgramCard, "u_color");

  // gl.uniform3fv(u_color, [0, 0, 1]);


  gl.bindVertexArray(pointsVAO);
  gl.drawArraysInstanced(
    gl.LINE_STRIP,
    0,
    totalPoints,
    1
  );
  gl.bindVertexArray(null);
};
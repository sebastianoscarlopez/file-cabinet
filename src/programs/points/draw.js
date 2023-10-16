import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

let pointsVAO;

export function init({
  buffer
}) {
  const { gl, programs } = global;

  const glProgramCard = programs.find((program) => program.name === 'points').program;
  gl.useProgram(glProgramCard);

  pointsVAO = gl.createVertexArray();
  gl.bindVertexArray(pointsVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  const mboModels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mboModels);
  gl.bufferData(gl.ARRAY_BUFFER, 40 * 16, gl.DYNAMIC_DRAW);

  const locModel = gl.getAttribLocation(glProgramCard, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, mboModels);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, mat4.create());

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
  for (let i = 0; i < 4; i++) {
    gl.disableVertexAttribArray(locModel + i);
  }
}

export function draw(totalPoints) {

  const { gl } = global;

  const glProgramCard = global.programs.find((program) => program.name === 'points').program;
  gl.useProgram(glProgramCard);

  // const index = gl.getUniformBlockIndex(glProgramCard, "Settings");
  // gl.uniformBlockBinding(glProgramCard, index, 0);


  // var u_color = gl.getUniformLocation(glProgramCard, "u_color");

  // gl.uniform3fv(u_color, [0, 0, 1]);


  gl.bindVertexArray(pointsVAO);
  gl.drawArrays(
    gl.POINTS,
    0,
    totalPoints
  );
  gl.bindVertexArray(null);
};
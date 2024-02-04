import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

export function init({
  vertexBuffer,
  modelsBuffer
}) {
  const { gl, programs } = global;

  const programConfigLines = programs.find((program) => program.name === 'lines');
  const glProgramLines = programConfigLines.program
  gl.useProgram(glProgramLines);

  programConfigLines.vao = gl.createVertexArray();
  gl.bindVertexArray(programConfigLines.vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // const programConfigCard = programs.find((program) => program.name === 'quad');
  // const { glProgram: glProgramCard } = programConfigCard;
  // gl.useProgram(glProgramCard);

  // programConfigCard.vao = gl.createVertexArray();
  // gl.bindVertexArray(programConfigCard.vao);

  // gl.bindBuffer(gl.ARRAY_BUFFER, modelsBuffer);

  // const locModel = gl.getAttribLocation(glProgramCard, "model_matrix");
  // for (let i = 0; i < 4; i++) {
  //   gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
  //   gl.vertexAttribDivisor(locModel + i, 1);
  //   gl.enableVertexAttribArray(locModel + i);
  // }

  // gl.bindVertexArray(null);
  // gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

export function draw(totalLines) {
  drawLines(totalLines);
}

function drawLines(totalLines) {
  const { gl, CARD_SIZE, maxTextureSize, maxFrameBuffer, cardFrameBuffer, cardTexture, cardTextureSize, clientWidth, clientHeight } = global;

  const {glProgram, frameBuffer, vao} = global.programs.find((program) => program.name === 'lines');
  gl.useProgram(glProgram);

  const u_card_sizeLocation = gl.getUniformLocation(glProgram, "u_card_size");
  gl.uniform1f(u_card_sizeLocation, CARD_SIZE);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, clientWidth, clientHeight);

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindVertexArray(vao);
  gl.drawArraysInstanced(
    gl.POINTS,
    0,
    totalLines,
    1
  );
  gl.bindVertexArray(null);

  // gl.bindFramebuffer(gl.FRAMEBUFFER, maxFrameBuffer);
  // gl.viewport(0, 0, maxTextureSize, maxTextureSize);


};
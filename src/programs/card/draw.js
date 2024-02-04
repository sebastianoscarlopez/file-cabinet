import { global, getSquareGeometry } from '@/helpers/index';
import { setupUniformSettings } from '@/programs/shared-settings';

let CARDS_VAO;

export function init({
  modelsBuffer
}) {

  const { gl, programs } = global;
  const glProgram = programs.find((program) => program.name === 'card').glProgram;

  gl.useProgram(glProgram);

  CARDS_VAO = gl.createVertexArray();
  gl.bindVertexArray(CARDS_VAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, modelsBuffer);

  const locModel = gl.getAttribLocation(glProgram, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * 3, gl.DYNAMIC_DRAW);

  const coordinatesLayout = gl.getAttribLocation(glProgram, 'coordinates');
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  const squareGeometry = getSquareGeometry();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, squareGeometry.vertices);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, squareGeometry.indices, gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
  for (let i = 0; i < 4; i++) {
    gl.disableVertexAttribArray(locModel + i);
  }
}

export function draw({totalCards}) {
  const { gl, cardTexture } = global;

  const glProgram = global.programs.find((program) => program.name === 'card').glProgram;
  gl.useProgram(glProgram);

  var u_color = gl.getUniformLocation(glProgram, "u_color");
  gl.uniform3fv(u_color, [0, 0, 1]);


  const u_textureLocation = gl.getUniformLocation(glProgram, "u_texture");
  gl.uniform1i(u_textureLocation, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, cardTexture);

  gl.bindVertexArray(CARDS_VAO);
  gl.drawElementsInstanced(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0,
    totalCards
  );
  gl.bindVertexArray(null);
}

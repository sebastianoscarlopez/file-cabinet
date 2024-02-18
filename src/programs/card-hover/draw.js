import { global, getSquareGeometry } from '@/helpers/index';

let CARDS_VAO;
let models;

export function init({
  modelsBuffer
}) {
  models = modelsBuffer;

  const { gl, programs } = global;
  const glProgram = programs.find((program) => program.name === 'cardHover').glProgram;

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

export function draw() {
  const { gl, cardsData: { hoverCardIndex, selectedCardIndex } } = global;

  if(!selectedCardIndex && !hoverCardIndex) {
    return;
  }

  const glProgram = global.programs.find((program) => program.name === 'cardHover').glProgram;
  gl.useProgram(glProgram);

  gl.bindVertexArray(CARDS_VAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, models);
  const locModel = gl.getAttribLocation(glProgram, "model_matrix");
  for (let i = 0; i < 4; i++) {
    const offsetIndex = (selectedCardIndex || hoverCardIndex) - 1;
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, (16 * 4 * offsetIndex) + 4 * 4 * i);
    gl.enableVertexAttribArray(locModel + i);
  }

  gl.drawElements(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0
  );
  gl.bindVertexArray(null);
}

import { global, getSquareGeometry } from '@/helpers/index';

let GRID_VAO;

export function init() {

  const { gl, programs } = global;
  const glProgram = programs.find((program) => program.name === 'grid').glProgram;

  gl.useProgram(glProgram);

  GRID_VAO = gl.createVertexArray();

  gl.bindVertexArray(GRID_VAO);

  const { vertices, indices } = getSquareGeometry({
    width: 2,
    height: 2
  });

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const coordinatesLayout = gl.getAttribLocation(glProgram, 'coordinates');
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
}

export function draw() {
  const { gl } = global;

  const glProgramCard = global.programs.find((program) => program.name === 'grid').glProgram;
  gl.useProgram(glProgramCard);

  gl.bindVertexArray(GRID_VAO);
  gl.drawElements(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0
  );
  gl.bindVertexArray(null);
}

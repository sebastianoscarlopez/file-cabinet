import { mat4 } from 'gl-matrix';
import { global, getSquareGeometry } from '@/helpers/index';

export function drawSquares() {

  const { gl } = global;
  const MAX_VERTICES = 100;

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * MAX_VERTICES * 3, gl.DYNAMIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 2 * MAX_VERTICES, gl.STATIC_DRAW);


  const squareGeometry = getSquareGeometry();
  const square1 = mat4.create();
  const square2 = mat4.create();
  const squares = [
    {
      modelMatrix: square1
    },
    {
      modelMatrix: square2
    }
  ];
  mat4.translate(square1, square1, [0.25, 0.25, 0]);
  mat4.translate(square2, square2, [-0.25, -0.25, 0]);


  const glProgramCard = global.programs.find((program) => program.name === 'card').program;
  gl.useProgram(glProgramCard);

  const index = gl.getUniformBlockIndex(glProgramCard, "Settings");
  gl.uniformBlockBinding(glProgramCard, index, 0);

  const coordinates = gl.getAttribLocation(glProgramCard, 'coordinates');
  gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinates);

  var u_color = gl.getUniformLocation(glProgramCard, "u_color");

  gl.uniform3fv(u_color, [0, 0, 1]);

  const mboModels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mboModels);
  gl.bufferData(gl.ARRAY_BUFFER, 40 * 16 * squares.length, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, mboModels);


  const locModel = gl.getAttribLocation(glProgramCard, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, squareGeometry.vertices);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, squareGeometry.indices);

  const data = new Float32Array(squares.flatMap((square) => [...square.modelMatrix]));
  gl.bindBuffer(gl.ARRAY_BUFFER, mboModels);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

  gl.drawElementsInstanced(
    gl.TRIANGLE_STRIP,
    squareGeometry.indices.length,
    gl.UNSIGNED_SHORT,
    0,
    2
  );
}

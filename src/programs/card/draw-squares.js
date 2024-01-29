import { mat4 } from 'gl-matrix';
import { global, getSquareGeometry } from '@/helpers/index';

let pointsVAO;

export function init() {
  const squareGeometry = getSquareGeometry();
  const squares = [
    {
      modelMatrix: mat4.create()
    },
    {
      modelMatrix: mat4.create()
    }
  ];
  mat4.translate(squares[0].modelMatrix, squares[0].modelMatrix, [0.25, 0.25, 0]);
  mat4.translate(squares[1].modelMatrix, squares[1].modelMatrix, [-0.25, -0.25, 0]);

  const { gl, programs } = global;
  const glProgramCard = programs.find((program) => program.name === 'card').glProgram;

  gl.useProgram(glProgramCard);

  pointsVAO = gl.createVertexArray();
  gl.bindVertexArray(pointsVAO);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * 3, gl.DYNAMIC_DRAW);

  const coordinatesLayout = gl.getAttribLocation(glProgramCard, 'coordinates');
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

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

  const data = new Float32Array(squares.flatMap((square) => [...square.modelMatrix]));
  gl.bindBuffer(gl.ARRAY_BUFFER, mboModels);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

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
  const { gl } = global;

  const glProgram = global.programs.find((program) => program.name === 'card').glProgram;
  gl.useProgram(glProgram);

  var u_color = gl.getUniformLocation(glProgram, "u_color");
  gl.uniform3fv(u_color, [0, 0, 1]);

  // const index = gl.getUniformBlockIndex(glProgramCard, "Settings");
  // gl.uniformBlockBinding(glProgramCard, index, 0);

  gl.bindVertexArray(pointsVAO);
  gl.drawElementsInstanced(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0,
    1
  );
  gl.bindVertexArray(null);
}

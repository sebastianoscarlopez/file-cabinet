import { global, getTriangleGeometry, getPolygonGeometry } from '@/helpers/index';

const BASIC_MAX_VERTICES = 100;
let basicVertexBuffer, basicIndexBuffer, basicVAO;

export function init() {
  const { gl, programs } = global;
  const glProgramBasic = programs.find((program) => program.name === 'basic').program;

  gl.useProgram(glProgramBasic);

  basicVAO = gl.createVertexArray();
  gl.bindVertexArray(basicVAO);

  basicVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, basicVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * BASIC_MAX_VERTICES * 3, gl.DYNAMIC_DRAW);

  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  basicIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basicIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 2 * BASIC_MAX_VERTICES, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
}

export function draw() {
  const { gl, programs } = global;
  const glProgramBasic = programs.find((program) => program.name === 'basic').program;

  gl.useProgram(glProgramBasic);

  // const index = gl.getUniformBlockIndex(glProgramBasic, "Settings");
  // gl.uniformBlockBinding(glProgramBasic, index, 0);

  var u_color = gl.getUniformLocation(glProgramBasic, "u_color");

  gl.uniform3fv(u_color, [1, 1, 0]);

  drawTriangle();

  gl.uniform3fv(u_color, [1, 0, 1]);

  drawCircle();
  
  function drawCircle() {
    const geometry = getPolygonGeometry({ steps: 30 });

    gl.bindBuffer(gl.ARRAY_BUFFER, basicVertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, geometry.vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basicIndexBuffer);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, geometry.indices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindVertexArray(basicVAO);
    gl.drawElements(
      gl.TRIANGLE_STRIP,
      geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );
    gl.bindVertexArray(null);
  }
  function drawTriangle() {
    const geometry = getTriangleGeometry();

    gl.bindBuffer(gl.ARRAY_BUFFER, basicVertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, geometry.vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basicIndexBuffer);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, geometry.indices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindVertexArray(basicVAO);
    gl.drawElements(
      gl.TRIANGLE_STRIP,
      geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );
    gl.bindVertexArray(null);
  }
}

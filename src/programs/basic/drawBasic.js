import { global, getTriangleGeometry, getPolygonGeometry } from '@/helpers/index';


export function drawBasic() {
  const { gl, programs } = global;
  const glProgramBasic = programs.find((program) => program.name === 'basic').program;

  const MAX_VERTICES = 100;

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * MAX_VERTICES * 3, gl.DYNAMIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 2 * MAX_VERTICES, gl.STATIC_DRAW);

  const index = gl.getUniformBlockIndex(glProgramBasic, "Settings");
  gl.uniformBlockBinding(glProgramBasic, index, 0);

  const coordinates = gl.getAttribLocation(glProgramBasic, 'coordinates');
  gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinates);

  var u_color = gl.getUniformLocation(glProgramBasic, "u_color");

  gl.uniform3fv(u_color, [1, 1, 0]);
  drawTriangle();

  gl.uniform3fv(u_color, [1, 0, 1]);
  drawCircle();

  function drawCircle() {
    const geometry = getPolygonGeometry({ steps: 30 });

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, geometry.vertices);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, geometry.indices);

    gl.drawElements(
      gl.TRIANGLE_STRIP,
      geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
  function drawTriangle() {
    const geometry = getTriangleGeometry();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, geometry.vertices);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, geometry.indices);

    gl.drawElements(
      gl.TRIANGLE_STRIP,
      geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}

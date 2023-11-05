import { global, getSquareGeometry } from '@/helpers/index';


export function init() {
  const geometry = getSquareGeometry();

  const { gl, programs } = global;
  const program = programs.find((program) => program.name === 'quad');

  console.log('quad init', program);
  gl.useProgram(program.glProgram);

  program.vao = gl.createVertexArray();
  gl.bindVertexArray(program.vao);

  program.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, program.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  program.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
}

export function draw() {
  const { gl, programs } = global;
  const program = programs.find((program) => program.name === 'quad');

  gl.useProgram(program.glProgram);

  gl.bindVertexArray(program.vao);

  gl.drawElements(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0
  );
  gl.bindVertexArray(null);
}

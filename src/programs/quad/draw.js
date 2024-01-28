import { global, getSquareGeometry } from '@/helpers/index';


export function init({
  modelsBuffer
}) {
  const geometry = getSquareGeometry();

  const { gl, programs } = global;
  const programConfig = programs.find((program) => program.name === 'quad');

  console.log('quad init', programConfig);
  gl.useProgram(programConfig.glProgram);

  programConfig.vao = gl.createVertexArray();
  gl.bindVertexArray(programConfig.vao);

  programConfig.modelsBuffer = modelsBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, modelsBuffer);

  const locModel = gl.getAttribLocation(programConfig.glProgram, "model_matrix");
  for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(locModel + i, 4, gl.FLOAT, false, 4 * 16, 4 * 4 * i);
    gl.vertexAttribDivisor(locModel + i, 1);
    gl.enableVertexAttribArray(locModel + i);
  }

  programConfig.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, programConfig.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  programConfig.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programConfig.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(coordinatesLayout);
  for (let i = 0; i < 4; i++) {
    gl.disableVertexAttribArray(locModel + i);
  }
}

export function draw() {
  const { gl, programs } = global;
  const program = programs.find((program) => program.name === 'quad');

  gl.useProgram(program.glProgram);

  gl.bindVertexArray(program.vao);

  gl.drawElementsInstanced(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0,
    1
  );
  gl.bindVertexArray(null);
}

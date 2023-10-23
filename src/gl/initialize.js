import { global } from '@/helpers/index';
import { glMatrix, mat4 } from 'gl-matrix';

export function setupCanvas(canvas) {
  const gl = canvas.getContext('webgl2', {antialias: false, stencil: true});
//   gl.enable(gl.SAMPLE_COVERAGE);
//   gl.sampleCoverage(0.5, false);
//   gl.getParameter(gl.SAMPLE_COVERAGE_VALUE); // 0.5
// gl.getParameter(gl.SAMPLE_COVERAGE_INVERT); // false

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.1, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  const aspect = canvas.clientWidth / canvas.clientHeight;

  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [0,0,1], [0,0, 0], [0,1,0]);
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, glMatrix.toRadian(90), aspect, 0.001, 100);
  // mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0, 2);
  //glm::radians(90.0f), 800.0f / 600.0f, 0.1f, 100.0f
  // mat4.perspective(projectionMatrix, glMatrix.toRadian(45), 1, 0.1, 1000);

// perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  global.gl = gl;
  global.viewMatrix = viewMatrix;
  global.projectionMatrix = projectionMatrix;
}
import { global } from '@/helpers/index';
import { glMatrix, mat4 } from 'gl-matrix';

export function setupCanvas(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, stencil: true, alpha: false, premultipliedAlpha: false, xrCompatible: true });
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  // gl.disable(gl.DEPTH_TEST);
  //   gl.enable(gl.SAMPLE_COVERAGE);
  //   gl.sampleCoverage(0.5, false);
  //   gl.getParameter(gl.SAMPLE_COVERAGE_VALUE); // 0.5
  // gl.getParameter(gl.SAMPLE_COVERAGE_INVERT); // false

  // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  gl.enable(gl.DEPTH_TEST);
  // console.log('clear setup');
  gl.clearColor(0.0, 0.0, 1.0, 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspect = canvas.clientWidth / canvas.clientHeight;

  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0]);
  let projectionMatrix = mat4.create();

  // mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0, 2);
  //glm::radians(90.0f), 800.0f / 600.0f, 0.1f, 100.0f
  // mat4.perspective(projectionMatrix, glMatrix.toRadian(45), 1, 0.1, 1000);

  // perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  global.gl = gl;
  global.canvas = canvas;
  global.viewMatrix = viewMatrix;
  global.projectionMatrix = projectionMatrix;
  global.aspect = aspect;
  global.clientWidth = canvas.clientWidth;
  global.clientHeight = canvas.clientHeight;
  global.isWebXR = false;
  global.requestAnimationFrame = window.requestAnimationFrame.bind(window);
}
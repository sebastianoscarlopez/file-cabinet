import { mat4 } from 'gl-matrix';
import { global } from '@/helpers/index';

export function init({
  vertexBuffer,
}) {
  const { gl, programs } = global;

  const programConfig = programs.find((program) => program.name === 'lines');
  const glProgram = programConfig.program
  gl.useProgram(glProgram);

  programConfig.linesVAO = gl.createVertexArray();
  gl.bindVertexArray(programConfig.linesVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const coordinatesLayout = 0;
  gl.vertexAttribPointer(coordinatesLayout, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coordinatesLayout);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  setupFrameBuffer();
}

function setupFrameBuffer() {
  const { gl, programs, clientWidth, clientHeight } = global;
  const programConfig = programs.find((program) => program.name === 'lines');

  programConfig.frameBuffer = gl.createFramebuffer();
  if(!programConfig.frameBuffer) {
    console.log('framebuffer failed');
  } else {
    console.log('framebuffer success');
  }

  programConfig.frameBuffer.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, programConfig.frameBuffer.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, clientWidth, clientHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  if(!gl.isTexture(programConfig.frameBuffer.texture)) {
    console.log('texture failed');
  } else {
    console.log('texture success');
  }

  const depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, clientWidth, clientHeight);

  gl.bindFramebuffer(gl.FRAMEBUFFER, programConfig.frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, programConfig.frameBuffer.texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.log('framebuffer not complete');
  }
  else {
    console.log('framebuffer complete');
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
}

export function draw(totalLines) {
  drawLines(totalLines);

  drawQuad();
}

function drawQuad() {
  const { gl, programs } = global;
  const programLinesConfig = programs.find((program) => program.name === 'lines');
  const programConfig = programs.find((program) => program.name === 'quad');

  gl.useProgram(programConfig.glProgram);

  // gl.disable(gl.STENCIL_TEST);
  // gl.depthFunc(gl.ALWAYS)

  gl.bindVertexArray(programConfig.vao);

  // uniform texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, programLinesConfig.frameBuffer.texture);  
  gl.uniform1i(programConfig.uniforms.uTexture, 0);

  gl.drawElements(
    gl.TRIANGLE_STRIP,
    4,
    gl.UNSIGNED_SHORT,
    0
  );
  gl.bindVertexArray(null);
}


function drawLines(totalLines) {
  const { gl, clientWidth, clientHeight } = global;

  const {glProgram, frameBuffer, linesVAO} = global.programs.find((program) => program.name === 'lines');
  gl.useProgram(glProgram);

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.viewport(0, 0, clientWidth, clientHeight); 

  gl.clearColor(0.0, 0.0, 0.0, 0.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindVertexArray(linesVAO);
  gl.drawArraysInstanced(
    gl.LINE_STRIP,
    0,
    totalLines,
    1
  );
  gl.bindVertexArray(null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, clientWidth, clientHeight);
};
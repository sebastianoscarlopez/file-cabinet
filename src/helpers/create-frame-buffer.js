import { global } from '@/helpers/index';

export function createGenericFrameBufferWithTexture(width, height) {
  const { gl, CARDS_MAX } = global;
  const depth = CARDS_MAX + 1; // +1 for the base texture

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, width , height, depth, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if(!gl.isTexture(texture)) {
    console.log('texture failed');
  }

  const frameBuffers = [];
  for (let i = 0; i < depth; i++) {
    frameBuffers[i] = gl.createFramebuffer();
    if(!frameBuffers[i]) {
      console.log(`framebuffer[${i}] failed`);
    }

    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width , height );

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[i]);
    gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture, 0, i);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.log(`framebuffer[${i}] not complete: ${status}`);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  return {frameBuffers, texture};
}
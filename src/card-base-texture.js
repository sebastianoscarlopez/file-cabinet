import { global, createGenericFrameBufferWithTexture } from '@/helpers/index';
import { grid } from './programs/index';

export function createCardBaseTexture() {
  const { gl } = global;

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  const {
    frameBuffer: cardFrameBuffer, texture: cardTexture
  } = createGenericFrameBufferWithTexture(maxTextureSize, maxTextureSize);

  gl.bindFramebuffer(gl.FRAMEBUFFER, cardFrameBuffer);

  gl.viewport(0, 0, maxTextureSize, maxTextureSize);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  grid.init();
  grid.draw();

  return { cardFrameBuffer, cardTexture };
}

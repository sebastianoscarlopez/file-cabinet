import { global, createGenericFrameBufferWithTexture } from '@/helpers/index';
import { grid } from './programs/index';

export function createCardBaseTexture() {
  const { gl, CARDS_MAX, clientHeight } = global;

  const cardTextureSize = gl.getParameter(gl.MAX_3D_TEXTURE_SIZE);

  const {
    frameBuffers: cardFrameBuffers, texture: cardTexture
  } = createGenericFrameBufferWithTexture(cardTextureSize, cardTextureSize);

  gl.bindFramebuffer(gl.FRAMEBUFFER, cardFrameBuffers[0]);
  gl.viewport(0, 0, cardTextureSize, cardTextureSize);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  grid.init();
  grid.draw();

  global.cardFrameBuffers = cardFrameBuffers;
  global.cardTexture = cardTexture;
  global.cardTextureSize = cardTextureSize;
}

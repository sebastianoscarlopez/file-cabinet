import { global, createGenericFrameBufferWithTexture2DArray } from '@/helpers/index';
import { grid } from './programs/index';

export function createCardsFrameBuffers() {
  const { gl, CARDS_MAX } = global;

  const cardsTextureSize = gl.getParameter(gl.MAX_3D_TEXTURE_SIZE);
  const depth = CARDS_MAX + 1; // +1 for the base texture

  const {
    frameBuffers: cardsFrameBuffers, texture: cardsTexture
  } = createGenericFrameBufferWithTexture2DArray(cardsTextureSize, cardsTextureSize, depth);

  gl.bindFramebuffer(gl.FRAMEBUFFER, cardsFrameBuffers[0]);
  gl.viewport(0, 0, cardsTextureSize, cardsTextureSize);

  console.log('clear createCardsFrameBuffers');
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  grid.init();
  grid.draw();

  global.cardsFrameBuffers = cardsFrameBuffers;
  global.cardsTexture = cardsTexture;
  global.cardsTextureSize = cardsTextureSize;
}

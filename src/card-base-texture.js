import { global, createGenericFrameBufferWithTexture } from '@/helpers/index';
import { grid } from './programs/index';

export function createCardBaseTexture() {
  const { gl, CARDS_MAX, clientHeight } = global;

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  const {
    frameBuffer: maxFrameBuffer, texture: maxTexture
  } = createGenericFrameBufferWithTexture(maxTextureSize, maxTextureSize);

  gl.bindFramebuffer(gl.FRAMEBUFFER, maxFrameBuffer);
  gl.viewport(0, 0, maxTextureSize, maxTextureSize);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  grid.init();
  grid.draw();

  global.maxFrameBuffer = maxFrameBuffer;
  global.maxTexture = maxTexture;
  global.maxTextureSize = maxTextureSize;

  const cardTextureSize = maxTextureSize / (CARDS_MAX + 1);

  const {
    frameBuffer: cardFrameBuffer, texture: cardTexture
  } = createGenericFrameBufferWithTexture(cardTextureSize, cardTextureSize);

  global.cardFrameBuffer = cardFrameBuffer;
  global.cardTexture = cardTexture;
  global.cardTextureSize = cardTextureSize;
  console.log(global)
}

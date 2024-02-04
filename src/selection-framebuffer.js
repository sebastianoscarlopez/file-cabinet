import { global, createGenericFrameBufferWithTexture2DArray } from '@/helpers/index';

export function createSelectionFrameBuffer() {
  const { gl, clientWidth, clientHeight } = global;

  const {
    frameBuffers: [selectionFrameBuffer], texture: selectionTexture
  } = createGenericFrameBufferWithTexture2DArray(clientWidth, clientHeight, 1);

  global.selectionFrameBuffer = selectionFrameBuffer;
  global.selectionTexture = selectionTexture;
}

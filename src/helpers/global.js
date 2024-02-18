import { DataStorage } from '@/data-storage';

export default {
  CARDS_MAX: 30,
  dataStorageMaxMemory: 4 * 5000,
  initiated: false,
  canvas: undefined,
  gl: undefined,
  viewMatrix: undefined,
  projectionMatrix: undefined,
  programs: [],
  cardsFrameBuffers: undefined,
  cardsTexture: undefined,
  cardsTextureSize: undefined,
  dataStorage: new DataStorage(),
  selectionFrameBuffer: undefined,
  selectionTexture: undefined,
  cursorData: {
    pixels: [0, 0, 0, 0],
    x: 0,
    y: 0,
  },
  cardsData: {
    selectedCardIndex: null,
    hoverCardIndex: null,
    plotConfig: []
  }
}

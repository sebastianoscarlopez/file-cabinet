import { global } from '@/helpers/index';
import { mat4, vec4 } from 'gl-matrix';

const state = {
  speed: 0.002,
  dragAndDropLastPosition: null,
  dragAndDropDeltaOffset: null,
  CARDS_mboModels: null,
  CARDS_squares: null,
};

export function cardsHandlerInit(CARDS_mboModels, CARDS_squares) {
  const { canvas } = global;
  
  state.CARDS_mboModels = CARDS_mboModels;
  state.CARDS_squares = CARDS_squares;
  cardsUpdateModels();

  canvas.addEventListener('mousedown', mouseDownHandler);
  canvas.addEventListener('mouseup', mouseUpHandler);
}

export function cardsUpdateModels() {
  const { gl, CARDS_MAX } = global;
  const { CARDS_mboModels, CARDS_squares } = state;

  gl.bindBuffer(gl.ARRAY_BUFFER, CARDS_mboModels);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * 16 * CARDS_MAX, gl.DYNAMIC_DRAW);

  const data = new Float32Array(CARDS_squares.flatMap((square) => [...square.modelMatrix]));
  gl.bindBuffer(gl.ARRAY_BUFFER, CARDS_mboModels);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
}

export function cardsDragAndDropHandler() {
  const { cursorData, cardsData } = global;
  const { CARDS_squares, speed, dragAndDropLastPosition } = state;

  cardsData.hoverCardIndex = cursorData.pixels[0];
  if(cardsData.selectedCardIndex > 0) {
    const { x, y } = cursorData;
    const [lastX, lastY] = dragAndDropLastPosition;
    const deltaOffset = [x - lastX, y - lastY];
    state.dragAndDropLastPosition = [x, y];
    
    const square = CARDS_squares[cardsData.selectedCardIndex - 1];
    square.modelMatrix = mat4.translate(square.modelMatrix, square.modelMatrix, [deltaOffset[0] * speed, deltaOffset[1] * speed, 0.0]);
    cardsUpdateModels();
  }
}

function mouseDownHandler(event) {
  const { cursorData, cardsData } = global;

  if (cardsData.hoverCardIndex > 0 && event.buttons === 1 && event.button === 0 ) {
    cardsData.selectedCardIndex = cardsData.hoverCardIndex;
    state.dragAndDropLastPosition = [cursorData.x, cursorData.y];
  }
}

function mouseUpHandler() {
  state.dragAndDropDeltaEndAt = null;
  global.cardsData.selectedCardIndex = null;
}

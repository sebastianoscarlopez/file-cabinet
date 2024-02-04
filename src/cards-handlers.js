import { global } from '@/helpers/index';

const state = {
  dragAndDropStartAt: null,
  dragAndDropDeltaEndAt: null,

  selectedCardIndex: null,
  cards: []
};

export function cardsHandlerInit() {
  const { canvas } = global;
  canvas.addEventListener('mousedown', mouseDownHandler);
  canvas.addEventListener('mouseup', mouseUpHandler);
}

export function cardsDragAndDropHandler() {
  const { gl, cursorData } = global;
  
  if(state.selectedCardIndex > 0) {

  }
}

function mouseDownHandler(event) {
  const { cursorData } = global;

  state.selectedCardIndex = cursorData.pixels[0];
  if (state.selectedCardIndex > 0 && event.buttons === 1 && event.button === 0 ) {
    state.dragAndDropStartAt = [cursorData.x, cursorData.y];
    state.dragAndDropDeltaEndAt = [];
  }
}

function mouseUpHandler() {
  state.selectedCardIndex = null;
  state.dragAndDropDeltaEndAt = null;
}
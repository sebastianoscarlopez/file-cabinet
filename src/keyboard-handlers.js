import { global } from '@/helpers/index';
import { KEY_CODES } from './constants/KEY_CODES';

export function keydownHandler(event) {
  const { gl, canvas } = global;
  const { keyCode } = event;
  switch(keyCode) {
    case KEY_CODES.UP:
      canvas.dispatchEvent(new CustomEvent('move-up'));
      break;
    case KEY_CODES.DOWN:
      canvas.dispatchEvent(new CustomEvent('move-down'));
      break;
    case KEY_CODES.LEFT:
      canvas.dispatchEvent(new CustomEvent('move-left'));
      break;
    case KEY_CODES.RIGHT:
      canvas.dispatchEvent(new CustomEvent('move-right'));
      break;
  }
  // console.log(event);
}

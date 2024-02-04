
import { global } from '@/helpers/index';

export function mouseMoveHandler(CURSOR_boCoords, event) {
  const { gl } = global;

  const mouseCoords = mouseCoordsToClipCoords(event);

  gl.bindBuffer(gl.ARRAY_BUFFER, CURSOR_boCoords);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(mouseCoords));
}

function mouseCoordsToClipCoords(event) {
  const { gl, cursorData } = global;
  const { canvas } = gl;
  const { clientWidth, clientHeight } = canvas;
  const { clientX, clientY } = event;
  const x = clientX / clientWidth * 2 - 1;
  const y = 1 - clientY / clientHeight * 2;

  const mouse_x = clientX;
  const mouse_y = clientHeight - clientY;
  cursorData.x = mouse_x;
  cursorData.y = mouse_y;  

  return [x, y];
}

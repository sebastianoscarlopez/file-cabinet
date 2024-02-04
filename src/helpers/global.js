const ROWS_COLS_TEXTURE = 4;
const CARDS_MAX = ROWS_COLS_TEXTURE * ROWS_COLS_TEXTURE - 1; // -1 because the first is the base card texture
const CARD_SIZE = 1 / ROWS_COLS_TEXTURE;

export default {
  gl: null,
  viewMatrix: null,
  projectionMatrix: null,
  programs: [],
  CARDS_MAX,
  CARD_SIZE
}

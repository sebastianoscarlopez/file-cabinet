import { mat4 } from 'gl-matrix';

import { global } from '@/helpers/index';

import {
  points, card, basic
  // , getCardProgram, getPointsProgram, drawSquares, drawPoints
} from './programs/index';
import { DataStorage } from '@/data-storage';
import { setupPrograms } from '@/programs/setup';
import { POINTS_CAPTURE } from '../tests/mock-points-capture';

const NewPointEvent = new CustomEvent('point-added', {
  detail: {
    x: 0,
    y: 0
  }
});

console.log(mat4)
let modelA = mat4.fromXRotation(mat4.create(), 0.3);
modelA = mat4.translate(modelA, modelA, [-0.5, -0.25, -0.01])
const CARD_squares = [
  {
    modelMatrix: modelA
  },
  {
    modelMatrix: mat4.create()
  }
];

const startApp = async () => {
  const { gl, programs } = global;

  await setupPrograms(programs);

  basic.init();
  const CARDS_MAX = 4;

  const CARDS_mboModels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, CARDS_mboModels);
  gl.bufferData(gl.ARRAY_BUFFER, 40 * 16 * CARDS_MAX, gl.DYNAMIC_DRAW);

  CARDS_SETUP({
    gl,
    modelsBuffer: CARDS_mboModels
  });

  POINTS_SETUP({
    modelsBuffer: CARDS_mboModels
  });

  POINTS_CAPTURE();

  renderLoop(global.cardOneStorage);
}

function POINTS_SETUP({
  modelsBuffer
}) {
  global.cardOneStorage = new DataStorage();
  global.cardOneStorage.init();

  points.init({
    vertexBuffer: global.cardOneStorage.memoryBuffer,
    modelsBuffer
  });
}

function CARDS_SETUP({
  gl,
  modelsBuffer
}) {

  card.init({
    modelsBuffer
  });

  const data = new Float32Array(CARD_squares.flatMap((square) => [...square.modelMatrix]));
  gl.bindBuffer(gl.ARRAY_BUFFER, modelsBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
}

function renderLoop() {
  const { gl, cardOneStorage } = global;

  gl.clearColor(0.1, 0.2, 0.2, 1.0);

  gl.enable(gl.STENCIL_TEST);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  // stencil test
  gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  gl.stencilMask(0xFF);
  // gl.depthFunc(gl.LEQUAL)

  card.draw({
    totalCards: 2
  });
  basic.draw();

  gl.stencilFunc(gl.EQUAL, 1, 0xFF);
  gl.stencilMask(0x00);
  // gl.depthFunc(gl.LEQUAL)

  points.draw(cardOneStorage.memoryBufferOffset / 4 / 2);

  gl.stencilMask(0xFF);
  gl.stencilFunc(gl.ALWAYS, 1, 0xFF);

  requestAnimationFrame(renderLoop);
}
export default startApp;

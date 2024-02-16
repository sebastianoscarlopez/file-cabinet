import { mat4 } from 'gl-matrix';

import { global } from '@/helpers/index';

import {
  quad, points, cards, cardHover, cardsSelection, basic, cursor, text,
} from './programs/index';
import { DataStorage } from '@/data-storage';
import { setupPrograms } from '@/programs/setup';
import { POINTS_CAPTURE } from '../tests/mock-points-capture';
import { createCardsFrameBuffers } from './cards-base-framebuffers';
import { cardsHandlerInit, cardsDragAndDropHandler } from './cards-handlers';
import { mouseMoveHandler } from './mouse-handlers';
import { createSelectionFrameBuffer } from './selection-framebuffer';


let modelA = mat4.fromYRotation(mat4.create(), 0.5);
modelA = mat4.translate(modelA, modelA, [-0.5, -0.0, -1.5]);

const CARDS_squares = [
  {
    modelMatrix: modelA
  },
  {
    modelMatrix:mat4.translate(mat4.create(), mat4.create(), [0.5, 0.0, -1.5])
  },
];

const startApp = async () => {
  const { gl, canvas, programs, clientWidth, clientHeight } = global;

  await setupPrograms(programs);
  basic.init();
  
  createCardsFrameBuffers();
  createSelectionFrameBuffer();

  const CARDS_mboModels = gl.createBuffer();

  quad.init({
    modelsBuffer: CARDS_mboModels
  });

  CARDS_SETUP({
    modelsBuffer: CARDS_mboModels
  });

  POINTS_SETUP({
    modelsBuffer: CARDS_mboModels
  });

  const CURSOR_boCoords = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, CURSOR_boCoords);
  gl.bufferData(gl.ARRAY_BUFFER, 4 * 2, gl.DYNAMIC_DRAW);
  cursor.init({
    cursorBuffer: CURSOR_boCoords
  });

  canvas.addEventListener('mousemove', mouseMoveHandler.bind(null, CURSOR_boCoords));
  cardsHandlerInit(CARDS_mboModels, CARDS_squares);

  // RAY_boCoords = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, RAY_boCoords);
  // gl.bufferData(gl.ARRAY_BUFFER, 4 * 3 * 2, gl.DYNAMIC_DRAW);
  // ray.init({
  //   rayBuffer: RAY_boCoords,
  //   modelsBuffer: CARDS_mboModels
  // });
  // gl.bindBuffer(gl.ARRAY_BUFFER, RAY_boCoords);
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
  //   0.0, 0.0, 0.998, 
  //   0.0, 0.0002, 0.998999
  // ]));

  text.init();

  POINTS_CAPTURE();
  
  // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // gl.viewport(0, 0, clientWidth, clientHeight );


  renderLoop();
}

function POINTS_SETUP() {
  global.dataStorage = new DataStorage();
  global.dataStorage.init();

  points.init();
}

function CARDS_SETUP({
  modelsBuffer
}) {

  cards.init({
    modelsBuffer
  });

  cardsSelection.init({
    modelsBuffer
  });

  cardHover.init({
    modelsBuffer
  });
}

function renderLoop() {
  if(!global.initiated) {
    requestAnimationFrame(renderLoop);
    return;
  }
  const { gl, clientWidth, clientHeight, cursorData, selectionFrameBuffer } = global;
  

  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  // gl.lineWidth(50.0);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  // gl.depthFunc(gl.LESS);
  // gl.disable(gl.STENCIL_TEST);

  // ray.draw();
  // const totalPoints = dataStorage.memoryBufferOffset / 4 / 2;
  // console.log(totalPoints)
  // lines.draw(totalPoints);

  // gl.enable(gl.STENCIL_TEST);
  // gl.stencilMask(0xFF);

  // gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  // gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

  // gl.bindFramebuffer(gl.FRAMEBUFFER, cardsFrameBuffers);
  // gl.viewport(0, 0, cardsTextureSize, cardsTextureSize);

  for (let i = 0; i < CARDS_squares.length; i++) {
    points.draw(i);
  }
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, clientWidth, clientHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.depthFunc(gl.LESS);
  gl.disable(gl.BLEND);

  cardsSelection.draw({
    totalCards: CARDS_squares.length
  });

  let pixels = new Uint8Array(4);
  gl.readPixels(cursorData.x, cursorData.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  
  global.cursorData.pixels = pixels;
  cardsDragAndDropHandler();
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, clientWidth, clientHeight);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.depthFunc(gl.LESS);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // text.draw({
  //   // characters: '学',
  //   characters: 'i',
  // });

  gl.enable(gl.STENCIL_TEST);
  gl.stencilMask(0xFF);
  gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
  gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  cards.draw({
    totalCards: CARDS_squares.length
  });
  
  gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
  cardHover.draw({
    totalCards: CARDS_squares.length
  });

  gl.disable(gl.STENCIL_TEST);
  gl.depthFunc(gl.ALWAYS);
  cursor.draw();

  // gl.depthFunc(gl.ALWAYS)

  // gl.stencilFunc(gl.EQUAL, 1, 0xFF);


  // gl.disable(gl.STENCIL_TEST);
  // gl.depthFunc(gl.LESS)



  // const { programs } = global;
  // const programConfig = programs.find((program) => program.name === 'quad');

  // const u_texture0Location = gl.getUniformLocation(programConfig.glProgram, "u_texture0");
  // gl.uniform1i(u_texture0Location, 0);
  // // const u_texture1Location = gl.getUniformLocation(glProgramCards, "u_texture1");
  // // gl.uniform1i(u_texture1Location, 1);

  // gl.activeTexture(gl.TEXTURE0);
  // gl.bindTexture(gl.TEXTURE_2D, cardsTexture);
  // // gl.activeTexture(gl.TEXTURE1);
  // // gl.bindTexture(gl.TEXTURE_2D, QUAD_texture);

  // quad.draw();

  requestAnimationFrame(renderLoop);
}

export default startApp;

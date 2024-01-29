import { mat4, vec4 } from 'gl-matrix';

import { global, createGenericFrameBufferWithTexture } from '@/helpers/index';

import {
  quad, lines, card, basic, cursor, ray, grid,
  // , getCardProgram, getPointsProgram, drawSquares, drawPoints
} from './programs/index';
import { DataStorage } from '@/data-storage';
import { setupPrograms } from '@/programs/setup';
import { POINTS_CAPTURE } from '../tests/mock-points-capture';


let modelA = mat4.fromYRotation(mat4.create(), 0.0);
modelA = mat4.translate(modelA, modelA, [0.0, 0.0, 0.0]);

const CARD_squares = [
  {
    modelMatrix: modelA
  },
  {
    modelMatrix: mat4.create()
  },
];

let CARDS_mboModels, CURSOR_boCoords, RAY_boCoords, QUAD_texture;

const startApp = async () => {
  const { gl, programs, clientWidth, clientHeight } = global;

  await setupPrograms(programs);
  basic.init();
  
  // create card texture
  grid.init();
  const resolution = {
    width: 1000,
    height: 1000
  }
  // Buffer and texture for card texture
  const {
    frameBuffer: cardFrameBuffer, texture: cardTexture
  } = createGenericFrameBufferWithTexture(resolution.width, resolution.height);

  QUAD_texture = cardTexture;
  gl.bindFramebuffer(gl.FRAMEBUFFER, cardFrameBuffer);
  renderGrid(resolution);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, clientWidth, clientHeight ); 

  
  const CARDS_MAX = 4;

  CARDS_mboModels = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, CARDS_mboModels);
  gl.bufferData(gl.ARRAY_BUFFER, 40 * 16 * CARDS_MAX, gl.DYNAMIC_DRAW);

  const data = new Float32Array(CARD_squares.flatMap((square) => [...square.modelMatrix]));
  gl.bindBuffer(gl.ARRAY_BUFFER, CARDS_mboModels);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

  quad.init({
    modelsBuffer: CARDS_mboModels
  });

  // CARDS_SETUP({
  //   modelsBuffer: CARDS_mboModels
  // });


  // POINTS_SETUP({
  //   modelsBuffer: CARDS_mboModels
  // });

  // CURSOR_boCoords = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, CURSOR_boCoords);
  // gl.bufferData(gl.ARRAY_BUFFER, 4 * 2, gl.DYNAMIC_DRAW);
  // cursor.init({
  //   cursorBuffer: CURSOR_boCoords
  // });

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

  // document.addEventListener('mousemove', mouseHandler);

  // POINTS_CAPTURE();
  renderLoop(global.cardOneStorage);
}

function renderGrid(resolution) {
  // console.log('size', size)
  const { gl } = global;

  gl.viewport(0, 0, resolution.width , resolution.height ); 

  gl.clearColor(0.3, 0.2, 0.2, 1.0);

  gl.lineWidth(50.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.disable(gl.STENCIL_TEST);
  gl.depthFunc(gl.ALWAYS)

  grid.draw();
  
  // requestAnimationFrame(renderGrid.bind(this, resolution));
}

function POINTS_SETUP({
  modelsBuffer
}) {
  global.cardOneStorage = new DataStorage();
  global.cardOneStorage.init();

  lines.init({
    vertexBuffer: global.cardOneStorage.memoryBuffer,
    modelsBuffer
  });
}

function CARDS_SETUP({
  modelsBuffer
}) {

  card.init({
    modelsBuffer
  });
}


function renderLoop() {
  const { gl, cardOneStorage } = global;

  gl.clearColor(0.1, 0.2, 0.2, 1.0);

  gl.depthFunc(gl.ALWAYS)
  // gl.lineWidth(50.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  // gl.disable(gl.STENCIL_TEST);

  // ray.draw();
  // const totalPoints = cardOneStorage.memoryBufferOffset / 4 / 2;
  // console.log(totalPoints)
  // lines.draw(totalPoints);

  // gl.enable(gl.STENCIL_TEST);
  // gl.stencilMask(0xFF);

  // gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  // gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
  // card.draw({
  //   totalCards: 1
  // });
  
  // gl.depthFunc(gl.ALWAYS)

  // gl.stencilFunc(gl.EQUAL, 1, 0xFF);

  // lines.draw(cardOneStorage.memoryBufferOffset / 4 / 2);

  // gl.disable(gl.STENCIL_TEST);
  // gl.depthFunc(gl.LESS)

  // cursor.draw();


  const { programs } = global;
  const programConfig = programs.find((program) => program.name === 'quad');

  const u_texture0Location = gl.getUniformLocation(programConfig.glProgram, "u_texture0");
  gl.uniform1i(u_texture0Location, 0);
  // const u_texture1Location = gl.getUniformLocation(glProgramCard, "u_texture1");
  // gl.uniform1i(u_texture1Location, 1);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, QUAD_texture);
  // gl.activeTexture(gl.TEXTURE1);
  // gl.bindTexture(gl.TEXTURE_2D, QUAD_texture);

  quad.draw();

  requestAnimationFrame(renderLoop);
}

function mouseHandler(event) {
  const { gl, viewMatrix, projectionMatrix } = global;

  // console.log(mouseCoordsToClipCoords(event))

  const mouseCoords = mouseCoordsToClipCoords(event);

  gl.bindBuffer(gl.ARRAY_BUFFER, CURSOR_boCoords);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(mouseCoords));

  const viewMatrixInverted = mat4.invert(mat4.create(), viewMatrix);
  const projectionMatrixInverted = mat4.invert(mat4.create(), projectionMatrix);
 
  const toWorldMatrix = mat4.multiply(mat4.create(), projectionMatrixInverted, viewMatrixInverted);

  const mouseCoords4v =vec4.fromValues(...mouseCoords, 0, -0.0001);
  const mouseCoordsInWorldSpace = vec4.transformMat4(vec4.create(), mouseCoords4v, toWorldMatrix);

  // console.log(mouseCoordsInWorldSpace, mouseCoords)
  gl.bindBuffer(gl.ARRAY_BUFFER, RAY_boCoords);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([0, 0, -0.0001, 
    // 0, 1, 1
   mouseCoordsInWorldSpace[0], mouseCoordsInWorldSpace[1], mouseCoordsInWorldSpace[2]
  ]));

  // console.log(viewMatrixInverted)

  // const { gl } = global;
  // const {modelMatrix} = CARD_squares[0];
  // mat4.translate(modelMatrix, modelMatrix, [-0.5, 0, 0]);

  // gl.bindBuffer(gl.ARRAY_BUFFER, CARDS_mboModels);
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, modelMatrix);
}

function mouseCoordsToClipCoords(event) {
  const { gl } = global;
  const { canvas } = gl;
  const { clientWidth, clientHeight } = canvas;
  const { clientX, clientY } = event;
  const x = clientX / clientWidth * 2 - 1;
  const y = 1 - clientY / clientHeight * 2;
  return [x, y];
}

export default startApp;

import { glMatrix, mat4 } from 'gl-matrix';

import { global } from '@/helpers/index';
import { webXRInitialize } from './web-xr/initialize';

import {
  quad, points, cards, cardHover, cardsSelection, basic, cursor, text,
} from './programs/index';
import { setupPrograms } from '@/programs/setup';
import { POINTS_CAPTURE } from '../tests/mock-points-capture';
import { createCardsFrameBuffers } from './cards-base-framebuffers';
import { cardsHandlerInit, cardsDragAndDropHandler } from './cards-handlers';
import { mouseMoveHandler } from './mouse-handlers';
import { keydownHandler } from './keyboard-handlers';
import { createSelectionFrameBuffer } from './selection-framebuffer';
import { setupUniformSettings } from '@/programs/shared-settings';

const startApp = async () => {
  const { gl, canvas, programs, clientWidth, clientHeight } = global;

  setTimeout(async () => {
    const isWebXR = await webXRInitialize()

    global.requestAnimationFrame = isWebXR
      ? global.webXR.session.requestAnimationFrame.bind(global.webXR.session)
      : window.requestAnimationFrame.bind(window);
  }, 3000);

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
  window.addEventListener('keydown', keydownHandler);

  cardsHandlerInit(CARDS_mboModels);

  setTimeout(() => {
    canvas.dispatchEvent(new CustomEvent('card-new'));
  }, 500);
  setTimeout(() => {
    canvas.dispatchEvent(new CustomEvent('card-new'));
  }, 1000);
  setTimeout(() => {
    canvas.dispatchEvent(new CustomEvent('card-new'));
  }, 1500);

  text.init();

  POINTS_CAPTURE();

  global.requestAnimationFrame(renderLoop);
}

function POINTS_SETUP() {
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

function renderLoop(time, frame) {
  const { gl, programs, clientWidth, clientHeight, cursorData, selectionFrameBuffer, cardsData, requestAnimationFrame, webXR } = global;

  if (!global.initiated) {
    console.log('not initiated', time, frame);
    requestAnimationFrame(renderLoop);
    return;
  }

  for (let i = 0; i < cardsData.plotConfig.length; i++) {
    points.draw(i);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, selectionFrameBuffer);
  gl.viewport(0, 0, clientWidth, clientHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.depthFunc(gl.LESS);
  gl.disable(gl.BLEND);

  cardsSelection.draw();

  let pixels = new Uint8Array(4);
  gl.readPixels(cursorData.x, cursorData.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  global.cursorData.pixels = pixels;
  cardsDragAndDropHandler();


  if (webXR && frame) {
    const adjustedRefSpace = webXR.referenceSpace;//applyPositionOffsets(webXR.referenceSpace);
    const pose = frame.getViewerPose(adjustedRefSpace);

    if (pose) {
      const glLayer = frame.session.renderState.baseLayer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);

      gl.clearColor(0.0, 0.0, 0, 0.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // const deltaTime = (time - lastFrameTime) * 0.001;
      // lastFrameTime = time;

      for (const view of pose.views) {
        const viewport = glLayer.getViewport(view);
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

        const aspect = viewport.width / viewport.height;
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0]);
        // const projectionMatrix = mat4.perspective(mat4.create(), glMatrix.toRadian(90), aspect, 0.001, 100);
    
        global.viewMatrix = view.transform.inverse.matrix;
        global.projectionMatrix = view.projectionMatrix
        global.aspect = aspect;
        global.clientWidth = viewport.width;
        global.clientHeight = viewport.height;
    
        requestAnimationFrame(() => {
          setupUniformSettings(programs.find((program) => program.name === 'basic').glProgram, global.uboBuffer);
        });

        // myRenderScene(gl, view, sceneData, deltaTime);
        renderScene();
      }
    }
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, global.clientWidth, global.clientHeight);

    gl.clearColor(0.0, 0.0, 0, 0.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderScene();
  }

  requestAnimationFrame(renderLoop);
}

function renderScene() {
  // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // gl.viewport(0, 0, clientWidth, clientHeight);
  // gl.clearColor(0.0, 0.0, 0.0, 0.0);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  // gl.depthFunc(gl.LESS);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // gl.enable(gl.STENCIL_TEST);
  // gl.stencilMask(0xFF);
  // gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
  // gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
  cards.draw();

  // gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
  cardHover.draw();

  // gl.disable(gl.STENCIL_TEST);
  // gl.depthFunc(gl.ALWAYS);
  cursor.draw();

  drawCardData();
}

function drawCardData() {
  const { cardsData: { selectedCardIndex, hoverCardIndex, plotConfig, gl } } = global;
  const index = selectedCardIndex || hoverCardIndex;

  if (!index) {
    return;
  }

  const { offset, scale } = plotConfig[index - 1];
  text.draw({
    characters: `Card Index: ${index} | Offset: ${offset.x.toFixed(2)}, ${offset.y.toFixed(2)} | Scale: ${scale.x.toFixed(2)}, ${scale.y.toFixed(2)}`,
    // characters: 'AaEeIiOoUu',
    x: -0.95,
    y: -0.95
  });
}

export default startApp;

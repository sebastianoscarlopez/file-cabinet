import { global } from '@/helpers/index';
import {
  basic, points, cards, cardsSelection, cursor, ray, lines, quad, grid
} from './index';
import { setupUniformSettings } from '@/programs/shared-settings';
import { glMatrix, mat4 } from 'gl-matrix';

export async function setupPrograms(programs) {
  const [glProgramBasic, glProgramPoints, glProgramLines, glQuad, glProgramCards, glProgramCardsSelection, glProgramCursor, glProgramRay, glProgramGrid] = await Promise.all([
    basic.getProgram(),
    points.getProgram(),
    lines.getProgram(),
    quad.getProgram(),
    cards.getProgram(),
    cardsSelection.getProgram(),
    cursor.getProgram(),
    ray.getProgram(),
    grid.getProgram()
  ]);
  programs.push({
    name: 'basic',
    glProgram: glProgramBasic
  });
  programs.push({
    name: 'cards',
    glProgram: glProgramCards
  });
  programs.push({
    name: 'cardsSelection',
    glProgram: glProgramCardsSelection
  });
  programs.push({
    name: 'points',
    glProgram: glProgramPoints
  });
  programs.push({
    name: 'lines',
    glProgram: glProgramLines
  });
  programs.push({
    name: 'cursor',
    glProgram: glProgramCursor
  });
  programs.push({
    name: 'ray',
    glProgram: glProgramRay
  });
  programs.push({
    name: 'grid',
    glProgram: glProgramGrid
  });


  const { gl, canvas } = global;
  const configQuad = {
    name: 'quad',
    glProgram: glQuad,
    uniforms: {
      uTexture: gl.getUniformLocation(glQuad, 'u_texture')
    }
  }
  programs.push(configQuad);

  const uboBuffer = gl.createBuffer();

  const resizeObserver = new ResizeObserver((entries) => {
    global.initiated = false;
    const canvas = entries[0].target;
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    const aspect = clientWidth / clientHeight;
    // const viewMatrix = mat4.create();
    // mat4.lookAt(viewMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0]);
    const projectionMatrix = mat4.perspective(mat4.create(), glMatrix.toRadian(90), aspect, 0.001, 100);

    // global.viewMatrix = viewMatrix;
    global.projectionMatrix = projectionMatrix;
    global.aspect = aspect;
    global.clientWidth = clientWidth;
    global.clientHeight = clientHeight;

    requestAnimationFrame(() => {
      setupUniformSettings(glProgramBasic, uboBuffer);
    });
  });

  resizeObserver.observe(canvas);
}

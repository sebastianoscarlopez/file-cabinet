import { global } from '@/helpers/index';
import {
  basic, points, card, cursor, ray, lines, quad
} from './index';
import { setupUniformSettings } from '@/programs/shared-settings';

export async function setupPrograms(programs) {
  const [glProgramBasic, glProgramPoints, glProgramLines, glQuad, glProgramCard, glProgramCursor, glProgramRay] = await Promise.all([
    basic.getProgram(),
    points.getProgram(),
    lines.getProgram(),
    quad.getProgram(),
    card.getProgram(),
    cursor.getProgram(),
    ray.getProgram()
  ]);
  programs.push({
    name: 'basic',
    glProgram: glProgramBasic
  });
  programs.push({
    name: 'card',
    glProgram: glProgramCard
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


  const { gl } = global;
  const configQuad = {
    name: 'quad',
    glProgram: glQuad,
    uniforms: {
      uTexture: gl.getUniformLocation(glQuad, 'u_texture')
    }
  }
  programs.push(configQuad);
  // glProgram.uniforms = {
  //   uTexture: gl.getUniformLocation(glProgram, 'u_texture')
  // };

  setupUniformSettings(glProgramBasic);
}

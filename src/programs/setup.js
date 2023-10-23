import {
  basic, points, card, cursor, ray
} from './index';
import { setupUniformSettings } from '@/programs/shared-settings';

export async function setupPrograms(programs) {
  const [glProgram, glProgramPoints, glProgramCard, glProgramCursor, glProgramRay] = await Promise.all([
    basic.getProgram(),
    points.getProgram(),
    card.getProgram(),
    cursor.getProgram(),
    ray.getProgram()
  ]);
  programs.push({
    name: 'basic',
    program: glProgram
  });
  programs.push({
    name: 'card',
    program: glProgramCard
  });
  programs.push({
    name: 'points',
    program: glProgramPoints
  });
  programs.push({
    name: 'cursor',
    program: glProgramCursor
  });
  programs.push({
    name: 'ray',
    program: glProgramRay
  });

  setupUniformSettings(glProgram);
}

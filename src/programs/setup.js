import {
  basic, points, card
} from './index';
import { setupUniformSettings } from '@/programs/shared-settings';

export async function setupPrograms(programs) {
  const [glProgram, glProgramPoints, glProgramCard] = await Promise.all([
    basic.getProgram(),
    points.getProgram(),
    card.getProgram()
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

  setupUniformSettings(glProgram);
}

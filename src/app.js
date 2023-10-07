import { global } from './helpers/index';

import { getBasicProgram, drawBasic, getCardProgram, drawSquares } from './programs/index';
import { setupUniformSettings } from './programs/shared-settings';

const startApp = async () => {
  const { programs } = global;

  const [glProgramBasic, glProgramCard] = await Promise.all([getBasicProgram(), getCardProgram()]);
  programs.push({
    name: 'basic',
    program: glProgramBasic
  });
  programs.push({
    name: 'card',
    program: glProgramCard
  });

  setupUniformSettings(glProgramBasic);
  drawBasic();

  drawSquares();


}

export default startApp;

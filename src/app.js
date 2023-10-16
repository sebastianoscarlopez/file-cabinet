import { global } from './helpers/index';

import { basic, points, card
  // , getCardProgram, getPointsProgram, drawSquares, drawPoints
} from './programs/index';
import { setupUniformSettings } from '@/programs/shared-settings';
import { DataStorage } from '@/data-storage';

const startApp = async () => {
  const { gl, programs } = global;

  const [glProgramBasic, glProgramPoints, glProgramCard] = await Promise.all([
    basic.getProgram(),
    points.getProgram(),
    card.getProgram()
  ]);
  programs.push({
    name: 'basic',
    program: glProgramBasic
  });
  programs.push({
    name: 'card',
    program: glProgramCard
  });
  programs.push({
    name: 'points',
    program: glProgramPoints
  });

  setupUniformSettings(glProgramBasic);

  basic.init();
  
  global.cardOneStorage = new DataStorage();
  global.cardOneStorage.init();

  const pointsData = sinData({
    totalPoints: 40
  });

  let idx = 0;
  const refInterval = setInterval(() => {
    global.cardOneStorage.addData(new Float32Array(pointsData.slice(idx, idx + 2)));
    idx += 2;
    if(idx >= points.length) {
      clearInterval(refInterval);
    }
  }, 100);


  points.init({
    buffer: global.cardOneStorage.memoryBuffer,
  });

  card.init();
  
  renderLoop(global.cardOneStorage);
}

function renderLoop() {
  const { gl, cardOneStorage } = global;

  gl.clearColor(0.1, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  basic.draw();

  points.draw(cardOneStorage.memoryBufferOffset / 4 / 2);

  card.draw();
  requestAnimationFrame(renderLoop);
}
export default startApp;

// returns an array of points for a sine wave, using this parametric equation:
function sinData({
  amplitude = 1,
  frequency = 1,
  phase = 0,
  verticalShift = 0,
  totalPoints = 4,
  xStart = 0,
  xEnd = 1,
} = {}) {
  const points = [];
  const delta = (xEnd - xStart) / totalPoints;
  for (let i = 0; i < totalPoints; i++) {
    const x = i * delta;
    const y = amplitude * Math.sin(frequency * x * 2 * Math.PI + phase) + verticalShift;
    points.push(x, y);
  }

  return points;
}

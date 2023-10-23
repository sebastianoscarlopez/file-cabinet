import { global } from '@/helpers/index';
import { sinData } from './sin-data';

const POINTS_DATA_SETTINGS = {
  scale: {
    x: 1,
    y: 1
  },
  offset: {
    x: -0.5,
    y: 0.0
  }
}

function POINT_DATA_ADJUST(points) {
  const { scale, offset } = POINTS_DATA_SETTINGS;
  return points.map(point => ([
    point[0] * scale.x + offset.x,
    point[1] * scale.y + offset.y
  ]));
}

export function POINTS_CAPTURE() {
  const MOCK_totalPoints = 500;
  const MOCK_pointsData = sinData({
    totalPoints: MOCK_totalPoints,
    amplitude: 0.25,
    frequency: 10,
    phase: 0,
  });

  const pointsData = [];

  document.addEventListener('point-added', (e) => {
    global.cardOneStorage.addData(new Float32Array(e.detail));
  });

  document.addEventListener('point-adjust', (e) => {
    global.cardOneStorage.replaceData(new Float32Array(POINT_DATA_ADJUST(pointsData).flat()));
  });

  let idx = 0;
  const refInterval = setInterval(() => {
    const newPoint = MOCK_pointsData.slice(idx, idx + 2);
    pointsData.push(newPoint);
    const adjustedPoint = POINT_DATA_ADJUST([newPoint])[0];
    document.dispatchEvent(new CustomEvent('point-added', { detail: adjustedPoint }));
    idx += 2;
    if (idx >= MOCK_totalPoints * 2) {
      clearInterval(refInterval);
    }
  }, 5);

  setInterval(() => {
    // POINTS_DATA_SETTINGS.offset.x -= 0.03;
    document.dispatchEvent(new CustomEvent('point-adjust'));
  }, 200);
}

import { global } from '@/helpers';
import { sinData } from './sin-data';
import { pyodide } from '@/helpers';

function POINT_DATA_ADJUST(index, points) {
  const { scale, offset } = global.cardsData.plotConfig[index] || {scale: {
    x: 1,
    y: 1
  },
  offset: {
    x: -1.0,
    y: 0.0
  }};
  const pointsAdjusted = new Float32Array(points.length);
  for(let i = 0; i < points.length - 1; i += 2) {
    pointsAdjusted[i] = points[i] * scale.x + offset.x,
    pointsAdjusted[i + 1] = points[i + 1] * scale.y + offset.y
  }
  return pointsAdjusted;
}

export function POINTS_CAPTURE() {
  const MOCK_totalPoints = 250;
  const MOCK_pointsData = sinData({
    totalPoints: MOCK_totalPoints,
    amplitude: 1.0,
    frequency: 2,
    phase: 0,
    xStart: 0,
    xEnd: 2
  });

  global.dataStorage.addMemory(`points_original_0`);
  global.dataStorage.addMemory(`points_original_1`);
  global.dataStorage.addMemory(`points_0`);
  global.dataStorage.addMemory(`points_1`);

  document.addEventListener('point-added', (e) => {
    const { index, point } = e.detail;
    global.dataStorage.addData(`points_original_${index}`, new Float32Array(point));
    document.dispatchEvent(new CustomEvent('point-adjust', { detail: { index } }));
  });

  document.addEventListener('point-adjust', (e) => {
    if(!e.detail) return;
    const index = e.detail.index;
    let auxPoints = global.dataStorage.getData(`points_original_${index}`);
    global.dataStorage.replaceData(`points_${index}`, new Float32Array(POINT_DATA_ADJUST(index, auxPoints)));
  });

  let idx = 0;
  const refInterval = setInterval(() => {
    const point = MOCK_pointsData.slice(idx, idx + 2);
    document.dispatchEvent(new CustomEvent('point-added', { detail: { index: 0, point } }));

    const pointWithNoise = [point[0] + (Math.random() - 0.5) * 0.01, point[1] + (Math.random() - 0.5) * 0.2];
    document.dispatchEvent(new CustomEvent('point-added', { detail: { index: 1, point: pointWithNoise } }));

    idx += 2;
    if (idx >= MOCK_totalPoints * 2) {
      clearInterval(refInterval);
    }
  }, 10);

  setTimeout(() => {
    document.dispatchEvent(new CustomEvent('point-adjust', { detail: { index: 0 } }));
    document.dispatchEvent(new CustomEvent('point-adjust', { detail: { index: 1 } }));
  }, 1000);

  
  setTimeout(() => {
    global.dataStorage.addMemory(`points_original_2`);
    global.dataStorage.addMemory(`points_2`);
    
    const points = Array.from(pyodide.runPython(`
      import math

      # Generate array from 0 to 360 with step 5
      angles = [math.radians(a) for a in list(range(0, 361, 5))]
      
      # Calculate sin values for angles
      sin_values = [math.sin(angle) for angle in angles]
      
      # Zip angles with sin values
      points = zip(angles, sin_values)
      
      # Flatten a list of tuples
      result_flat = [item for sublist in points for item in sublist]

      result_flat
    `))
  
    for(let idx = 0; idx < points.length - 2; idx += 2) {
      const pointWithNoise = [points[idx] + (Math.random() - 0.5) * 0.01, points[idx + 1] + (Math.random() - 0.5) * 0.2];
      document.dispatchEvent(new CustomEvent('point-added', { detail: { index: 2, point: pointWithNoise } }));
    };
  }, 3000);

}

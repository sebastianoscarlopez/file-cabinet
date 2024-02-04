// returns an array of points for a sine wave, using this parametric equation:
export function sinData({
  amplitude = 1, frequency = 1, phase = 0, verticalShift = 0, totalPoints = 4, xStart = 0, xEnd = 1,
} = {}) {
  const points = [];
  const delta = (xEnd - xStart) / totalPoints;
  for (let i = 0; i < totalPoints; i++) {
    const x = i * delta;
    const y = amplitude / 2 * Math.sin(frequency * x * 2 * Math.PI + phase) + verticalShift;
    points.push(x, y);
  }

  return points;
}

/*

function sinData({
  amplitude = 1, frequency = 1, phase = 0, verticalShift = 0, totalPoints = 4, xStart = 0, xEnd = 1,
} = {}) {
  const points = [];
  const delta = (xEnd - xStart) / totalPoints;
  for (let i = 0; i < totalPoints; i++) {
    const x = i * delta;
    const y = amplitude / 2 * Math.sin(frequency * x * 2 * Math.PI + phase) + verticalShift;
    points.push({x, y});
  }

  return points;
}

a = sinData({totalPoints: 100, amplitude: 1, frequency: 10, phase: 0, xStart: 0, xEnd: 1})

a.reduce((r, v) => {
    return {
            xMax: v.x > r.xMax ? v.x : r.xMax,
            xMin: v.x < r.xMin ? v.x : r.xMin,
            yMax: v.y > r.yMax ? v.y : r.yMax,
            yMin: v.y < r.yMin ? v.y : r.yMin
       }
}, {xMax: a[0].x, xMin: a[0].x, yMax: a[0].y, yMin: a[0].y})

*/
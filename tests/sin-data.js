// returns an array of points for a sine wave, using this parametric equation:
export function sinData({
  amplitude = 1, frequency = 1, phase = 0, verticalShift = 0, totalPoints = 4, xStart = 0, xEnd = 1,
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

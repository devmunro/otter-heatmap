export function getColorForCount(
  count: number,
  baseColor: string,
  maxCount: number
) {
  if (count <= 0) return "#ebedf0";

  const intensity = Math.min(0.35 + 0.9 * (count / maxCount), 1);

  return shadeColor(baseColor, intensity);
}

function shadeColor(color: string, intensity: number) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  const mix = (channel: number) =>
    Math.round(255 - (255 - channel) * intensity);

  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

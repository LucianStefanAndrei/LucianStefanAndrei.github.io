// A real half-twisted Möbius surface, projected into a depth-buffered text grid.
// Shared with the static build so a still frame is present even without JS.
import { mountAscii } from './ascii-player.mjs';
export const columns = 78;
export const rows = 40;
const ramp = '.,-~:;=!*#$@';
const points = [];
for (let i = 0; i < 300; i++) {
  const u = i / 300 * Math.PI * 2;
  const c = Math.cos(u), s = Math.sin(u);
  const ch = Math.cos(u / 2), sh = Math.sin(u / 2);
  for (let j = 0; j <= 52; j++) {
    const v = (j / 52 * 2 - 1) * 0.52;
    const radius = 1.12 + v * ch;
    const du = [-radius * s - v * sh * c / 2, radius * c - v * sh * s / 2, v * ch / 2];
    const dv = [ch * c, ch * s, sh];
    const normal = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]];
    const length = Math.hypot(...normal);
    points.push([radius * c, radius * s, v * sh, ...normal.map(n => n / length)]);
  }
}

export function renderMobius(seconds = 0) {
  const chars = Array(columns * rows).fill(' ');
  const depth = new Float32Array(columns * rows).fill(Infinity);
  const a = 0.85 + seconds * 0.23, b = 0.25 + seconds * 0.31, c = -0.28 + seconds * 0.12;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  const rotate = (x, y, z) => {
    const yy = y * ca - z * sa, zz = y * sa + z * ca;
    const xx = x * cb + zz * sb, zzz = -x * sb + zz * cb;
    return [xx * cc - yy * sc, xx * sc + yy * cc, zzz];
  };
  for (const point of points) {
    const [x, y, z] = rotate(point[0], point[1], point[2]);
    const perspective = 4.8 / (4.8 + z);
    const col = Math.round(columns / 2 + x * perspective * 19);
    // Courier glyphs are 0.6em wide; the rows are 1.05em tall.
    const row = Math.round(rows / 2 - y * perspective * 19 * (0.6 / 1.05));
    if (col < 0 || col >= columns || row < 0 || row >= rows) continue;
    const index = row * columns + col;
    if (z >= depth[index]) continue;
    depth[index] = z;
    const [nx, ny, nz] = rotate(point[3], point[4], point[5]);
    // Two-sided lighting: a Möbius band has no global front or back surface.
    const light = 0.15 + 0.85 * Math.abs(nx * -0.35 + ny * 0.45 + nz * -0.82);
    chars[index] = ramp[Math.min(ramp.length - 1, Math.floor(light * (ramp.length - 1)))];
  }
  return Array.from({ length: rows }, (_, row) => chars.slice(row * columns, (row + 1) * columns).join('')).join('\n');
}

if (typeof document !== 'undefined') mountAscii(document.querySelector('.mobius-ascii'), renderMobius, columns, rows);

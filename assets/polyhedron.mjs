import { mountAscii } from './ascii-player.mjs';

const columns = 78, rows = 40;
const phi = (1 + Math.sqrt(5)) / 2;
const vertices = [];
for (const a of [-1, 1]) for (const b of [-phi, phi]) {
  vertices.push([0, a, b], [a, b, 0], [b, 0, a]);
}
const edges = [], faces = [];
const adjacent = (a, b) => Math.abs(Math.hypot(...vertices[a].map((n, i) => n - vertices[b][i])) - 2) < 0.001;
for (let a = 0; a < vertices.length; a++) for (let b = a + 1; b < vertices.length; b++) {
  if (!adjacent(a, b)) continue;
  edges.push([a, b]);
  for (let c = b + 1; c < vertices.length; c++) if (adjacent(a, c) && adjacent(b, c)) faces.push([a, b, c]);
}

export function renderPolyhedron(seconds = 0) {
  const chars = Array(columns * rows).fill(' ');
  const depth = new Float32Array(columns * rows).fill(Infinity);
  const a = 0.35 + seconds * 0.28, b = 0.45 + seconds * 0.37;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const rotated = vertices.map(([x, y, z]) => {
    const yy = y * ca - z * sa, zz = y * sa + z * ca;
    return [(x * cb + zz * sb) * 0.8, yy * 0.8, (-x * sb + zz * cb) * 0.8];
  });
  const plot = (point, glyph, bias = 0) => {
    const [x, y, z] = point;
    const perspective = 5 / (5 + z);
    const col = Math.round(columns / 2 + x * perspective * 20);
    const row = Math.round(rows / 2 - y * perspective * 20 * (0.6 / 1.05));
    if (col < 0 || col >= columns || row < 0 || row >= rows) return;
    const index = row * columns + col;
    if (z + bias <= depth[index]) { depth[index] = z + bias; chars[index] = glyph; }
  };
  // Sparse faces retain an engineering wireframe feel without hiding rear edges.
  for (const [ia, ib, ic] of faces) {
    const [p, q, r] = [rotated[ia], rotated[ib], rotated[ic]];
    for (let i = 0; i <= 24; i++) for (let j = 0; j <= 24 - i; j++) {
      const point = p.map((n, k) => n + (q[k] - n) * i / 24 + (r[k] - n) * j / 24);
      plot(point, point[2] < -0.3 ? ':' : '.');
    }
  }
  for (const [ia, ib] of edges) {
    for (let i = 0; i <= 120; i++) {
      const point = rotated[ia].map((n, k) => n + (rotated[ib][k] - n) * i / 120);
      plot(point, point[2] < 0 ? '#' : '+', -0.08);
    }
  }
  for (const point of rotated) plot(point, '@', -0.1);
  return Array.from({ length: rows }, (_, row) => chars.slice(row * columns, (row + 1) * columns).join('')).join('\n');
}

if (typeof document !== 'undefined') mountAscii(document.querySelector('.polyhedron-ascii'), renderPolyhedron, columns, rows);

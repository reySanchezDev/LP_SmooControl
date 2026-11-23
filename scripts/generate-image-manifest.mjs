import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageDirectory = path.join(root, 'public', 'img');
const output = path.join(root, 'public', 'img-manifest.json');
const supported = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);
const ignored = new Set(['fideos-patron.webp', 'fideos-verduras.webp', 'hand-left.webp', 'hand-right.webp', 'logo.webp']);

const files = (await readdir(imageDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()) && !ignored.has(entry.name.toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' }));

const images = files.map((name) => ({
  name,
  src: `/img/${encodeURIComponent(name)}`,
  label: path.basename(name, path.extname(name)).replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
}));

await writeFile(output, `${JSON.stringify(images, null, 2)}\n`, 'utf8');
console.log(`Image manifest generated: ${images.length} images`);

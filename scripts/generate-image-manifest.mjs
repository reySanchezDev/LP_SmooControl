import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageDirectory = path.join(root, 'public', 'img');
const output = path.join(root, 'public', 'img-manifest.json');
const productNamesPath = path.join(root, 'public', 'img-labels.json');
const supported = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);
const ignored = new Set(['fideos-patron.webp', 'fideos-verduras.webp', 'hand-left.webp', 'hand-right.webp', 'logo.webp']);

let productNames = {};
try {
  productNames = JSON.parse(await readFile(productNamesPath, 'utf8'));
  if (!productNames || Array.isArray(productNames) || typeof productNames !== 'object') {
    throw new Error('img-labels.json must contain an object mapping filenames to product names');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

function productName(name) {
  const customName = productNames[name];
  if (typeof customName === 'string' && customName.trim()) return customName.trim();
  const words = path.basename(name, path.extname(name)).replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toLocaleUpperCase('es-NI') + words.slice(1);
}

const files = (await readdir(imageDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()) && !ignored.has(entry.name.toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' }));

const images = files.map((name) => ({
  name,
  src: `/img/${encodeURIComponent(name)}`,
  label: path.basename(name, path.extname(name)).replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
  productLabel: productName(name),
}));

await writeFile(output, `${JSON.stringify(images, null, 2)}\n`, 'utf8');
console.log(`Image manifest generated: ${images.length} images`);

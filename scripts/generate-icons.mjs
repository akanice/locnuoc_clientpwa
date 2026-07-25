import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
const sourcePath = path.join(iconsDir, 'app-icon.png');

if (!fs.existsSync(sourcePath)) {
  console.error('Missing official icon source: public/icons/app-icon.png');
  process.exit(1);
}

fs.mkdirSync(iconsDir, { recursive: true });

const source = sharp(sourcePath).ensureAlpha();

await Promise.all([
  source.clone().resize(192, 192, { fit: 'cover' }).png().toFile(path.join(iconsDir, 'icon-192.png')),
  source.clone().resize(512, 512, { fit: 'cover' }).png().toFile(path.join(iconsDir, 'icon-512.png')),
  source.clone().resize(32, 32, { fit: 'cover' }).png().toFile(path.join(publicDir, 'favicon.png')),
]);

console.log('PWA icons generated from public/icons/app-icon.png');

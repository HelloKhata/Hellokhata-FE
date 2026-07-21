import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const copies = [
  ['.next/static', '.next/standalone/.next/static'],
  ['public', '.next/standalone/public'],
];

for (const [source, destination] of copies) {
  const sourcePath = resolve(source);
  const destinationPath = resolve(destination);

  if (!existsSync(sourcePath)) {
    throw new Error(`Required standalone asset directory is missing: ${source}`);
  }

  mkdirSync(dirname(destinationPath), { recursive: true });
  cpSync(sourcePath, destinationPath, { recursive: true, force: true });
}
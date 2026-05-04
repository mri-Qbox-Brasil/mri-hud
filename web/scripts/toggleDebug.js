#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const arg = process.argv[2];
if (!arg || (arg !== 'true' && arg !== 'false')) {
  console.error('Usage: node ./scripts/toggleDebug.js <true|false>');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), 'src', 'stores', 'debugStore.ts');

(async () => {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    const re = /(const\s+debugMode:\s*boolean\s*=\s*)(true|false)(;)/;
    if (!re.test(content)) {
      console.error('Failed to find debugMode declaration in', filePath);
      process.exit(1);
    }
    const newContent = content.replace(re, `$1${arg}$3`);
    await fs.writeFile(filePath, newContent, 'utf8');
    console.log(`Wrote debugMode = ${arg} in ${filePath}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

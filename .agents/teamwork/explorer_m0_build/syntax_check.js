const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function checkDir(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        count += checkDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs'))) {
      try {
        execFileSync(process.execPath, ['--check', fullPath], { stdio: 'pipe' });
        count++;
      } catch (err) {
        console.error(`Syntax error in ${fullPath}:`, err.message);
        process.exit(1);
      }
    }
  }
  return count;
}

const targetDir = process.argv[2] || '.';
const checkedCount = checkDir(targetDir);
console.log(`Successfully checked syntax of ${checkedCount} JS/MJS files in ${targetDir}`);

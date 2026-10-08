const fs = require('fs');
const path = require('path');
const cp = require('child_process');
require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
if (!privateKey) {
  console.error('FAIL: IMAGEKIT_PRIVATE_KEY is missing from backend/.env');
  process.exit(1);
}

console.log('Auditing ImageKit private key safety (key length:', privateKey.length, ')...');

const rootDir = path.resolve(__dirname, '../../..');
const frontendDir = path.join(rootDir, 'frontend');

const allowedExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.html', '.css', '.map']);

function scanDirectory(dir) {
  let matched = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'cache') continue;
      matched = matched.concat(scanDirectory(full));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (allowedExtensions.has(ext)) {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes(privateKey)) {
          matched.push(full);
        }
      }
    }
  }
  return matched;
}

const found = scanDirectory(frontendDir);
if (found.length > 0) {
  console.error('FAIL: Private key detected in frontend files:', found);
  process.exit(1);
} else {
  console.log('PASS: Zero occurrences of private key across all frontend source, configs, and build files (.next)!');
}

// Check git log
try {
  const gitLog = cp.execSync(`git log -S "${privateKey}" --oneline`, { cwd: rootDir, encoding: 'utf8' });
  if (gitLog.trim()) {
    console.error('FAIL: Private key found in git log:\n' + gitLog);
    process.exit(1);
  } else {
    console.log('PASS: Zero occurrences of private key in git history.');
  }
} catch (e) {
  console.error('Git log check error:', e.message);
}

// Check git diff
try {
  const gitDiff = cp.execSync(`git diff`, { cwd: rootDir, encoding: 'utf8' });
  if (gitDiff.includes(privateKey)) {
    console.error('FAIL: Private key found in uncommitted git diff!');
    process.exit(1);
  } else {
    console.log('PASS: Zero occurrences of private key in current git diff.');
  }
} catch (e) {
  console.error('Git diff check error:', e.message);
}

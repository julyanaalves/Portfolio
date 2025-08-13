const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const src = path.resolve(root, '..', 'backend', 'profile.json');
const dist = path.resolve(root, 'dist', 'profile.json');

try {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dist), { recursive: true });
    fs.copyFileSync(src, dist);
    console.log('Copied backend/profile.json to dist/profile.json');
  } else {
    console.warn('backend/profile.json not found; skipping copy');
  }
} catch (err) {
  console.error('Failed to copy profile.json:', err);
  process.exit(1);
}

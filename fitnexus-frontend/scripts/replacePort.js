const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const oldUrl = 'http://localhost:8082/api';
const newUrl = '${API_URL}';

function replaceInFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(oldUrl)) {
    const updated = content.split(oldUrl).join(newUrl);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else {
      replaceInFile(fullPath);
    }
  }
}

walk(srcDir);
console.log('URL replacement completed.');

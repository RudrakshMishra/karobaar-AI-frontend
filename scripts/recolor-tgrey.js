const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components'),
  path.join(__dirname, '../tailwind.config.ts')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace hardcoded purple hex with light grey
  content = content.replace(/#7c5af7/g, '#D1D1D1');
  
  // Also look for Oxford Blue that we added recently and replace it if requested
  // The user explicitly wanted purple replaced, so mostly targeting #7c5af7.
  content = content.replace(/#112953/g, '#D1D1D1'); 

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed Purple from: ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (dir.endsWith('.tsx') || dir.endsWith('.css') || dir.endsWith('.ts')) {
      processFile(dir);
    }
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      traverseDir(path.join(dir, file));
    }
  }
}

targetDirs.forEach(traverseDir);
console.log('Purple eradicaton to Light Grey complete!');

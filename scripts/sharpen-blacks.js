const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Shift primary grey (#666666) -> Stark Black (#050505)
  content = content.replace(/#666666/g, '#050505');
  
  // 2. Shift faded text grey -> Faded Text Black
  content = content.replace(/rgba\(100,100,100,/g, 'rgba(0,0,0,');

  // 3. Shift the light UI greys to starker darks if they are font values
  content = content.replace(/text-\[\#D1D1D1\]/g, 'text-[#050505]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Deepened Greys to Black in: ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (dir.endsWith('.tsx') || dir.endsWith('.css')) {
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
console.log('Successfully completed monochromatic contrast push!');

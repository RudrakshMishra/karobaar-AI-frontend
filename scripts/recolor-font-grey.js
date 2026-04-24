const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components'),
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Change font colors from Black to Light Grey
  content = content.replace(/text-\[\#1A1A1A\]/g, 'text-[#666666]');
  
  // Update opacities for better contrast
  content = content.replace(/rgba\(0,0,0,0\.7\)/g, 'rgba(100,100,100,0.8)');
  content = content.replace(/rgba\(0,0,0,0\.6\)/g, 'rgba(100,100,100,0.7)');
  content = content.replace(/rgba\(0,0,0,0\.5\)/g, 'rgba(100,100,100,0.6)');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated Font Color: ${filePath}`);
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
console.log('Font color shifted to Light Grey!');

const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace text accent strictly
  content = content.replace(/text-\[\#D4A373\]/g, 'text-white');
  
  // For icons and specific borders that should be grey
  content = content.replace(/border-\[\#D4A373\](?!\/)/g, 'border-[rgba(255,255,255,0.4)]');
  content = content.replace(/bg-\[\#D4A373\](?!\/)/g, 'bg-white'); // for tags/buttons
  
  // Selection
  content = content.replace(/selection:bg-\[\#C6FF00\]/g, 'selection:bg-white selection:text-black');
  
  // Grey-out opaque accents
  content = content.replace(/bg-\[\#D4A373\]\/10/g, 'bg-[rgba(255,255,255,0.05)]');
  content = content.replace(/border-\[\#D4A373\]\/20/g, 'border-[rgba(255,255,255,0.1)]');
  content = content.replace(/border-\[\#D4A373\]\/50/g, 'border-[rgba(255,255,255,0.3)]');

  // Any remaining generic reference to the color
  content = content.replace(/#D4A373/g, '#FFFFFF');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
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
console.log('Recoloring to White/Grey complete!');

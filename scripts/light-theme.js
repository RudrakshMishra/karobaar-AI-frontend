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

  // BACKGROUNDS
  content = content.replace(/bg-\[\#120C08\]/g, 'bg-[#FAF9F6]'); // Deep Espresso -> Cream Base
  content = content.replace(/bg-\[\#1C130E\]/g, 'bg-[#F2F0EA]'); // Secondary Base -> Off-White
  content = content.replace(/bg-\[\#201610\]/g, 'bg-[#F2F0EA]'); // Another Secondary -> Off-White
  content = content.replace(/bg-\[\#261A13\]/g, 'bg-[#FFFFFF]'); // Cards -> Pure White
  content = content.replace(/bg-\[\#33231A\]/g, 'bg-[#E8E6DF]'); // Inside cards -> Light Grey

  // HIGH CONTRAST INVERSIONS (Buttons/Badges)
  // Our previous script mapped accents to white. Buttons became bg-white. We want Black buttons on a cream background.
  content = content.replace(/bg-white/g, 'bg-[#1A1A1A]');
  content = content.replace(/text-\[\#120C08\]/g, 'text-white'); // Text inside the old white buttons

  // TEXT COLORS
  content = content.replace(/text-white/g, 'text-[#1A1A1A]');
  
  // OPACITIES (White to Black)
  content = content.replace(/rgba\(255,255,255,0\.7\)/g, 'rgba(0,0,0,0.7)');
  content = content.replace(/rgba\(255,255,255,0\.6\)/g, 'rgba(0,0,0,0.6)');
  content = content.replace(/rgba\(255,255,255,0\.5\)/g, 'rgba(0,0,0,0.5)');
  content = content.replace(/rgba\(255,255,255,0\.45\)/g, 'rgba(0,0,0,0.5)'); // normalize
  content = content.replace(/rgba\(255,255,255,0\.4\)/g, 'rgba(0,0,0,0.4)');
  content = content.replace(/rgba\(255,255,255,0\.3\)/g, 'rgba(0,0,0,0.3)');
  content = content.replace(/rgba\(255,255,255,0\.2\)/g, 'rgba(0,0,0,0.2)');
  content = content.replace(/rgba\(255,255,255,0\.1\)/g, 'rgba(0,0,0,0.1)');
  content = content.replace(/rgba\(255,255,255,0\.08\)/g, 'rgba(0,0,0,0.08)');
  content = content.replace(/rgba\(255,255,255,0\.05\)/g, 'rgba(0,0,0,0.05)');
  content = content.replace(/rgba\(255,\s?255,\s?255,/g, 'rgba(0,0,0,'); // catch any others
  
  content = content.replace(/white\/([0-9]+)/g, 'black/$1'); // white/10 -> black/10

  // BORDERS
  content = content.replace(/border-\[\#3A281E\]/g, 'border-[#E0DDD5]');
  content = content.replace(/border-\[\#3A2820\]/g, 'border-[#E0DDD5]');
  content = content.replace(/border-\[\#4A3427\]/g, 'border-[#D6D3CB]');
  content = content.replace(/border-\[\#422D22\]/g, 'border-[#D6D3CB]');
  content = content.replace(/border-\[\#5A4131\]/g, 'border-[#C4C1B8]');
  
  // Specific border inversions
  content = content.replace(/border-[#FFFFFF]/g, 'border-[#1A1A1A]');
  content = content.replace(/border-[#D4A373]/g, 'border-[#1A1A1A]');

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
console.log('Light Theme Inversion Complete!');

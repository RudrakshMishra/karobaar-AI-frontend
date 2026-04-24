const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components'),
  path.join(__dirname, '../tailwind.config.ts')
];

const colorMap = {
  // Accents
  '#C6FF00': '#D4A373', // Neon to Latte
  '198,255,0': '212,163,115', // Neon RGB to Latte RGB
  
  // Backgrounds
  '#080808': '#1C130E',
  '#0A0A0A': '#201610',
  '#0D0D0D': '#261A13',
  '#111111': '#33231A',
  '#111': '#33231A',
  
  // Borders and Nested Elements
  '#1A1A1A': '#3A281E',
  '#1E1E1E': '#422D22',
  '#222222': '#4A3427',
  '#222': '#4A3427',
  '#333333': '#5A4131',
  '#333': '#5A4131',
  '#444444': '#6B4F3D',
  '#444': '#6B4F3D',
  '#555555': '#7D5C48',
  '#555': '#7D5C48',
  
  // Explicit Blacks to Deep Espresso
  'bg-black': 'bg-[#120C08]',
  'text-black': 'text-[#120C08]',
};

// Regex to safely replace without matching substrings of larger hex codes incorrectly
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace each mapped color
  for (const [key, value] of Object.entries(colorMap)) {
    // If it's an RGB string or #HEX, global replace
    // Create a regex to match exact hex codes or rgb values
    // Escape special chars in key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // For hex codes, ensure we don't accidentally replace #111 with #33231A inside #111111
    if (key.startsWith('#') && key.length === 4) {
       // Match #111 but not followed by another hex char
       const regex = new RegExp(`${escapedKey}(?![a-fA-F0-9])`, 'g');
       content = content.replace(regex, value);
    } else {
       const regex = new RegExp(escapedKey, 'g');
       content = content.replace(regex, value);
    }
  }

  // Also manually fix tailwind colors replacing 'black' with standard coffee dark
  content = content.replace(/bg-black/g, 'bg-[#120C08]');
  content = content.replace(/text-black/g, 'text-[#120C08]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (dir.endsWith('.tsx') || dir.endsWith('.ts') || dir.endsWith('.css') || dir.endsWith('.jsx')) {
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
console.log('Recoloring complete!');

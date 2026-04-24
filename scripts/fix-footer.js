const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/Footer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace grey typography with stark black typography ONLY within the Footer
content = content.replace(/text-\[\#666666\]\/[0-9]+/g, 'text-[#1A1A1A]/80'); // Muted text to dark text
content = content.replace(/text-\[\#666666\]/g, 'text-[#1A1A1A]'); // Solid grey text to solid black
// Fix user logo background which was previously set to purple then grey
content = content.replace(/bg-gradient-to-br from-accent to-blue/g, 'bg-[#1A1A1A] text-white');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully made Footer typography black!');

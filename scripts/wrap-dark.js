const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The marker lines
const startMarker = "{/* SECTION 2: PROBLEM STATEMENT */}";
const endMarker = "{/* SECTION 8: FINAL CTA */}";
const endOfSection8 = "      </section>"; // we need to capture up to this tag after SECTION 8

const startIndex = content.indexOf(startMarker);
const section8Index = content.indexOf(endMarker);
// Find the closing tag of section 8
const endOfSection8Index = content.indexOf(endOfSection8, section8Index) + endOfSection8.length;

if (startIndex === -1 || section8Index === -1 || endOfSection8Index === -1) {
  console.log("Could not find markers perfectly");
  process.exit(1);
}

const beforeSections = content.substring(0, startIndex);
const targetedSections = content.substring(startIndex, endOfSection8Index);
const afterSections = content.substring(endOfSection8Index);

// Revert styling inside "targetedSections" to Dark Mode
let darkSections = targetedSections
  // Backgrounds
  .replace(/bg-\[\#FAF9F6\]/g, 'bg-[#120C08]') // cream to espresso
  .replace(/bg-\[\#F2F0EA\]/g, 'bg-[#1C130E]') 
  .replace(/bg-\[\#FFFFFF\]/g, 'bg-[#261A13]') // cards
  .replace(/bg-\[\#E8E6DF\]/g, 'bg-[#33231A]')
  // Generic backgrounds inside elements
  .replace(/bg-\[\#1A1A1A\]\/5/g, 'bg-white/5')
  .replace(/bg-\[\#1A1A1A\]\/\[0\.02\]/g, 'bg-white/[0.02]')
  .replace(/bg-\[\#1A1A1A\]\/\[0\.01\]/g, 'bg-white/[0.01]')
  .replace(/bg-\[\#1A1A1A\]\/\[0\.04\]/g, 'bg-white/[0.04]')
  .replace(/bg-\[\#1A1A1A\]\/\[0\.06\]/g, 'bg-white/[0.06]')
  // Text
  .replace(/text-\[\#666666\]/g, 'text-white')
  .replace(/text-\[\#1A1A1A\]/g, 'text-white')
  .replace(/rgba\(100,100,100,0\.6\)/g, 'rgba(255,255,255,0.5)')
  .replace(/rgba\(100,100,100,0\.7\)/g, 'rgba(255,255,255,0.7)')
  .replace(/rgba\(100,100,100,0\.8\)/g, 'rgba(255,255,255,0.8)')
  // Borders
  .replace(/border-black/g, 'border-white')
  .replace(/border-\[\#E0DDD5\]/g, 'border-[#3A281E]')
  .replace(/border-\[\#D6D3CB\]/g, 'border-[#4A3427]')
  .replace(/border-\[\#C4C1B8\]/g, 'border-[#5A4131]');

// Wrap the dark sections in the black animated grouping container
const wrappedContent = `
      {/* --- DARK INVERSION GROUP --- */}
      <div className="relative bg-[#050505] text-white">
        <div className="absolute inset-0 z-0 opacity-40">
           <StarField />
        </div>
        <div className="relative z-10">
          ${darkSections}
        </div>
      </div>
      {/* ---------------------------- */}
`;

const newContent = beforeSections + wrappedContent + afterSections;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully wrapped and darkened Sections 2 to 8!');

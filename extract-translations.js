const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const transStart = 'const translations = {';
const transEndStr = '};\n\nexport default function Home() {';

const startIndex = content.indexOf(transStart);
const endIndex = content.indexOf(transEndStr);

if (startIndex !== -1 && endIndex !== -1) {
  const transText = content.substring(startIndex, endIndex + 2); // get up to '};'
  fs.writeFileSync('src/utils/translations.ts', 'export ' + transText + '\n');
  
  const newContent = content.substring(0, startIndex) + "import { translations } from '../utils/translations';\nimport { NotionPage, FSEntry } from '../types';\n\n" + content.substring(endIndex + 4);
  fs.writeFileSync(file, newContent);
  console.log("Translations extracted successfully.");
} else {
  console.log("Failed to find translations boundaries.");
}

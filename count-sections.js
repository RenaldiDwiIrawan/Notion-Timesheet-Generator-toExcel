const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const confStart = '<div className="space-y-6">';
const confIndex = content.indexOf(confStart);

const storageStart = '{/* Right Column: Storage */}';
const storageIndex = content.indexOf(storageStart);

console.log("Configuration starts at:", content.substring(0, confIndex).split('\n').length);
console.log("Storage starts at:", content.substring(0, storageIndex).split('\n').length);


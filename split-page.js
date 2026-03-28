const fs = require('fs');

const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file has ~1500 lines. Let's find the components to see how many lines are left in the return statement.
const returnIndex = content.indexOf('return (');
console.log("return starts at line:", content.substring(0, returnIndex).split('\n').length);

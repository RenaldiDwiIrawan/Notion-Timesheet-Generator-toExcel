const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const importLines = `import Header from "../components/sections/Header";
import SignatureSection from "../components/sections/SignatureSection";
`;

content = content.replace('import FileSystemBrowserModal from "../components/modals/FileSystemBrowserModal";', 'import FileSystemBrowserModal from "../components/modals/FileSystemBrowserModal";\n' + importLines);

fs.writeFileSync(file, content);
console.log('Imports added.');

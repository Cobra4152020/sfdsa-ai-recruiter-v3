const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'ripple-background.tsx');

fs.writeFileSync(filePath, '');

console.log(`File created at ${filePath}`); 
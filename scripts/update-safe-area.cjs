const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx') && entry.name !== '_layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('SafeAreaView') && content.includes("from 'react-native'")) {
        // Remove SafeAreaView from react-native import
        content = content.replace(/SafeAreaView,\s*/g, '');
        content = content.replace(/,\s*SafeAreaView/g, '');
        // Add SafeAreaView from react-native-safe-area-context
        if (!content.includes("from 'react-native-safe-area-context'")) {
          content = "import { SafeAreaView } from 'react-native-safe-area-context';\n" + content;
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated SafeAreaView in:', entry.name);
      }
    }
  }
}

processDir('C:/Users/rohit/.gemini/antigravity/scratch/skillbridge-campus/mobile/app');

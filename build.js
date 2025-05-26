import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Clean dist directory
execSync('rm -rf dist');

// Run TypeScript compiler
execSync('tsc');

// Run tsc-alias to replace paths in compiled files
execSync('tsc-alias');

// Copy drivers directory
execSync('cp -r src/drivers dist');

// Add .js extension to imports in compiled files
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(
    /from ['"]([^'"]+)['"]/g,
    (match, importPath) => {
      // Handle regular relative imports
      if (importPath.startsWith('.') && !importPath.endsWith('.js')) {
        return `from '${importPath}.js'`;
      }
      return match;
    }
  );
  fs.writeFileSync(filePath, updatedContent);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js')) {
      processFile(filePath);
    }
  });
}

walkDir('dist'); 
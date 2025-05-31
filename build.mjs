import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';

// Clean dist directory
execSync('rm -rf dist');

// Create dist directory
fs.mkdirSync('dist', { recursive: true });

// Copy drivers directory
execSync('cp -r src/drivers dist');

// Build configuration
const buildOptions = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outfile: 'dist/main.js',
  platform: 'node',
  target: 'node20',
  format: 'esm',
  sourcemap: false,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  treeShaking: true,
  external: [
    // External dependencies that should not be bundled
    'axios',
    'chalk',
    'chokidar',
    'cli-spinners',
    'commander',
    'dotenv',
    'enquirer',
    'ink',
    'ink-spinner',
    'react'
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  tsconfig: 'tsconfig.json'
};

// Build the project
try {
  await esbuild.build(buildOptions);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 
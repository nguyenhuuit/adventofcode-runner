import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import 'dotenv/config';

// Clean dist directory
execSync('rm -rf dist');

// Create dist directory
fs.mkdirSync('dist', { recursive: true });

// Copy drivers directory
execSync('cp -r src/drivers dist');

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'));

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
    '@amplitude/analytics-node',
    'axios',
    'chalk',
    'chokidar',
    'cli-spinners',
    'commander',
    'dotenv',
    'enquirer',
    'ink',
    'ink-spinner',
    'pino',
    'pino-abstract-transport',
    'pino-pretty',
    'pino-std-serializers',
    'react',
    'uuid',
    'zustand'
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  tsconfig: 'tsconfig.json',
  define: {
    'PACKAGE_NAME': JSON.stringify(pkg.name),
    'PACKAGE_VERSION': JSON.stringify(pkg.version),
    'PACKAGE_DESCRIPTION': JSON.stringify(pkg.description),
    'AMPLITUDE_API_KEY': JSON.stringify(process.env.AMPLITUDE_API_KEY || ''),
  },
};

// Build the project
try {
  await esbuild.build(buildOptions);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 
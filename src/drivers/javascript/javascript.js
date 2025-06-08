import './global.js';
import fs from 'fs';
import path from 'path'

const _solutionFile = process.argv[2];
const inputFile = process.argv[3];
const solutionFile = path.resolve(`${process.cwd()}${_solutionFile.slice(1)}`);

import(solutionFile, ).then(async ({ solution }) => {
  const input = fs.readFileSync(inputFile, 'utf8');
  const before = performance.now();
  const rs = await solution(input);
  const after = performance.now();
  const dt = {
    result: rs,
    time: `${(after-before).toFixed(3)}ms`
  }
  process.send && process.send(dt);
});

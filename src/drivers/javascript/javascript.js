import './global.js';
import fs from 'fs';
import path from 'path'
import { EXTENSIONS } from '../../utils/languages.js'

const year = process.argv[2];
const day = process.argv[3];
const part = process.argv[4];
const input = process.argv[5];
const solutionFile = path.resolve(`./${year}/day${day}/part${part}.${EXTENSIONS.javascript}`);
const inputFile = `./${year}/day${day}/${input}.txt`;

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

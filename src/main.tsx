import { Option, program } from 'commander';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import React from 'react';

import { render } from 'ink';

import { validate } from '@utils/prompter';

import App from '@components/App';

const __filename = fileURLToPath(import.meta.url);
const baseDir = dirname(__filename);

// Intentional clear of the console to avoid cluttering the output with previous runs.
// eslint-disable-next-line no-console
console.clear();

program
  .addOption(new Option('-y, --year <year>'))
  .addOption(new Option('-l, --language <language>'))
  .addOption(new Option('-d, --day <day>'))
  .addOption(new Option('-p, --part <part>'));

program.parse();

validate(program.opts())
  .then((result) => {
    const { year, day, part, language } = result;
    const initialState: AppState = {
      inputMode: 'sample',
      answer: '123',
      output: '',
      year,
      day,
      part,
      language,
      baseDir,
    };
    render(<App state={initialState} />);
  })
  .catch(() => {
    process.exit(1);
  });

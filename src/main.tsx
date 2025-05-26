import { Option, program } from 'commander';

import React from 'react';

import { render } from 'ink';

import { LANGUAGE_MAP, validate } from '@utils/prompter';

import App from '@components/App';

// Intentional clear of the console to avoid cluttering the output with previous runs.
// eslint-disable-next-line no-console
console.clear();

program
  .addOption(new Option('-y, --year <year>'))
  .addOption(new Option('-l, --language <language>').default('python'))
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
      language: LANGUAGE_MAP[language] || 'python',
    };
    render(<App state={initialState} />);
  })
  .catch(() => {
    process.exit(1);
  });

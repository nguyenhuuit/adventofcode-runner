import dotenv from 'dotenv';
import { render } from 'ink';
import { program, Option } from 'commander';

import { validate, LANGUAGE_MAP } from './utils/prompter.js';
import App from './components/App.js'
import React from 'react';

dotenv.config()
console.clear()

program
  .addOption(new Option('-y, --year <year>'))
  .addOption(new Option('-l, --language <language>').default('python'))
  .addOption(new Option('-d, --day <day>'))
  .addOption(new Option('-p, --part <part>'));

program.parse();

validate(program.opts())
  .then(result => {
    const { year, day, part, language } = result;
    const initialState: AppState = {
      inputMode: 'sample',
      answer: '123',
      output: '',
      year,
      day,
      part,
      language: LANGUAGE_MAP[language] || 'python'
    };
    render(
      <App state={initialState}/>
    );
  })
  .catch(() => {
    process.exit(1)
  });





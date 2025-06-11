import { Option, program } from 'commander';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import React from 'react';

import { render } from 'ink';

import { config } from '@utils/config';
import { validate } from '@utils/prompter';

import App from './App';

const __filename = fileURLToPath(import.meta.url);
const baseDir = dirname(__filename);

// Intentional clear of the console to avoid cluttering the output with previous runs.
// eslint-disable-next-line no-console
console.clear();

program
  .addOption(new Option('-y, --year <year>'))
  .addOption(new Option('-l, --language <language>'))
  .addOption(new Option('-d, --day <day>'))
  .addOption(new Option('-p, --part <part>'))
  .addOption(new Option('--disable-telemetry', 'Disable telemetry'));

program.parse();

config.telemetryEnabled = !program.opts()['disableTelemetry'];

validate(program.opts())
  .then((promptInput) => {
    render(<App promptInput={{ ...promptInput, baseDir }} />);
  })
  .catch(() => {
    process.exit(1);
  });

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

program
  .name(config.appName)
  .version(config.appVersion, '-v, --version', 'Display version')
  .helpOption('-h, --help', 'Display help')
  .addOption(new Option('-y, --year <year>', 'Select year'))
  .addOption(new Option('-l, --language <language>', 'Select programming language'))
  .addOption(new Option('-d, --day <day>', 'Select day'))
  .addOption(new Option('-p, --part <part>', 'Select part'))
  .addOption(new Option('-t, --disable-telemetry', 'Disable telemetry'));

program.showHelpAfterError();
program.showSuggestionAfterError(false);
program.parse();

// Intentional clear of the console to avoid cluttering the output with previous runs.
// eslint-disable-next-line no-console
console.clear();

config.telemetryEnabled = !program.opts()['disableTelemetry'];

validate(program.opts())
  .then((promptInput) => {
    render(<App promptInput={{ ...promptInput, baseDir }} />);
  })
  .catch(() => {
    process.exit(1);
  });

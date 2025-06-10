import chalk from 'chalk';

export const VALID_YEARS = [
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
];

export const HOST = 'https://adventofcode.com';

const bg = (s: string): string => chalk.bold(chalk.greenBright(s));
const by = (s: string): string => chalk.bold(chalk.yellowBright(s));

export const HELP_MESSAGE = `Instructions:
${by('0-9')}: Run ${bg('partX')} solution         ${by('Enter')}: Re-run solution
${by('U')}  : Submit solution            ${by('X')}    : Terminate solution
${by('S')}  : Run solution with ${bg('sample')}   ${by('H')}    : Print the instructions
${by('I')}  : Run solution with ${bg('input')}    ${by('Q')}    : Quit application`;

export const NOOP = () => {};

// These will be replaced by esbuild in production
declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;

// For development environment, read from package.json
let packageName: string;
let packageVersion: string;

if (typeof PACKAGE_NAME === 'undefined' || typeof PACKAGE_VERSION === 'undefined') {
  try {
    const pkg = require('../../package.json');
    packageName = pkg.name;
    packageVersion = pkg.version;
  } catch {
    packageName = 'adventofcode-runner';
    packageVersion = '0.0.0';
  }
} else {
  packageName = PACKAGE_NAME;
  packageVersion = PACKAGE_VERSION;
}

export const APP_NAME = packageName;
export const APP_VERSION = packageVersion;

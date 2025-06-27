import chalk from 'chalk';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { v5 } from 'uuid';

dotenv.config();

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

// These will be replaced by esbuild in build time
declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;
declare const PACKAGE_DESCRIPTION: string;
declare const AMPLITUDE_API_KEY: string;

// For development environment, read from package.json
let packageName: string;
let packageVersion: string;
let packageDescription: string;
let amplitudeApiKey: string;

if (typeof PACKAGE_NAME === 'undefined' || typeof PACKAGE_VERSION === 'undefined') {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
  packageName = pkg.name;
  packageVersion = pkg.version;
  packageDescription = pkg.description;
  amplitudeApiKey = process.env['AMPLITUDE_API_KEY'] || '';
} else {
  packageName = PACKAGE_NAME;
  packageVersion = PACKAGE_VERSION;
  packageDescription = PACKAGE_DESCRIPTION;
  amplitudeApiKey = AMPLITUDE_API_KEY;
}

export const APP_NAME = packageName;
export const APP_VERSION = packageVersion;
export const APP_DESCRIPTION = packageDescription;
export const APP_AMPLITUDE_API_KEY = amplitudeApiKey;

export const OID_NAMESPACE = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

export const AOC_NAMESPACE = v5(APP_AMPLITUDE_API_KEY, OID_NAMESPACE);

export enum InputMode {
  INPUT = 'input',
  SAMPLE = 'sample',
}

import { appendFileSync } from 'fs';

import { EXTENSIONS } from '@utils/languages';

export const getSolutionFile = (state: ExecutionInput): string => {
  const file = `./${state.year}/day${state.day}/part${state.part}.${EXTENSIONS[state.language]}`;
  return file;
};

export const getInputFile = (state: ExecutionInput): string => {
  const file = `./${state.year}/day${state.day}/${state.inputMode}.txt`;
  return file;
};

export const debug = (message: string): void => {
  const debugFile = './debug.log';
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  appendFileSync(debugFile, logMessage, 'utf8');
};

import { EXTENSIONS } from './languages.js';

export const getSolutionFile = (state: ExecutionInput): string => {
  const file = `./${state.year}/day${state.day}/part${state.part}.${EXTENSIONS[state.language]}`;
  return file;
};

export const getInputFile = (state: ExecutionInput): string => {
  const file = `./${state.year}/day${state.day}/${state.inputMode}.txt`;
  return file;
};

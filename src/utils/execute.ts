import { ChildProcess } from 'child_process';

import {
  CppExecutor,
  Executor,
  GolangExecutor,
  JavaExecutor,
  JavascriptExecutor,
  PythonExecutor,
  RubyExecutor,
} from './executors';

export const terminate = (): void => {
  Executor.terminate();
};

export const executeAsStream = (options: ExecuteOptions): ChildProcess => {
  terminate();
  let executor: Executor;

  switch (options.language) {
    case 'javascript':
      executor = new JavascriptExecutor(options);
      break;
    case 'python':
      executor = new PythonExecutor(options);
      break;
    case 'ruby':
      executor = new RubyExecutor(options);
      break;
    case 'go':
      executor = new GolangExecutor(options);
      break;
    case 'java':
      executor = new JavaExecutor(options);
      break;
    case 'cpp':
      executor = new CppExecutor(options);
      break;
    default:
      throw Error('Unknown language');
  }

  return executor.execute();
};

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

export const executeAsStream = (state: ExecutionInput): ChildProcess => {
  terminate();
  let executor: Executor;

  switch (state.language) {
    case 'javascript':
      executor = new JavascriptExecutor(state);
      break;
    case 'python':
      executor = new PythonExecutor(state);
      break;
    case 'ruby':
      executor = new RubyExecutor(state);
      break;
    case 'go':
      executor = new GolangExecutor(state);
      break;
    case 'java':
      executor = new JavaExecutor(state);
      break;
    case 'cpp':
      executor = new CppExecutor(state);
      break;
    default:
      throw Error('Unknown language');
  }

  return executor.execute();
};

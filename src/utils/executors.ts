import { ChildProcess, execSync, spawn } from 'child_process';
import path, { resolve } from 'path';

import { getInputFile, getSolutionFile } from '@utils/misc';

const dir = path.dirname(process.argv[1] || process.cwd())

let childProcess: ChildProcess;

export const terminate = (): void => {
  if (childProcess && childProcess instanceof ChildProcess && !childProcess.killed) {
    childProcess.kill('SIGKILL');
  }
};

export const executeAsStream = (state: ExecutionInput): ChildProcess => {
  terminate();
  switch (state.language) {
    case 'javascript': {
      return executeJavascript(state);
    }
    case 'python': {
      return executePython(state);
    }
    case 'ruby': {
      return executeRuby(state);
    }
    case 'go': {
      return executeGolang(state);
    }
    case 'java': {
      return executeJava(state);
    }
    case 'cpp': {
      return executeCpp(state);
    }
    default:
      throw Error('Unknown language');
  }
};

const executeCpp = (state: ExecutionInput): ChildProcess => {
  const solutionFile = getSolutionFile(state);
  const inputFile = getInputFile(state);
  execSync(`g++ -o ${dir}/drivers/cpp/cpp ${dir}/drivers/cpp/main.cpp ${solutionFile}`);
  childProcess = spawn(dir + '/drivers/cpp/cpp', [inputFile.replace('./', resolve('./') + '/')], {
    cwd: dir + '/drivers/cpp',
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  });
  return childProcess;
};

const executeJava = (state: ExecutionInput): ChildProcess => {
  const solutionFile = getSolutionFile(state);
  const inputFile = getInputFile(state);
  execSync(`javac -d ${dir}/drivers/java ${solutionFile}`);
  childProcess = spawn(
    'java',
    ['-cp', 'gson-2.10.1.jar:.', 'JavaRunner', inputFile.replace('./', resolve('./') + '/')],
    {
      cwd: dir + '/drivers/java',
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    }
  );
  return childProcess;
};

const executePython = (state: ExecutionInput): ChildProcess => {
  childProcess = spawn(
    'python3',
    ['-u', dir + '/drivers/python/python.py', state.year, state.day, state.part, state.inputMode],
    {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    }
  );
  return childProcess;
};

const executeRuby = (state: ExecutionInput): ChildProcess => {
  childProcess = spawn(
    'ruby',
    [dir + '/drivers/ruby/ruby.rb', state.year, state.day, state.part, state.inputMode],
    {
      cwd: dir,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    }
  );
  return childProcess;
};

const executeJavascript = (state: ExecutionInput) => {
  childProcess = spawn(
    'node',
    [dir + '/drivers/javascript/javascript.js', state.year, state.day, state.part, state.inputMode],
    {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    }
  );
  return childProcess;
};

const executeGolang = (state: ExecutionInput): ChildProcess => {
  const solutionFile = getSolutionFile(state);
  const inputFile = getInputFile(state);
  execSync(`go build -buildmode=plugin -o ${dir}/drivers/golang/golang.so ${solutionFile}`);
  childProcess = spawn(
    'go',
    ['run', dir + '/drivers/golang/golang.go', inputFile, `${dir}/drivers/golang/golang.so`],
    {
      cwd: '.',
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    }
  );
  return childProcess;
};

import { execSync, ChildProcess, spawn } from 'child_process';
import { getInputFile, getSolutionFile } from './misc.js';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = resolve(join(__dirname, '..'))

let childProcess: ChildProcess;

export const terminate = (): void => {
  if (childProcess && childProcess instanceof ChildProcess && !childProcess.killed) {
    childProcess.kill('SIGKILL')
  }
}

export const executeAsStream = (state: ExecutionInput): ChildProcess => {
  terminate()
  switch (state.language) {
    case 'javascript': {
      return executeJavascript(state);
    }
    case 'python': {
      return executePython(state);
    }
    case 'go': {
      return executeGolang(state);
    }
    case 'java': {
      return executeJava(state);
    }
    default: throw Error('Unknown language');
  }
};
  
const executeJava = (state: ExecutionInput): ChildProcess => {
  const solutionFile = getSolutionFile(state);
  const inputFile = getInputFile(state);
  execSync(`javac -d ${dir}/drivers/java ${solutionFile}`);
  childProcess = spawn(
    'java',
    ['-cp', 'gson-2.10.1.jar:.', 'JavaRunner', inputFile.replace("./", resolve('./') + '/')],
    {
      cwd: dir + '/drivers/java',
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']}
  )
  return childProcess
};

const executePython = (state: ExecutionInput): ChildProcess => {
  childProcess = spawn(
    'python3',
    ['-u', dir + '/drivers/python/python.py', state.year ,state.day, state.part, state.inputMode],
    {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    }
  )
  return childProcess
}

const executeJavascript = (state: ExecutionInput) => {
  childProcess = spawn('node',
    [dir + '/drivers/javascript/javascript.js', state.year, state.day, state.part, state.inputMode],
    {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    },
  );
  return childProcess
};

const executeGolang = (state: ExecutionInput): ChildProcess => {
  const solutionFile = getSolutionFile(state);
  const inputFile = getInputFile(state);
  execSync(`go build -buildmode=plugin -o ${dir}/drivers/golang/golang.so ${solutionFile}`);
  childProcess = spawn(
    'go',
    ['run', dir + '/drivers/golang/golang.go', inputFile],
    {
      cwd: '.',
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    },
  );
  return childProcess
};

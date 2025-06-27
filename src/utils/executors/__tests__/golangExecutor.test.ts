import { ChildProcess, execSync, spawn } from 'child_process';

import { Executor } from '../executor';
import { GolangExecutor } from '../golangExecutor';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
  spawn: jest.fn(),
}));

describe('GolangExecutor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockExecSync: jest.MockedFunction<typeof execSync>;
  let mockProcess: Partial<ChildProcess>;

  const options = {
    solutionFile: './solution.go',
    inputFile: './input.txt',
    baseDir: '.',
    language: 'golang',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
    mockProcess = { killed: false, kill: jest.fn() };
    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  it('should build and spawn process with correct args', () => {
    const executor = new GolangExecutor(options);
    const result = executor.execute();
    expect(mockExecSync).toHaveBeenCalledWith(
      'go build -buildmode=plugin -o ./drivers/golang/golang.so ./solution.go',
      { stdio: Executor['COMPILATION_STDIO'] }
    );
    expect(mockSpawn).toHaveBeenCalledWith(
      'go',
      ['run', './drivers/golang/golang.go', './input.txt', './drivers/golang/golang.so'],
      { cwd: '.', stdio: Executor['DEFAULT_STDIO'] }
    );
    expect(result).toBe(mockProcess);
  });

  it('should return error process if build fails', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('build failed');
    });
    const executor = new GolangExecutor(options);
    const errorProcess = {} as ChildProcess;
    jest.spyOn(executor as any, 'createErrorProcess').mockReturnValue(errorProcess);
    const result = executor.execute();
    expect(result).toBe(errorProcess);
  });
});

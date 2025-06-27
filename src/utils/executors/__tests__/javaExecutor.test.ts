import { ChildProcess, execSync, spawn } from 'child_process';

import { Executor } from '../executor';
import { JavaExecutor } from '../javaExecutor';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
  spawn: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn(() => '/abs/path'),
}));

describe('JavaExecutor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockExecSync: jest.MockedFunction<typeof execSync>;
  let mockProcess: Partial<ChildProcess>;

  const options = {
    solutionFile: './solution.java',
    inputFile: './input.txt',
    baseDir: '.',
    language: 'java',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
    mockProcess = { killed: false, kill: jest.fn() };
    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  it('should build and spawn process with correct args', () => {
    const executor = new JavaExecutor(options);
    const result = executor.execute();
    expect(mockExecSync).toHaveBeenCalledWith('javac -d ./drivers/java ./solution.java', {
      stdio: Executor['COMPILATION_STDIO'],
    });
    expect(mockSpawn).toHaveBeenCalledWith(
      'java',
      ['-cp', 'gson-2.10.1.jar:.', 'JavaRunner', '/abs/path/input.txt'],
      { cwd: './drivers/java', stdio: Executor['DEFAULT_STDIO'] }
    );
    expect(result).toBe(mockProcess);
  });

  it('should return error process if build fails', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('build failed');
    });
    const executor = new JavaExecutor(options);
    const errorProcess = {} as ChildProcess;
    jest.spyOn(executor as any, 'createErrorProcess').mockReturnValue(errorProcess);
    const result = executor.execute();
    expect(result).toBe(errorProcess);
  });
});

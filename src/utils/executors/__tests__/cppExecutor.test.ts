import { ChildProcess, execSync, spawn } from 'child_process';

import { CppExecutor } from '../cppExecutor';
import { Executor } from '../executor';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
  spawn: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn(() => '/abs/path'),
}));

describe('CppExecutor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockExecSync: jest.MockedFunction<typeof execSync>;
  let mockProcess: Partial<ChildProcess>;

  const options = {
    solutionFile: './solution.cpp',
    inputFile: './input.txt',
    baseDir: '.',
    language: 'cpp',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
    mockProcess = { killed: false, kill: jest.fn() };
    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  it('should build and spawn process with correct args', () => {
    const executor = new CppExecutor(options);
    const result = executor.execute();
    expect(mockExecSync).toHaveBeenCalledWith(
      'g++ -o ./drivers/cpp/solution_cpp ./drivers/cpp/main.cpp ./solution.cpp',
      { stdio: Executor['COMPILATION_STDIO'] }
    );
    expect(mockSpawn).toHaveBeenCalledWith('./drivers/cpp/solution_cpp', ['/abs/path/input.txt'], {
      cwd: './drivers/cpp',
      stdio: Executor['DEFAULT_STDIO'],
    });
    expect(result).toBe(mockProcess);
  });

  it('should return error process if build fails', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('build failed');
    });
    const executor = new CppExecutor(options);
    const errorProcess = {} as ChildProcess;
    jest.spyOn(executor as any, 'createErrorProcess').mockReturnValue(errorProcess);
    const result = executor.execute();
    expect(result).toBe(errorProcess);
  });
});

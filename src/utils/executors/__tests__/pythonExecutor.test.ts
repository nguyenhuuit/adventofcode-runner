import { ChildProcess, spawn } from 'child_process';

import { Executor } from '../executor';
import { PythonExecutor } from '../pythonExecutor';

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('PythonExecutor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockProcess: Partial<ChildProcess>;

  const options = {
    solutionFile: './solution.py',
    inputFile: './input.txt',
    baseDir: '.',
    language: 'python',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockProcess = { killed: false, kill: jest.fn() };
    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  it('should spawn process with correct args', () => {
    const executor = new PythonExecutor(options);
    const result = executor.execute();
    expect(mockSpawn).toHaveBeenCalledWith(
      'python3',
      ['-u', './drivers/python/python.py', './solution.py', './input.txt'],
      { stdio: Executor['DEFAULT_STDIO'] }
    );
    expect(result).toBe(mockProcess);
  });
});

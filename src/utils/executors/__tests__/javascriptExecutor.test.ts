import { ChildProcess, spawn } from 'child_process';

import { Executor } from '../executor';
import { JavascriptExecutor } from '../javascriptExecutor';

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('JavascriptExecutor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockProcess: Partial<ChildProcess>;

  const options = {
    solutionFile: './solution.js',
    inputFile: './input.txt',
    baseDir: '.',
    language: 'javascript',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockProcess = { killed: false, kill: jest.fn() };
    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  it('should spawn process with correct args', () => {
    const executor = new JavascriptExecutor(options);
    const result = executor.execute();
    expect(mockSpawn).toHaveBeenCalledWith(
      'node',
      ['./drivers/javascript/javascript.js', './solution.js', './input.txt'],
      { stdio: Executor['DEFAULT_STDIO'] }
    );
    expect(result).toBe(mockProcess);
  });
});

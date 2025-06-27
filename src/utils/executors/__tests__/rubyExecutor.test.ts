import { ChildProcess, spawn } from 'child_process';

import { Executor } from '../executor';
import { RubyExecutor } from '../rubyExecutor';

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('RubyExecutor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockProcess: Partial<ChildProcess>;

  const options = {
    solutionFile: './solution.rb',
    inputFile: './input.txt',
    baseDir: '.',
    language: 'ruby',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockProcess = { killed: false, kill: jest.fn() };
    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  it('should spawn process with correct args', () => {
    const executor = new RubyExecutor(options);
    const result = executor.execute();
    expect(mockSpawn).toHaveBeenCalledWith(
      'ruby',
      ['./drivers/ruby/ruby.rb', './solution.rb', './input.txt'],
      { stdio: Executor['DEFAULT_STDIO'] }
    );
    expect(result).toBe(mockProcess);
  });
});

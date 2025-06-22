/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChildProcess, spawn } from 'child_process';

import { Executor } from '../executor';

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

class TestExecutor extends Executor {
  execute(): ChildProcess {
    return this.spawnProcess('test', ['arg1', 'arg2']);
  }
}

describe('Executor', () => {
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockProcess: Partial<ChildProcess>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockProcess = {
      killed: false,
      kill: jest.fn(),
    };

    mockSpawn.mockReturnValue(mockProcess as ChildProcess);
  });

  afterEach(() => {
    jest.useRealTimers();
    Executor.currentProcess = null;
  });

  describe('constructor', () => {
    it('should store options', () => {
      const options = {
        solutionFile: './solution.js',
        inputFile: './input.txt',
        baseDir: './',
        language: 'javascript',
      };

      const executor = new TestExecutor(options);
      expect(executor['options']).toBe(options);
    });
  });

  describe('getSolutionFilePath', () => {
    it('should return solution file path', () => {
      const options = {
        solutionFile: './solution.js',
        inputFile: './input.txt',
        baseDir: './',
        language: 'javascript',
      };

      const executor = new TestExecutor(options);
      expect(executor['getSolutionFilePath']()).toBe('./solution.js');
    });
  });

  describe('getInputFilePath', () => {
    it('should return input file path', () => {
      const options = {
        solutionFile: './solution.js',
        inputFile: './input.txt',
        baseDir: './',
        language: 'javascript',
      };

      const executor = new TestExecutor(options);
      expect(executor['getInputFilePath']()).toBe('./input.txt');
    });
  });

  describe('getDriverPath', () => {
    it('should return driver path', () => {
      const options = {
        solutionFile: './solution.js',
        inputFile: './input.txt',
        baseDir: './',
        language: 'javascript',
      };

      const executor = new TestExecutor(options);
      expect(executor['getDriverPath']()).toBe('.//drivers/javascript');
    });
  });

  describe('setCurrentProcess', () => {
    it('should set current process', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const process = {} as ChildProcess;

      executor['setCurrentProcess'](process);
      expect(Executor.currentProcess).toBe(process);
    });
  });

  describe('spawnProcess', () => {
    it('should spawn process with default stdio', () => {
      const executor = new TestExecutor({} as ExecuteOptions);

      executor['spawnProcess']('test', ['arg1', 'arg2']);

      expect(mockSpawn).toHaveBeenCalledWith('test', ['arg1', 'arg2'], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });
    });

    it('should spawn process with custom options', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const customOptions = { cwd: '/custom/path' };

      executor['spawnProcess']('test', ['arg1'], customOptions);

      expect(mockSpawn).toHaveBeenCalledWith('test', ['arg1'], {
        ...customOptions,
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });
    });

    it('should spawn process with custom stdio', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const customOptions = { stdio: ['ignore', 'ignore', 'pipe'] as any };

      executor['spawnProcess']('test', ['arg1'], customOptions);

      expect(mockSpawn).toHaveBeenCalledWith('test', ['arg1'], {
        ...customOptions,
        stdio: ['ignore', 'ignore', 'pipe'],
      });
    });

    it('should set current process when spawning', () => {
      const executor = new TestExecutor({} as ExecuteOptions);

      executor['spawnProcess']('test', ['arg1']);

      expect(Executor.currentProcess).toBe(mockProcess);
    });
  });

  describe('createErrorProcess', () => {
    it('should create error process with Error message', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const error = new Error('Test error');

      executor['createErrorProcess'](error);

      expect(mockSpawn).toHaveBeenCalledWith('echo', ['Test error'], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });
    });

    it('should create error process with string error', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const error = 'String error';

      executor['createErrorProcess'](error);

      expect(mockSpawn).toHaveBeenCalledWith('echo', ['String error'], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });
    });

    it('should kill error process after timeout', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const error = new Error('Test error');

      executor['createErrorProcess'](error);

      expect(mockProcess.kill).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockProcess.kill).toHaveBeenCalledWith('SIGKILL');
    });

    it('should not kill process if already killed', () => {
      const executor = new TestExecutor({} as ExecuteOptions);
      const error = new Error('Test error');
      Object.defineProperty(mockProcess, 'killed', { value: true, writable: true });

      executor['createErrorProcess'](error);

      jest.advanceTimersByTime(100);

      expect(mockProcess.kill).not.toHaveBeenCalled();
    });
  });

  describe('terminate', () => {
    it('should kill current process if exists and not killed', () => {
      Executor.currentProcess = mockProcess as ChildProcess;
      Object.defineProperty(mockProcess, 'killed', { value: false, writable: true });

      Executor.terminate();

      expect(mockProcess.kill).toHaveBeenCalledWith('SIGKILL');
    });

    it('should not kill process if already killed', () => {
      Executor.currentProcess = mockProcess as ChildProcess;
      Object.defineProperty(mockProcess, 'killed', { value: true, writable: true });

      Executor.terminate();

      expect(mockProcess.kill).not.toHaveBeenCalled();
    });

    it('should handle null current process', () => {
      Executor.currentProcess = null;

      expect(() => Executor.terminate()).not.toThrow();
    });
  });

  describe('static properties', () => {
    it('should have correct DEFAULT_STDIO', () => {
      expect(Executor['DEFAULT_STDIO']).toEqual(['pipe', 'pipe', 'pipe', 'ipc']);
    });

    it('should have correct COMPILATION_STDIO', () => {
      expect(Executor['COMPILATION_STDIO']).toEqual(['ignore', 'ignore', 'pipe']);
    });

    it('should initialize currentProcess as null', () => {
      expect(Executor.currentProcess).toBeNull();
    });
  });

  describe('integration', () => {
    it('should execute and set current process', () => {
      const executor = new TestExecutor({} as ExecuteOptions);

      const result = executor.execute();

      expect(result).toBe(mockProcess);
      expect(Executor.currentProcess).toBe(mockProcess);
      expect(mockSpawn).toHaveBeenCalledWith('test', ['arg1', 'arg2'], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });
    });
  });
});

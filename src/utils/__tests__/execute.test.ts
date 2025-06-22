/* eslint-disable @typescript-eslint/no-explicit-any */
import { executeAsStream, executorFactory } from '../execute';
import { Executor } from '../executors/executor';

const mockExecute = jest.fn();

class MockExecutor {
  constructor(_options: ExecuteOptions) {}
  execute = mockExecute;
}

describe('executorFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    executorFactory.registerExecutor('javascript', MockExecutor as any);
    executorFactory.registerExecutor('python', MockExecutor as any);
    executorFactory.registerExecutor('ruby', MockExecutor as any);
    executorFactory.registerExecutor('go', MockExecutor as any);
    executorFactory.registerExecutor('java', MockExecutor as any);
    executorFactory.registerExecutor('cpp', MockExecutor as any);
  });

  it.each(['javascript', 'python', 'ruby', 'go', 'java', 'cpp'])(
    'should create executor for %s',
    (language) => {
      const options = { language } as ExecuteOptions;
      const executor = executorFactory.createExecutor(options);
      expect(executor).toBeInstanceOf(MockExecutor);
    }
  );

  it('should throw if no executor registered for language', () => {
    expect(() => executorFactory.createExecutor({ language: 'unknown' } as ExecuteOptions)).toThrow(
      'No executor registered for language: unknown'
    );
  });
});

describe('executeAsStream', () => {
  let terminateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    terminateSpy = jest.spyOn(Executor, 'terminate').mockImplementation(() => {});
    executorFactory.registerExecutor('javascript', MockExecutor as any);
  });

  it('should call terminate, create executor, and call execute', () => {
    const options = { language: 'javascript' } as ExecuteOptions;
    const fakeProcess = {} as any;
    mockExecute.mockReturnValue(fakeProcess);
    const result = executeAsStream(options);
    expect(terminateSpy).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalled();
    expect(result).toBe(fakeProcess);
  });

  it('should throw if language is not registered', () => {
    const options = { language: 'unknown' } as ExecuteOptions;
    expect(() => executeAsStream(options)).toThrow('No executor registered for language: unknown');
  });
});

import { ChildProcess } from 'child_process';

import {
  CppExecutor,
  Executor,
  GolangExecutor,
  JavaExecutor,
  JavascriptExecutor,
  PythonExecutor,
  RubyExecutor,
} from '@utils/executors';

interface IExecutorFactory {
  createExecutor(options: ExecuteOptions): Executor;
}

class ExecutorFactory implements IExecutorFactory {
  private static instance: ExecutorFactory;
  private executors: Map<string, new (options: ExecuteOptions) => Executor>;

  private constructor() {
    this.executors = new Map();
  }

  public static getInstance(): ExecutorFactory {
    if (!ExecutorFactory.instance) {
      ExecutorFactory.instance = new ExecutorFactory();
    }
    return ExecutorFactory.instance;
  }

  public registerExecutor(
    language: string,
    executor: new (options: ExecuteOptions) => Executor
  ): void {
    this.executors.set(language, executor);
  }

  public createExecutor(options: ExecuteOptions): Executor {
    const ExecutorClass = this.executors.get(options.language);
    if (!ExecutorClass) {
      throw new Error(`No executor registered for language: ${options.language}`);
    }
    return new ExecutorClass(options);
  }
}

const registerDefaultExecutors = (factory: ExecutorFactory): void => {
  factory.registerExecutor('javascript', JavascriptExecutor);
  factory.registerExecutor('python', PythonExecutor);
  factory.registerExecutor('ruby', RubyExecutor);
  factory.registerExecutor('go', GolangExecutor);
  factory.registerExecutor('java', JavaExecutor);
  factory.registerExecutor('cpp', CppExecutor);
};

const factoryInstance = ExecutorFactory.getInstance();
registerDefaultExecutors(factoryInstance);

export const executorFactory: IExecutorFactory = factoryInstance;

export const executeAsStream = (options: ExecuteOptions): ChildProcess => {
  Executor.terminate();
  const executor = executorFactory.createExecutor(options);
  return executor.execute();
};

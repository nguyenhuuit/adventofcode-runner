import { ChildProcess, SpawnOptions, spawn } from 'child_process';

export abstract class Executor {
  public static currentProcess: ChildProcess | null = null;
  protected static readonly DEFAULT_STDIO: SpawnOptions['stdio'] = ['pipe', 'pipe', 'pipe', 'ipc'];

  constructor(protected options: ExecuteOptions) {
    this.options = options;
  }

  abstract execute(): ChildProcess;

  protected setCurrentProcess(process: ChildProcess): void {
    Executor.currentProcess = process;
  }

  protected getSolutionFilePath(): string {
    return this.options.solutionFile;
  }

  protected getInputFilePath(): string {
    return this.options.inputFile;
  }

  protected getDriverPath(): string {
    return `${this.options.baseDir}/drivers/${this.options.language}`;
  }

  public static terminate(): void {
    if (Executor.currentProcess && !Executor.currentProcess.killed) {
      Executor.currentProcess.kill('SIGKILL');
    }
  }

  protected spawnProcess(
    command: string,
    args: string[],
    options: SpawnOptions = {}
  ): ChildProcess {
    const process = spawn(command, args, {
      ...options,
      stdio: options.stdio || Executor.DEFAULT_STDIO,
    });
    this.setCurrentProcess(process);
    return process;
  }
}

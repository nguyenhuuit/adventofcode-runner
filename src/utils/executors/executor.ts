import { ChildProcess, SpawnOptions, spawn } from 'child_process';
import { getInputFile, getSolutionFile } from '@utils/misc';

export abstract class Executor {
  public static currentProcess: ChildProcess | null = null;
  protected static readonly DEFAULT_STDIO: SpawnOptions['stdio'] = ['pipe', 'pipe', 'pipe', 'ipc'];

  constructor(protected state: ExecutionInput) {
    this.state = state;
  }

  abstract execute(): ChildProcess;

  protected getSolutionFile(): string {
    return getSolutionFile(this.state);
  }

  protected getInputFile(): string {
    return getInputFile(this.state);
  }

  protected setCurrentProcess(process: ChildProcess): void {
    Executor.currentProcess = process;
  }

  protected getDriverPath(language: string): string {
    return `${this.state.baseDir}/drivers/${language}`;
  }

  public static terminate(): void {
    if (Executor.currentProcess && !Executor.currentProcess.killed) {
      Executor.currentProcess.kill('SIGKILL');
    }
  }

  protected spawnProcess(command: string, args: string[], options: SpawnOptions = {}): ChildProcess {
    const process = spawn(command, args, {
      ...options,
      stdio: options.stdio || Executor.DEFAULT_STDIO,
    });
    this.setCurrentProcess(process);
    return process;
  }
} 
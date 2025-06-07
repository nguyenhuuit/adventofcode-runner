import { ChildProcess, execSync } from 'child_process';
import { Executor } from './executor';

export class GolangExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFile();
    const inputFile = this.getInputFile();
    execSync(
      `go build -buildmode=plugin -o ${this.getDriverPath('golang')}/golang.so ${solutionFile}`
    );
    return this.spawnProcess(
      'go',
      [
        'run',
        this.getDriverPath('golang') + '/golang.go',
        inputFile,
        `${this.getDriverPath('golang')}/golang.so`,
      ],
      {
        cwd: '.',
      }
    );
  }
} 
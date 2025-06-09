import { ChildProcess, execSync } from 'child_process';

import { Executor } from './executor';

export class GolangExecutor extends Executor {
  override getDriverPath(): string {
    return `${this.options.baseDir}/drivers/golang`;
  }
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFilePath();
    const inputFile = this.getInputFilePath();
    const driverPath = this.getDriverPath();
    try {
      execSync(`go build -buildmode=plugin -o ${driverPath}/golang.so ${solutionFile}`, {
        stdio: Executor.COMPILATION_STDIO,
      });
    } catch (error) {
      return this.createErrorProcess(error);
    }

    return this.spawnProcess(
      'go',
      ['run', driverPath + '/golang.go', inputFile, `${driverPath}/golang.so`],
      {
        cwd: '.',
      }
    );
  }
}

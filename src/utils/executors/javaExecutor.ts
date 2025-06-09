import { ChildProcess, execSync } from 'child_process';
import { resolve } from 'path';

import { Executor } from './executor';

export class JavaExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFilePath();
    const inputFile = this.getInputFilePath();
    const driverPath = this.getDriverPath();

    try {
      execSync(`javac -d ${driverPath} ${solutionFile}`, { stdio: Executor.COMPILATION_STDIO });
    } catch (error) {
      return this.createErrorProcess(error);
    }

    return this.spawnProcess(
      'java',
      ['-cp', 'gson-2.10.1.jar:.', 'JavaRunner', inputFile.replace('./', resolve('./') + '/')],
      {
        cwd: driverPath,
      }
    );
  }
}

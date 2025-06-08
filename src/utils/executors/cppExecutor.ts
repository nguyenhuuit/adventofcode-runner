import { ChildProcess, execSync } from 'child_process';
import { resolve } from 'path';

import { Executor } from './executor';

export class CppExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFilePath();
    const inputFile = this.getInputFilePath();
    const driverPath = this.getDriverPath();
    execSync(`g++ -o ${driverPath}/solution_cpp ${driverPath}/main.cpp ${solutionFile}`);
    return this.spawnProcess(
      driverPath + '/solution_cpp',
      [inputFile.replace('./', resolve('./') + '/')],
      {
        cwd: driverPath,
      }
    );
  }
}

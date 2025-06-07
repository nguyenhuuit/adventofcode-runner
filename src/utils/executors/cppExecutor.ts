import { ChildProcess, execSync } from 'child_process';
import { resolve } from 'path';
import { Executor } from './executor';

export class CppExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFile();
    const inputFile = this.getInputFile();
    execSync(
      `g++ -o ${this.getDriverPath('cpp')}/cpp ${this.getDriverPath('cpp')}/main.cpp ${solutionFile}`
    );
    return this.spawnProcess(
      this.getDriverPath('cpp') + '/cpp',
      [inputFile.replace('./', resolve('./') + '/')],
      {
        cwd: this.getDriverPath('cpp'),
      }
    );
  }
}

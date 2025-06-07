import { ChildProcess, execSync } from 'child_process';
import { resolve } from 'path';
import { Executor } from './executor';

export class JavaExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFile();
    const inputFile = this.getInputFile();
    execSync(`javac -d ${this.getDriverPath('java')} ${solutionFile}`);
    return this.spawnProcess(
      'java',
      ['-cp', 'gson-2.10.1.jar:.', 'JavaRunner', inputFile.replace('./', resolve('./') + '/')],
      {
        cwd: this.getDriverPath('java'),
      }
    );
  }
} 
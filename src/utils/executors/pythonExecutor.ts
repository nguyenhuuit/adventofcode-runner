import { ChildProcess } from 'child_process';

import { Executor } from './executor';

export class PythonExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFilePath();
    const inputFile = this.getInputFilePath();
    const driverPath = this.getDriverPath();
    return this.spawnProcess('python3', ['-u', driverPath + '/python.py', solutionFile, inputFile]);
  }
}

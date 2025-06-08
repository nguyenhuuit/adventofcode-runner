import { ChildProcess } from 'child_process';

import { Executor } from './executor';

export class RubyExecutor extends Executor {
  execute(): ChildProcess {
    const solutionFile = this.getSolutionFilePath();
    const inputFile = this.getInputFilePath();
    const driverPath = this.getDriverPath();
    return this.spawnProcess('ruby', [driverPath + '/ruby.rb', solutionFile, inputFile]);
  }
}

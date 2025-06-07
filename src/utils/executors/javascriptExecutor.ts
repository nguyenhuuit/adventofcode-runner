import { ChildProcess } from 'child_process';
import { Executor } from './executor';

export class JavascriptExecutor extends Executor {
  execute(): ChildProcess {
    return this.spawnProcess(
      'node',
      [
        this.getDriverPath('javascript') + '/javascript.js',
        this.state.year,
        this.state.day,
        this.state.part,
        this.state.inputMode,
      ]
    );
  }
} 
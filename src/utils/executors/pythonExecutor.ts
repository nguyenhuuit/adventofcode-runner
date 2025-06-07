import { ChildProcess } from 'child_process';
import { Executor } from './executor';

export class PythonExecutor extends Executor {
  execute(): ChildProcess {
    return this.spawnProcess('python3', [
      '-u',
      this.getDriverPath('python') + '/python.py',
      this.state.year,
      this.state.day,
      this.state.part,
      this.state.inputMode,
    ]);
  }
} 
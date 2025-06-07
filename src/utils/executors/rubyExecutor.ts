import { ChildProcess } from 'child_process';
import { Executor } from './executor';

export class RubyExecutor extends Executor {
  execute(): ChildProcess {
    return this.spawnProcess(
      'ruby',
      [
        this.getDriverPath('ruby') + '/ruby.rb',
        this.state.year,
        this.state.day,
        this.state.part,
        this.state.inputMode,
      ]
    );
  }
} 
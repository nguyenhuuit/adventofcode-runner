import { executeAsStream } from "../utils/executors.js"

interface ExecuteHookInput {
  onOutput: Function
  onResult: Function
  onExecutionTime: Function
  onStart?: Function
  onExit?: Function
  onClose?: Function
}

export const useExecuteAsStream = ({ onOutput, onResult, onExecutionTime, onStart, onExit, onClose }: ExecuteHookInput): any => {
  const execute = (state: ExecutionInput) => {
    onStart && onStart()
    const childProcess = executeAsStream(state)
    childProcess.on("message", (msg: any) => {
      onResult(msg.result)
      onExecutionTime(msg.time)
    })
    childProcess.on("close", () => {
      onClose && onClose()
    })
    childProcess.on("exit", data => {
      if (data !== 0) {
        onResult('-')
        onExecutionTime('-')
      }
      onExit && onExit()
    })
    if (childProcess.stdout) {
      childProcess.stdout.setEncoding('utf8');
      childProcess.stdout.on('data', function(data) {
        onOutput(data.toString())
      })
    }
    if (childProcess.stderr) {
      childProcess.stderr.setEncoding('utf8');
      childProcess.stderr.on('data', function(data) {
        onOutput(data.toString())
      })
    }
  }
  return execute
}
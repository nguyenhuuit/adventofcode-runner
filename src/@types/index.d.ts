interface AppState {
  year: string
  day: string
  part: string
  language: string
  inputMode: string
  answer: string
  output: string
}

type ExecutionInput = Pick<AppState, "year" | "day" | "part" | "inputMode" | "language">

interface AppFile {
  name: string
  size: number
}

interface AppProfile {
  userName?: string
  star?: string
}

interface ExecutionResult {
  stdout: string
  stderr: string
  error: any
}
interface PromtOptions {
  year?: string;
  day?: string;
  part?: string;
  language?: string;
}

interface AppState {
  year: string;
  day: string;
  part: string;
  language: string;
  inputMode: string;
  answer: string;
  output: string;
  baseDir: string;
}

type ExecutionInput = Pick<
  AppState,
  'year' | 'day' | 'part' | 'inputMode' | 'language' | 'baseDir'
>;

interface AppFile {
  name: string;
  size: number;
}

interface AppProfile {
  userName?: string;
  star?: string;
}

interface ExecuteOptions {
  solutionFile: string;
  inputFile: string;
  baseDir: string;
  language: string;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  error: unknown;
}

interface StringFunction {
  (input: string): void;
}

interface BooleanFunction {
  (input: boolean): void;
}

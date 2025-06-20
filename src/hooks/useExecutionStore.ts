import { StoreApi, UseBoundStore, create } from 'zustand';

import { InputMode } from '@utils/constants';
import { EXTENSIONS } from '@utils/languages';

interface ExecutionState {
  year: string;
  day: string;
  part: string;
  language: string;
  baseDir: string;
  inputMode: InputMode;
  output: string;
  answer: string;
  perfLog: string;
  loading: boolean;
}

interface ExecutionActions {
  setInputMode: (inputMode: InputMode) => void;
  setPart: StringFunction;
  setOutput: StringFunction;
  clearOutput: Function;
  appendOutput: StringFunction;
  setAnswer: StringFunction;
  setPerfLog: StringFunction;
  setLoading: BooleanFunction;
  getRelativeDir: () => string;
  getSolutionFile: () => string;
  getInputFile: () => string;
}

export type ExecutionStore = ExecutionState & ExecutionActions;

export type ExecutionStoreInstance = UseBoundStore<StoreApi<ExecutionStore>>;

export const createExecutionStore = (
  promptInput: Required<PromtOptions> & { baseDir: string; inputMode?: InputMode }
) =>
  create<ExecutionStore>((set, get) => ({
    inputMode: promptInput.inputMode ?? InputMode.SAMPLE,
    output: '',
    answer: '',
    perfLog: '',
    loading: false,
    ...promptInput,
    setInputMode: (inputMode) => set({ inputMode }),
    setPart: (part) => set({ part }),
    setOutput: (output) => set({ output }),
    clearOutput: () => set({ output: '' }),
    appendOutput: (output) => set((state) => ({ output: state.output + output })),
    setAnswer: (answer) => set({ answer }),
    setPerfLog: (perfLog) => set({ perfLog }),
    setLoading: (loading) => set({ loading }),
    getRelativeDir: () => `./${get().year}/day${get().day}/`,
    getSolutionFile: () =>
      `./${get().year}/day${get().day}/part${get().part}.${EXTENSIONS[get().language]}`,
    getInputFile: () => `./${get().year}/day${get().day}/${get().inputMode}.txt`,
  }));

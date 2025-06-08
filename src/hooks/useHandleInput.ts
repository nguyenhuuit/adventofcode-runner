import { useStore } from 'zustand';

import { useCallback } from 'react';

import type { Key } from 'ink';
import { useInput } from 'ink';

import { HELP_MESSAGE } from '@utils/constants';
import { terminate } from '@utils/execute';

import { useExecuteAsStream } from './useExecuteAsStream';
import { ExecutionStoreInstance } from './useExecutionStore';
import { useSubmit } from './useSubmit';

export const useHandleInput = (executionStore: ExecutionStoreInstance) => {
  const { inputMode, part, loading, setInputMode, setPart, setOutput, appendOutput, clearOutput } =
    useStore(executionStore);

  const executeSolution = useExecuteAsStream(executionStore);

  const submit = useSubmit(executionStore);

  const handleInput = useCallback(
    async (input: string, key: Key) => {
      switch (input.toLowerCase()) {
        case 'q': {
          terminate();
          process.exit();
          break; // Unreachable but satisfies eslint god
        }
        case 'i': {
          setInputMode('input');
          break;
        }
        case 's': {
          setInputMode('sample');
          break;
        }
        case 'c':
          clearOutput();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          setPart(input);
          break;
        }
        case 'x': {
          if (loading) {
            terminate();
            setTimeout(() => setOutput('Terminated!'), 100);
          }
          break;
        }
        case 'h': {
          setOutput(HELP_MESSAGE);
          break;
        }
        case 'u': {
          submit();
          break;
        }
      }
      if (key.downArrow) {
        setInputMode('input');
      }
      if (key.upArrow) {
        setInputMode('sample');
      }
      if (key.return) {
        executeSolution();
      }
    },
    [
      part,
      inputMode,
      loading,
      setInputMode,
      setPart,
      setOutput,
      appendOutput,
      clearOutput,
      executeSolution,
      submit,
    ]
  );

  useInput(handleInput);
};

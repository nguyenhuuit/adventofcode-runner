import { useStore } from 'zustand';

import { useCallback } from 'react';

import { type Key, useInput } from 'ink';

import { TrackingEvent } from '@utils/analytics';
import { HELP_MESSAGE, InputMode } from '@utils/constants';
import { Executor } from '@utils/executors';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { ExecutionStoreInstance } from '@hooks/useExecutionStore';
import { useSubmit } from '@hooks/useSubmit';
import { useTelemetry } from '@hooks/useTelemetry';

export const useHandleInput = (executionStore: ExecutionStoreInstance) => {
  const { inputMode, part, loading, setInputMode, setPart, setOutput, appendOutput, clearOutput } =
    useStore(executionStore);

  const executeSolution = useExecuteAsStream(executionStore);

  const { submit } = useSubmit(executionStore);
  const { track } = useTelemetry(executionStore);

  const handleInput = useCallback(
    async (input: string, key: Key) => {
      // Track the key press
      let payload = {};
      if (key.return) {
        payload = { key: 'enter' };
      } else if (key.upArrow) {
        payload = { key: 'up' };
      } else if (key.downArrow) {
        payload = { key: 'down' };
      } else if (input) {
        payload = { key: input.toLowerCase() };
      } else {
        payload = { key: 'unknown' };
      }
      track(TrackingEvent.KEY_PRESS, payload);

      switch (input.toLowerCase()) {
        case 'q': {
          Executor.terminate();
          process.exit();
          break; // Unreachable but satisfies eslint god
        }
        case 'i': {
          setInputMode(InputMode.INPUT);
          break;
        }
        case 's': {
          setInputMode(InputMode.SAMPLE);
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
            Executor.terminate();
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
        default: {
          if (key.downArrow) {
            setInputMode(InputMode.INPUT);
          }
          if (key.upArrow) {
            setInputMode(InputMode.SAMPLE);
          }
          if (key.return) {
            executeSolution();
          }
          break;
        }
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
      track,
    ]
  );

  useInput(handleInput);
};

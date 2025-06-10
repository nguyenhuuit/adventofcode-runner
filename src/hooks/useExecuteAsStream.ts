import { useStore } from 'zustand';

import { useCallback } from 'react';

import { executeAsStream } from '@utils/execute';

import { ExecutionStoreInstance } from '@hooks/useExecutionStore';

interface ProcessMessage {
  result: string;
  time: string;
}

export const useExecuteAsStream = (executionStore: ExecutionStoreInstance) => {
  const { baseDir, language, setAnswer, setPerfLog, setLoading, appendOutput, clearOutput } =
    useStore(executionStore);

  const execute = useCallback(() => {
    const solutionFile = executionStore.getState().getSolutionFile();
    const inputFile = executionStore.getState().getInputFile();
    if (!solutionFile || !inputFile) {
      return;
    }
    setLoading(true);
    clearOutput();
    const childProcess = executeAsStream({ solutionFile, inputFile, language, baseDir });
    childProcess.on('message', (msg: ProcessMessage) => {
      setAnswer(msg.result + '');
      setPerfLog(msg.time);
    });
    childProcess.on('close', () => {
      // do nothing, we handle the exit event;
    });
    childProcess.on('exit', (data) => {
      if (data !== 0) {
        setAnswer('-');
        setPerfLog('-');
      }
      setLoading(false);
    });
    if (childProcess.stdout) {
      childProcess.stdout.setEncoding('utf8');
      childProcess.stdout.on('data', function (data) {
        const dataStr = data.toString();
        if (dataStr.startsWith('Command failed')) {
          setAnswer('-');
          setPerfLog('-');
        }
        appendOutput(dataStr);
      });
    }
    if (childProcess.stderr) {
      childProcess.stderr.setEncoding('utf8');
      childProcess.stderr.on('data', function (data) {
        appendOutput(data.toString());
      });
    }
  }, []);
  return execute;
};

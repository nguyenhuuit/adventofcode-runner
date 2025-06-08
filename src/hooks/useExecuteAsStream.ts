import { useStore } from 'zustand';

import { useEffect } from 'react';

import { executeAsStream } from '@utils/execute';

import { ExecutionStoreInstance } from './useExecutionStore';

interface ProcessMessage {
  result: string;
  time: string;
}

export const useExecuteAsStream = (executionStore: ExecutionStoreInstance) => {
  const { baseDir, language, setAnswer, setPerfLog, setLoading, appendOutput, clearOutput } =
    useStore(executionStore);
  const solutionFile = executionStore.getState().getSolutionFile();
  const inputFile = executionStore.getState().getInputFile();
  const execute = () => {
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
        appendOutput(data.toString());
      });
    }
    if (childProcess.stderr) {
      childProcess.stderr.setEncoding('utf8');
      childProcess.stderr.on('data', function (data) {
        appendOutput(data.toString());
      });
    }
  };
  useEffect(() => {
    execute();
  }, [solutionFile, inputFile]);
  return execute;
};

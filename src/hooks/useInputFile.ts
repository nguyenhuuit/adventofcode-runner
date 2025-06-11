import fs from 'fs';
import { useStore } from 'zustand';

import { useCallback, useEffect, useState } from 'react';

import { TrackingEvent } from '@utils/analytics';
import { aocClient } from '@utils/aocClient';
import { InputMode, VALID_YEARS } from '@utils/constants';
import { logger } from '@utils/logger';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { ExecutionStoreInstance } from '@hooks/useExecutionStore';
import { useTelemetry } from '@hooks/useTelemetry';
import { useWatcher } from '@hooks/useWatcher';

export const useInputFile = (executionStore: ExecutionStoreInstance): AppFile => {
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  const { year, day, inputMode, getRelativeDir, getInputFile } = useStore(executionStore);
  const relativeDir = getRelativeDir();
  const inputFileName = getInputFile();
  const { track } = useTelemetry(executionStore);

  const executeSolution = useExecuteAsStream(executionStore);

  const handleFileChange = useCallback(() => {
    executeSolution();
  }, [executeSolution]);

  useWatcher({ filePath: name, onChange: handleFileChange });

  useEffect(() => {
    if (!fs.existsSync(relativeDir)) {
      fs.mkdirSync(relativeDir, { recursive: true });
    }
    if (!fs.existsSync(inputFileName)) {
      let data = '';
      fs.writeFileSync(inputFileName, data, { flag: 'as+' });
    }
    const stats = fs.statSync(inputFileName);
    setName(inputFileName);
    setSize(stats.size);
    if (!VALID_YEARS.includes(year)) {
      return;
    }
    if (stats.size === 0 && inputMode === InputMode.INPUT) {
      aocClient
        .fetchInput(year, day)
        .then((data) => {
          if (data) {
            fs.writeFileSync(inputFileName, data);
            const stats = fs.statSync(inputFileName);
            setSize(stats.size);
            track(TrackingEvent.INPUT_FETCH, { success: true });
          }
        })
        .catch((error) => {
          track(TrackingEvent.INPUT_FETCH, { success: false });
          logger.error(`Failed to fetch input: ${error}`);
        });
    }
    if (stats.size === 0 && inputMode === InputMode.SAMPLE) {
      aocClient
        .fetchProblem(year, day)
        .then((html) => {
          if (html) {
            const sampleInput = aocClient.extractSampleInput(html);
            if (sampleInput) {
              fs.writeFileSync(inputFileName, sampleInput);
              const stats = fs.statSync(inputFileName);
              setSize(stats.size);
              track(TrackingEvent.SAMPLE_FETCH, { success: true });
            }
          }
        })
        .catch((error) => {
          track(TrackingEvent.SAMPLE_FETCH, { success: true });
          logger.error(`Failed to fetch problem: ${error}`);
        });
    }
  }, [relativeDir, inputFileName, year, day, inputMode, track]);

  return { name, size };
};

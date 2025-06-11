import chalk from 'chalk';
import { useStore } from 'zustand';

import { useCallback } from 'react';

import { TrackingEvent } from '@utils/analytics';
import { aocClient } from '@utils/aocClient';
import { logger } from '@utils/logger';

import { ExecutionStoreInstance } from '@hooks/useExecutionStore';
import { useTelemetry } from '@hooks/useTelemetry';

export const useSubmit = (executionStore: ExecutionStoreInstance) => {
  const { year, day, answer, setAnswer, setOutput, part } = useStore(executionStore);
  const { track } = useTelemetry(executionStore);

  const submit = useCallback(async () => {
    if (!answer) return;
    try {
      const result = await aocClient.submitAnswer(year, day, parseInt(part, 10), answer);
      logger.debug(`Submit result: ${JSON.stringify(result)}`);

      // Track submission result
      track(TrackingEvent.SUBMISSION, { success: result.correct });

      if (result.correct) {
        setOutput(chalk.bold(chalk.greenBright('Right answer! 🤩')));
      } else {
        let output = chalk.bold(chalk.red('Wrong answer! 🥹'));
        if (result.waitingTime) {
          output += chalk.bold(chalk.redBright(`  Waiting ${result.waitingTime} ⏳`));
        }
        setOutput(output);
      }
      setAnswer(result.message);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit answer';
      setAnswer(errorMessage);
      setOutput(chalk.bold(chalk.red(`Cannot submit answer: ${errorMessage}`)));
      // Track failed submission
      track(TrackingEvent.SUBMISSION, { success: false });
      throw error;
    }
  }, [year, day, part, answer, track]);

  return { submit };
};

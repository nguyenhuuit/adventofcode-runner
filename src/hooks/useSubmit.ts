import chalk from 'chalk';
import { useStore } from 'zustand';

import { useCallback } from 'react';

import axios from '@utils/axios';

import { ExecutionStoreInstance } from './useExecutionStore';

export const useSubmit = (executionStore: ExecutionStoreInstance): (() => Promise<void>) => {
  const { year, day, part, answer, setLoading, setOutput } = useStore(executionStore);

  const submit = useCallback<() => Promise<void>>(async () => {
    setLoading(true);
    try {
      const url = `/${year}/day/${day}/answer`;
      const data = `level=${part}&answer=${answer}`;

      if (!axios) {
        throw new Error('Invalid SESSION');
      }

      const resp = await axios.post(url, data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      let matches = resp.data.match(/(That's (not )?the right answer)/);
      if (matches) {
        if (matches[1] === "That's the right answer") {
          setOutput(chalk.bold(chalk.greenBright('Right answer! 🤩')));
        } else {
          const waitingTime = resp.data.match(/please wait (.*) before/);
          if (waitingTime) {
            setOutput(
              chalk.bold(chalk.red('Wrong answer! 🥹')) +
                chalk.bold(chalk.redBright(` Waiting ${waitingTime[1]} ⏳`))
            );
          } else {
            setOutput(chalk.bold(chalk.red('Wrong answer! 🥹')));
          }
        }
        return;
      }

      matches = resp.data.match(/You have (.*) left to wait/);
      if (matches) {
        setOutput(
          chalk.bold(chalk.red('Wrong answer! 🥹')) +
            chalk.bold(chalk.redBright(` Waiting ${matches[1]} ⏳`))
        );
        return;
      }

      throw new Error('Unknown response');
    } catch (err: unknown) {
      setOutput(chalk.bold(chalk.red(`Cannot submit answer: ${err}`)));
    } finally {
      setLoading(false);
    }
  }, [year, day, part, answer, setLoading, setOutput]);

  return submit;
};

import chalk from 'chalk';
import chokidar, { FSWatcher } from 'chokidar';
import { EventEmitter } from 'events';

import React, { useEffect, useState } from 'react';

import { Box, Text, useApp, useInput } from 'ink';

import type { Key } from 'ink';

import { terminate } from '@utils/execute';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { useInputFile } from '@hooks/useInputFile';
import { useSolutionFile } from '@hooks/useSolutionFile';
import { useSubmit } from '@hooks/useSubmit';
import { useYearInfo } from '@hooks/useYearInfo';

import Spinner from '@components/Spinner';
import { HELP_MESSAGE } from '@components/constants';
import { useVsCode } from '@hooks/useVsCode';

const watcher = chokidar.watch([]) as FSWatcher & EventEmitter;

type Props = {
  state: AppState;
};

const App = ({ state }: Props) => {
  const { baseDir } = state;
  const { exit } = useApp();
  const { openFile } = useVsCode();

  const [tsUserName, setTsUserName] = useState<number>(0);
  const { userName, star } = useYearInfo(state.year, tsUserName);

  const [inputMode, setInputMode] = useState(state.inputMode);
  const [part, setPart] = useState(state.part);
  const [output, setOutput] = useState(state.output);
  const [answer, setAnswer] = useState<string>('');
  const [perfLog, setPerfLog] = useState('');
  const [loading, setLoading] = useState(false);

  const [tsSolutionFile, setTsSolutionFile] = useState<number>(0);
  const { name: solutionFileName, size: solutionFileSize } = useSolutionFile(
    state.year,
    state.day,
    part,
    state.language,
    tsSolutionFile
  );
  const [tsInputFile, setTsInputFile] = useState(0);
  const { name: inputFileName, size: inputFileSize } = useInputFile(
    state.year,
    state.day,
    inputMode,
    tsInputFile
  );

  const executeSolution = useExecuteAsStream({
    baseDir,
    onOutput: (s: string) => setOutput((current: string) => (current ? current + s : s)),
    onResult: (s: string) => setAnswer(s),
    onExecutionTime: (s: string) => setPerfLog(s),
    onStart: () => {
      setLoading(true);
      setOutput('');
    },
    onExit: () => setLoading(false),
  });

  const submit = useSubmit(state.year, state.day, part, answer);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { correct, waitingTime } = await submit();
      let msg = correct
        ? chalk.bold(chalk.greenBright('Right answer! 🤩'))
        : chalk.bold(chalk.red('Wrong answer! 🥹'));
      if (waitingTime) {
        msg += chalk.bold(chalk.redBright(` Waiting ${waitingTime} ⏳`));
      }
      setOutput(msg);
      setTsUserName((s: number) => s + 1);
    } catch (err: unknown) {
      setOutput(chalk.bold(chalk.red(`Cannot submit answer: ${err}`)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!solutionFileName) return;
    watcher.add(solutionFileName);
    watcher.removeAllListeners('change');
    watcher.on('change', async () => {
      const s = { year: state.year, day: state.day, part, inputMode, language: state.language };
      setTsSolutionFile((s: number) => s + 1);
      executeSolution(s);
    });
    openFile(solutionFileName);
    return () => {
      watcher.unwatch(solutionFileName);
    };
  }, [solutionFileName]);
  useEffect(() => {
    if (!inputFileName) return;
    watcher.add(inputFileName);
    watcher.removeAllListeners('change');
    watcher.on('change', async () => {
      const s = { year: state.year, day: state.day, part, inputMode, language: state.language };
      setTsInputFile((s: number) => s + 1);
      executeSolution(s);
    });
    return () => {
      watcher.unwatch(inputFileName);
    };
  }, [inputFileName]);

  useInput(async (input: string, key: Key) => {
    switch (input.toLowerCase()) {
      case 'q': {
        terminate();
        exit();
        process.exit();
        break; // Unreachable but satisfies eslint god
      }
      case 'i': {
        setInputMode('input');
        const s = {
          year: state.year,
          day: state.day,
          part,
          inputMode: 'input',
          language: state.language,
        };
        executeSolution(s);
        break;
      }
      case 's': {
        setInputMode('sample');
        const s = {
          year: state.year,
          day: state.day,
          part,
          inputMode: 'sample',
          language: state.language,
        };
        executeSolution(s);
        break;
      }
      case 'c':
        setOutput('');
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
        const s = {
          year: state.year,
          day: state.day,
          part: input,
          inputMode,
          language: state.language,
        };
        executeSolution(s);
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
        handleSubmit();
        break;
      }
    }
    if (key.downArrow) {
      setInputMode('input');
      const s = {
        year: state.year,
        day: state.day,
        part,
        inputMode: 'input',
        language: state.language,
      };
      executeSolution(s);
    }
    if (key.upArrow) {
      setInputMode('sample');
      const s = {
        year: state.year,
        day: state.day,
        part,
        inputMode: 'sample',
        language: state.language,
      };
      executeSolution(s);
    }
    if (key.return) {
      const s = { year: state.year, day: state.day, part, inputMode, language: state.language };
      executeSolution(s);
    }
  });
  useEffect(() => {
    const s = { year: state.year, day: state.day, part, inputMode, language: state.language };
    executeSolution(s);
    return () => {};
  }, []);
  return (
    <>
      <Box>
        <Text>📆 Year:</Text>
        <Text italic bold color={'#FF8800'}>
          {' '}
          {state.year}{' '}
        </Text>
        <Text>Day:</Text>
        <Text italic bold color={'#FF8800'}>
          {' '}
          {state.day}{' '}
        </Text>
        <Text>Part:</Text>
        <Text italic bold color={'#FF8800'}>
          {' '}
          {part}{' '}
        </Text>
        <Text>| 📘 Language:</Text>
        <Text italic bold color={'#FF8800'}>
          {' '}
          {state.language}{' '}
        </Text>
        {userName && (
          <>
            <Text>| 👤 Username:</Text>
            <Text italic bold color={'#FF8800'}>
              {' '}
              {userName}{' '}
            </Text>
          </>
        )}
        {star && (
          <Text italic bold color={'#FF8800'}>
            {star}⭐️{' '}
          </Text>
        )}
      </Box>
      <Box height={1} />
      <Box width={100}>
        <Box flexDirection="column" width={70}>
          <Text>{`Solution file: ${chalk.bold(chalk.magentaBright(solutionFileName.slice(2)))} ${solutionFileSize} bytes`}</Text>
          <Text>{`   Input file: ${chalk.bold(chalk.magentaBright(inputFileName.slice(2)))} ${inputFileSize} bytes`}</Text>
        </Box>
      </Box>
      <Box height={1} />
      <Box>
        <Text color="yellowBright">
          <Spinner type="earth" loading={loading} />
        </Text>
        <Text color="green">{`Result: `}</Text>
        <Text color="green" bold>
          {loading ? <Spinner type="simpleDots" loading={true} /> : answer}
        </Text>
        {answer && !loading && <Text>{`   ⏱ ${perfLog}`}</Text>}
      </Box>

      {!!output && (
        <>
          <Box height={1} />
          <Box borderTop flexDirection="column">
            <Text>{output}</Text>
          </Box>
        </>
      )}
    </>
  );
};

export default App;

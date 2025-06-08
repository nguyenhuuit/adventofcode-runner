import { useStore } from 'zustand';

import React, { useEffect, useMemo } from 'react';

import { Box } from 'ink';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { createExecutionStore } from '@hooks/useExecutionStore';
import { useHandleInput } from '@hooks/useHandleInput';
import { useInputFile } from '@hooks/useInputFile';
import { useSolutionFile } from '@hooks/useSolutionFile';
import { useYearInfo } from '@hooks/useYearInfo';

import FileSection from '@components/FileSection';
import HeaderSection from '@components/HeaderSection';
import ResultSection from '@components/ResultSection';

type Props = {
  promptInput: Required<PromtOptions> & { baseDir: string };
};

const App = ({ promptInput }: Props) => {
  const executionStore = useMemo(() => createExecutionStore(promptInput), []);

  const { year, day, language, part, output, answer, perfLog, loading } = useStore(executionStore);

  const { userName, star } = useYearInfo(executionStore);

  const { name: solutionFileName, size: solutionFileSize } = useSolutionFile(executionStore);

  const { name: inputFileName, size: inputFileSize } = useInputFile(executionStore);

  const executeSolution = useExecuteAsStream(executionStore);

  useEffect(() => {
    executeSolution();
  }, []);

  useHandleInput(executionStore);

  return (
    <>
      <HeaderSection
        year={year}
        day={day}
        part={part}
        language={language}
        userName={userName}
        star={star}
      />
      <Box height={1} />
      <FileSection
        solutionFileName={solutionFileName}
        solutionFileSize={solutionFileSize}
        inputFileName={inputFileName}
        inputFileSize={inputFileSize}
      />
      <Box height={1} />
      <ResultSection loading={loading} answer={answer} perfLog={perfLog} output={output} />
    </>
  );
};

export default App;

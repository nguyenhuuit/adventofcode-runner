import fs from 'fs';
import { useStore } from 'zustand';

import { useCallback, useEffect, useState } from 'react';

import { TEMPLATES } from '@utils/languages';

import { useExecuteAsStream } from './useExecuteAsStream';
import { ExecutionStoreInstance } from './useExecutionStore';
import { useVsCode } from './useVsCode';
import { useWatcher } from './useWatcher';

export const useSolutionFile = (executionStore: ExecutionStoreInstance): AppFile => {
  const { year, day, part, language, getRelativeDir, getSolutionFile } = useStore(executionStore);
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  const { openFile } = useVsCode();
  const relativeDir = getRelativeDir();
  const solutionFileName = getSolutionFile();

  const executeSolution = useExecuteAsStream(executionStore);

  const handleFileChange = useCallback(() => {
    executeSolution();
  }, [executeSolution]);

  useWatcher({ filePath: name, onChange: handleFileChange });

  useEffect(() => {
    if (!fs.existsSync(relativeDir)) {
      fs.mkdirSync(relativeDir, { recursive: true });
    }
    if (!fs.existsSync(solutionFileName)) {
      const template = TEMPLATES[language];
      if (template) {
        if (typeof template === 'function') {
          fs.writeFileSync(solutionFileName, template({ year, day, part }), { flag: 'as+' });
        } else {
          fs.writeFileSync(solutionFileName, template, { flag: 'as+' });
        }
      }
    }
    const stats = fs.statSync(solutionFileName);
    setName(solutionFileName);
    setSize(stats.size);
    openFile(solutionFileName);
  }, [relativeDir, solutionFileName, openFile]);

  return { name, size };
};

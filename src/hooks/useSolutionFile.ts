import { useStore } from 'zustand';

import { useCallback, useEffect, useState } from 'react';

import { FileUtil } from '@utils/file';
import { TEMPLATES } from '@utils/languages';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { ExecutionStoreInstance } from '@hooks/useExecutionStore';
import { useVsCode } from '@hooks/useVsCode';
import { useWatcher } from '@hooks/useWatcher';

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
    if (!FileUtil.exists(relativeDir)) {
      FileUtil.createDirectory(relativeDir);
    }
    if (!FileUtil.exists(solutionFileName)) {
      const template = TEMPLATES[language];
      if (template) {
        if (typeof template === 'function') {
          FileUtil.writeFile(solutionFileName, template({ year, day, part }), { flag: 'as+' });
        } else {
          FileUtil.writeFile(solutionFileName, template, { flag: 'as+' });
        }
      }
    }
    const stats = FileUtil.getFileStats(solutionFileName);
    setName(solutionFileName);
    setSize(stats.size);
    openFile(solutionFileName);
  }, [relativeDir, solutionFileName, openFile]);

  return { name, size };
};

import fs from 'fs';
import { useStore } from 'zustand';

import { useCallback, useEffect, useState } from 'react';

import axios from '@utils/axios';
import { VALID_YEARS } from '@utils/constants';

import { useExecuteAsStream } from './useExecuteAsStream';
import { ExecutionStoreInstance } from './useExecutionStore';
import { useWatcher } from './useWatcher';

const decode = (str: string) => {
  return str
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('<code>', '')
    .replaceAll('</code>', '')
    .replaceAll('<em>', '')
    .replaceAll('</em>', '');
};

const findLongest = (str: string[]) => {
  let longest = '';
  str.forEach((s: string) => {
    if (s.length > longest.length) {
      longest = s;
    }
  });
  return longest;
};

export const useInputFile = (executionStore: ExecutionStoreInstance): AppFile => {
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  const { year, day, inputMode, getRelativeDir, getInputFile } = useStore(executionStore);
  const relativeDir = getRelativeDir();
  const inputFileName = getInputFile();

  const executeSolution = useExecuteAsStream(executionStore);

  const handleFileChange = useCallback(() => {
    executeSolution();
  }, [executionStore]);

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
    if (stats.size === 0 && inputMode === 'input' && axios) {
      const url = `/${year}/day/${day}/input`;
      axios.get(url).then((res) => {
        if (res.data) {
          fs.writeFileSync(inputFileName, res.data);
          const stats = fs.statSync(inputFileName);
          setSize(stats.size);
        }
      });
    }
    if (stats.size === 0 && inputMode === 'sample' && axios) {
      const url = `/${year}/day/${day}`;
      axios.get(url).then((res) => {
        if (res.data) {
          const SAMPLE_REGEX = /<code>(<em>)?([\s\S]+?)(<\/em>)?<\/code>/g;
          const matches = res.data.match(SAMPLE_REGEX);
          if (matches) {
            fs.writeFileSync(inputFileName, decode(findLongest(matches)).trim());
            const stats = fs.statSync(inputFileName);
            setSize(stats.size);
          }
        }
      });
    }
  }, [relativeDir, inputFileName]);

  return { name, size };
};

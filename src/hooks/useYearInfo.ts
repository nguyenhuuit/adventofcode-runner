import { useStore } from 'zustand';

import { useEffect, useState } from 'react';

import { aocClient } from '@utils/aocClient';
import { VALID_YEARS } from '@utils/constants';

import { ExecutionStoreInstance } from '@hooks/useExecutionStore';

const REGEX_USERNAME = /class="user">(.+?) ?</;
const REGEX_STAR = /class="star-count">(.+?)\*</;

export const useYearInfo = (executionStore: ExecutionStoreInstance): AppProfile => {
  const year = useStore(executionStore, (state) => state.year);
  const [userName, setUserName] = useState<string | undefined>('');
  const [star, setStar] = useState<string | undefined>('');
  useEffect(() => {
    if (!VALID_YEARS.includes(year)) {
      setUserName('');
      return;
    }
    aocClient.fetchProblem(year, '1').then((html) => {
      const matchUserName = REGEX_USERNAME.exec(html);
      if (matchUserName) {
        setUserName(matchUserName[1]);
      }
      const matchStar = REGEX_STAR.exec(html);
      if (matchStar) {
        setStar(matchStar[1]);
      }
    });
  }, [year]);
  return { userName, star };
};

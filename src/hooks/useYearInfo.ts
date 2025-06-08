import { useStore } from 'zustand';

import { useEffect, useState } from 'react';

import axios from '@utils/axios';
import { VALID_YEARS } from '@utils/constants';

import { ExecutionStoreInstance } from './useExecutionStore';

const REGEX_USERNAME = /class="user">(.+?) ?</;
const REGEX_STAR = /class="star-count">(.+?)\*</;

export const useYearInfo = (executionStore: ExecutionStoreInstance): AppProfile => {
  const year = useStore(executionStore, (state) => state.year);
  const [userName, setUserName] = useState<string | undefined>('');
  const [star, setStar] = useState<string | undefined>('');
  useEffect(() => {
    if (!axios) {
      setUserName('');
      return;
    }
    const url = VALID_YEARS.includes(year) ? `/${year}` : '/';
    axios.get(url).then((res) => {
      if (res.data) {
        const matchUserName = REGEX_USERNAME.exec(res.data);
        if (matchUserName) {
          setUserName(matchUserName[1]);
        }
        const matchStar = REGEX_STAR.exec(res.data);
        if (matchStar) {
          setStar(matchStar[1]);
        }
      }
    });
  }, [year]);
  return { userName, star };
};

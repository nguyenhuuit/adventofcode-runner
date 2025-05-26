import fs from 'fs';

import { useEffect, useState } from 'react';

import axios from '@utils/axios';
import { VALID_YEARS } from '@utils/constants';

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

export const useInputFile = (year: string, day: string, inp: string, ts: number): AppFile => {
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  useEffect(() => {
    const dir = `./${year}/day${day}/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = `./${year}/day${day}/${inp}.txt`;
    if (!fs.existsSync(file)) {
      let data = '';
      fs.writeFileSync(file, data, { flag: 'as+' });
    }
    const stats = fs.statSync(file);
    setName(file);
    setSize(stats.size);
    if (!VALID_YEARS.includes(year)) {
      return;
    }
    if (stats.size === 0 && inp === 'input' && axios) {
      const url = `/${year}/day/${day}/input`;
      axios.get(url).then((res) => {
        if (res.data) {
          fs.writeFileSync(file, res.data);
          const stats = fs.statSync(file);
          setSize(stats.size);
        }
      });
    }
    if (stats.size === 0 && inp === 'sample' && axios) {
      const url = `/${year}/day/${day}`;
      axios.get(url).then((res) => {
        if (res.data) {
          const SAMPLE_REGEX = /<code>(<em>)?([\s\S]+?)(<\/em>)?<\/code>/g;
          const matches = res.data.match(SAMPLE_REGEX);
          if (matches) {
            fs.writeFileSync(file, decode(findLongest(matches)).trim());
            const stats = fs.statSync(file);
            setSize(stats.size);
          }
        }
      });
    }
  }, [year, day, inp, ts]);
  return { name, size };
};

import fs from 'fs';

import { useEffect, useState } from 'react';

import { EXTENSIONS, TEMPLATES } from '@utils/languages';

export const useSolutionFile = (
  year: string,
  day: string,
  part: string,
  language: string,
  ts: number
): AppFile => {
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  useEffect(() => {
    const dir = `./${year}/day${day}/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = `./${year}/day${day}/part${part}.${EXTENSIONS[language]}`;
    if (!fs.existsSync(file)) {
      const template = TEMPLATES[language];
      if (template) {
        if (typeof template === 'function') {
          fs.writeFileSync(file, template({ year, day, part }), { flag: 'as+' });
        } else {
          fs.writeFileSync(file, template, { flag: 'as+' });
        }
      }
    }
    const stats = fs.statSync(file);
    setName(file);
    setSize(stats.size);
  }, [year, day, part, language, ts]);
  return { name, size };
};

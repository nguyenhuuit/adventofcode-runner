import fs from 'fs'
import { EXTENSIONS, TEMPLATES } from '../utils/languages.js'
import { useEffect, useState } from 'react';

export const useSolutionFile = (year: string, day: string, part: string, language: string, ts: number): AppFile => {
  const [name, setName] = useState<string>('')
  const [size, setSize] = useState<number>(0)
  useEffect(() => {
    const dir = `./${year}/day${day}/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = `./${year}/day${day}/part${part}.${EXTENSIONS[language]}`;
    if (!fs.existsSync(file)) {
      const template = TEMPLATES[language];
      if (TEMPLATES[language]) {
        if (typeof template === 'function') {
          fs.writeFileSync(file, TEMPLATES[language]({ year, day, part }), { flag: 'as+' });
        } else {
          fs.writeFileSync(file, TEMPLATES[language], { flag: 'as+' });
        }
      }
    }
    const stats = fs.statSync(file)
    setName(file)
    setSize(stats.size);
  }, [year, day, part, language, ts]);
  return { name, size };
}
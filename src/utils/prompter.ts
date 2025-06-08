import inquirer from 'enquirer';

export const DEFAULT_LANGUAGE = 'python';

export const LANGUAGE_MAP: { [key: string]: string } = {
  Python: 'python',
  python: 'python',
  Javascript: 'javascript',
  javascript: 'javascript',
  Java: 'java',
  java: 'java',
  Golang: 'go',
  go: 'go',
  golang: 'go',
  'C++': 'cpp',
  cpp: 'cpp',
  Ruby: 'ruby',
  ruby: 'ruby',
};

export const validate = async (opts: PromtOptions) => {
  let { year, day, part, language } = opts;
  if (!language) {
    const selectedLanguage: { language: string } = await inquirer.prompt({
      type: 'select',
      name: 'language',
      message: 'Select programming language',
      choices: [
        { name: 'Python' },
        { name: 'Javascript' },
        { name: 'Java' },
        { name: 'C++' },
        { name: 'Ruby' },
        { name: 'Golang' },
      ],
    });
    language = LANGUAGE_MAP[selectedLanguage.language] || DEFAULT_LANGUAGE;
  } else {
    language = LANGUAGE_MAP[language] || DEFAULT_LANGUAGE;
  }
  if (!year) {
    const rs: Pick<PromtOptions, 'year'> = await inquirer.prompt({
      type: 'input',
      name: 'year',
      message: 'Select year',
    });
    year = rs.year;
  }
  if (!day) {
    const rs: Pick<PromtOptions, 'day'> = await inquirer.prompt({
      type: 'input',
      name: 'day',
      message: 'Select day',
    });
    day = rs.day;
  }
  if (!part) {
    const rs: { part: string } = await inquirer.prompt({
      type: 'select',
      name: 'part',
      message: 'Select part',
      choices: [{ name: 'Part 1' }, { name: 'Part 2' }],
    });
    part = rs.part === 'Part 1' ? '1' : '2';
  }
  return { year, day, part, language } as Required<PromtOptions>;
};

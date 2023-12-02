import inquirer from "enquirer";

export const LANGUAGE_MAP: { [key: string]: string} = {
  Python: 'python',
  python: 'python',
  Javascript: 'javascript',
  javascript: 'javascript',
  Java: 'java',
  java: 'java',
  go: 'go',
  golang: 'go',
  'C++': 'app'
};


export const validate = async (opts: any) => {
  let { year, day, part, language } = opts;
  if (!language) {
    language = await inquirer.prompt({
      type: "select",
      name: 'language',
      message: 'Select programming language',
      choices: [
        { name: 'Python' },
        { name: 'Javascript' },
        { name: 'Java' },
        { name: 'C++' },
      ]
    });
  }
  if (!year) {
    const rs: any = await inquirer.prompt({
      type: 'input',
      name: 'year',
      message: 'Select year',
    });
    year = rs.year
  }
  if (!day) {
    const rs: any = await inquirer.prompt({
      type: 'input',
      name: 'day',
      message: 'Select day',
    });
    day = rs.day
  }
  if (!part) {
    const rs: any = await inquirer.prompt({
      type: 'select',
      name: 'part',
      message: 'Select part',
      choices: [
        { name: 'Part 1' },
        { name: 'Part 2' },
      ]
    });
    part = (rs.part === 'Part 1' ? 1 : 2);
  }
  return { year, day, part, language };
};

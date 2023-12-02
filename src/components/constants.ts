import chalk from 'chalk'

const bg = (s: string): string => chalk.bold(chalk.greenBright(s))
const by = (s: string): string => chalk.bold(chalk.yellowBright(s))

export const HELP_MESSAGE = `Instructions:
${by('0-9')}: Run ${bg('partX')} solution         ${by('Enter')}: Re-run solution
${by('U')}  : Submit solution            ${by('X')}    : Terminate solution
${by('S')}  : Run solution with ${bg('sample')}   ${by('H')}    : Print the instructions
${by('I')}  : Run solution with ${bg('input')}    ${by('Q')}    : Quit application`
import chalk from 'chalk';

import React from 'react';

import { Box, Text } from 'ink';

interface FileSectionProps {
  solutionFileName: string;
  solutionFileSize: number;
  inputFileName: string;
  inputFileSize: number;
}

const FileSection = ({
  solutionFileName,
  solutionFileSize,
  inputFileName,
  inputFileSize,
}: FileSectionProps) => {
  return (
    <Box width={100}>
      <Box flexDirection="column" width={70}>
        <Text>{`Solution file: ${chalk.bold(chalk.magentaBright(solutionFileName.slice(2)))} ${solutionFileSize} bytes`}</Text>
        <Text>{`   Input file: ${chalk.bold(chalk.magentaBright(inputFileName.slice(2)))} ${inputFileSize} bytes`}</Text>
      </Box>
    </Box>
  );
};

export default FileSection;

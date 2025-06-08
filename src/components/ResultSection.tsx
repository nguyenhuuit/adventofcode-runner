import React from 'react';

import { Box, Text } from 'ink';

import Spinner from '@components/Spinner';

interface ResultSectionProps {
  loading: boolean;
  answer: string;
  perfLog: string;
  output: string;
}

const ResultSection = ({ loading, answer, perfLog, output }: ResultSectionProps) => {
  return (
    <>
      <Box>
        <Text color="yellowBright">
          <Spinner type="earth" loading={loading} />
        </Text>
        <Text color="green">{`Result: `}</Text>
        <Text color="green" bold>
          {loading ? <Spinner type="simpleDots" loading={true} /> : answer}
        </Text>
        {answer && !loading && <Text>{`   ⏱ ${perfLog}`}</Text>}
      </Box>

      {!!output && (
        <>
          <Box height={1} />
          <Box borderTop flexDirection="column">
            <Text>{output}</Text>
          </Box>
        </>
      )}
    </>
  );
};

export default ResultSection;

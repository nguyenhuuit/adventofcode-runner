import React from 'react';

import { Box, Text } from 'ink';

interface HeaderSectionProps {
  year: string;
  day: string;
  part: string;
  language: string;
  userName?: string;
  star?: string;
}

const HeaderSection = ({ year, day, part, language, userName, star }: HeaderSectionProps) => {
  return (
    <Box>
      <Text>📆 Year:</Text>
      <Text italic bold color={'#FF8800'}>
        {' '}
        {year}{' '}
      </Text>
      <Text>Day:</Text>
      <Text italic bold color={'#FF8800'}>
        {' '}
        {day}{' '}
      </Text>
      <Text>Part:</Text>
      <Text italic bold color={'#FF8800'}>
        {' '}
        {part}{' '}
      </Text>
      <Text>| 📘 Language:</Text>
      <Text italic bold color={'#FF8800'}>
        {' '}
        {language}{' '}
      </Text>
      {userName && (
        <>
          <Text>| 👤 Username:</Text>
          <Text italic bold color={'#FF8800'}>
            {' '}
            {userName}{' '}
          </Text>
        </>
      )}
      {star && (
        <Text italic bold color={'#FF8800'}>
          {star}⭐️{' '}
        </Text>
      )}
    </Box>
  );
};

export default HeaderSection;

import { render } from '@testing-library/react';

import React from 'react';

import FileSection from '../FileSection';

interface MockBoxProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

interface MockTextProps {
  children: React.ReactNode;
}

jest.mock('ink', () => ({
  Box: ({ children, ...props }: MockBoxProps) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Text: ({ children }: MockTextProps) => <span data-testid="text">{children}</span>,
}));

jest.mock('chalk', () => ({
  bold: (text: string) => text,
  magentaBright: (text: string) => text,
}));

describe('FileSection', () => {
  it('renders correctly with file info', () => {
    const { container } = render(
      <FileSection
        solutionFileName="./solution.ts"
        solutionFileSize={123}
        inputFileName="./input.txt"
        inputFileSize={456}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with empty file sizes', () => {
    const { container } = render(
      <FileSection
        solutionFileName="./solution.ts"
        solutionFileSize={0}
        inputFileName="./input.txt"
        inputFileSize={0}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

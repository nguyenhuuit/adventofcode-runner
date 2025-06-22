import { render } from '@testing-library/react';

import React from 'react';

import App from '../App';

// Mock all hooks
jest.mock('@hooks/useExecuteAsStream', () => ({
  useExecuteAsStream: jest.fn(() => jest.fn()),
}));

jest.mock('@hooks/useHandleInput', () => ({
  useHandleInput: jest.fn(),
}));

jest.mock('@hooks/useInputFile', () => ({
  useInputFile: jest.fn(() => ({
    name: './input.txt',
    size: 123,
  })),
}));

jest.mock('@hooks/useSolutionFile', () => ({
  useSolutionFile: jest.fn(() => ({
    name: './solution.js',
    size: 456,
  })),
}));

jest.mock('@hooks/useYearInfo', () => ({
  useYearInfo: jest.fn(() => ({
    userName: 'TestUser',
    star: '42',
  })),
}));

// Mock child components
jest.mock('@components/FileSection', () => {
  return function MockFileSection(props: object) {
    return <div data-testid="file-section" {...props} />;
  };
});

jest.mock('@components/HeaderSection', () => {
  return function MockHeaderSection(props: object) {
    return <div data-testid="header-section" {...props} />;
  };
});

jest.mock('@components/ResultSection', () => {
  return function MockResultSection(props: object) {
    return <div data-testid="result-section" {...props} />;
  };
});

// Mock ink components
interface MockBoxProps {
  children: React.ReactNode;
  height?: number;
  [key: string]: unknown;
}

jest.mock('ink', () => ({
  Box: ({ children, ...props }: MockBoxProps) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

describe('App', () => {
  const defaultProps = {
    promptInput: {
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      baseDir: './',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { container } = render(<App {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with different prompt input', () => {
    const customProps = {
      promptInput: {
        year: '2023',
        day: '25',
        part: '2',
        language: 'python',
        baseDir: '/custom/path',
      },
    };

    const { container } = render(<App {...customProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should call useHandleInput hook', () => {
    const { useHandleInput } = require('@hooks/useHandleInput');
    render(<App {...defaultProps} />);

    expect(useHandleInput).toHaveBeenCalled();
  });

  it('should call useExecuteAsStream hook', () => {
    const { useExecuteAsStream } = require('@hooks/useExecuteAsStream');
    render(<App {...defaultProps} />);

    expect(useExecuteAsStream).toHaveBeenCalled();
  });

  it('should call useYearInfo hook', () => {
    const { useYearInfo } = require('@hooks/useYearInfo');
    render(<App {...defaultProps} />);

    expect(useYearInfo).toHaveBeenCalled();
  });

  it('should call useSolutionFile hook', () => {
    const { useSolutionFile } = require('@hooks/useSolutionFile');
    render(<App {...defaultProps} />);

    expect(useSolutionFile).toHaveBeenCalled();
  });

  it('should call useInputFile hook', () => {
    const { useInputFile } = require('@hooks/useInputFile');
    render(<App {...defaultProps} />);

    expect(useInputFile).toHaveBeenCalled();
  });
});

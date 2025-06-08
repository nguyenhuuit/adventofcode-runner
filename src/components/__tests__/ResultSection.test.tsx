import { render } from '@testing-library/react';

import React from 'react';

import ResultSection from '../ResultSection';

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

jest.mock('../Spinner', () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) =>
    loading ? <div data-testid="spinner">Loading...</div> : null,
}));

describe('ResultSection', () => {
  it('renders correctly in loading state', () => {
    const { container } = render(<ResultSection loading={true} answer="" perfLog="" output="" />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with result', () => {
    const { container } = render(
      <ResultSection loading={false} answer="42" perfLog="0.5s" output="" />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with output', () => {
    const { container } = render(
      <ResultSection loading={false} answer="42" perfLog="0.5s" output="Test output" />
    );
    expect(container).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';

import React from 'react';

import HeaderSection from '../HeaderSection';

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

describe('HeaderSection', () => {
  it('renders correctly with all props', () => {
    const { container } = render(
      <HeaderSection
        year="2023"
        day="1"
        part="1"
        language="typescript"
        userName="test-user"
        star="1"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without optional props', () => {
    const { container } = render(
      <HeaderSection year="2023" day="1" part="1" language="typescript" />
    );
    expect(container).toMatchSnapshot();
  });
});

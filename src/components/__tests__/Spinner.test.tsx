import { render } from '@testing-library/react';

import React, { act } from 'react';

import Spinner from '../Spinner';

interface MockTextProps {
  children: React.ReactNode;
}

jest.mock('ink', () => ({
  Text: ({ children }: MockTextProps) => <span data-testid="text">{children}</span>,
}));

jest.mock('cli-spinners', () => ({
  dots: {
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    interval: 80,
  },
  line: {
    frames: ['-', '\\', '|', '/'],
    interval: 130,
  },
}));

describe('Spinner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render first frame when not loading', () => {
    const { container } = render(<Spinner loading={false} />);
    expect(container).toMatchSnapshot();
  });

  it('should render first frame when loading is undefined', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });

  it('should animate when loading is true', () => {
    const { container } = render(<Spinner loading={true} />);

    expect(container).toMatchSnapshot();

    act(() => {
      jest.advanceTimersByTime(80);
    });

    expect(container).toMatchSnapshot();

    act(() => {
      jest.advanceTimersByTime(80);
    });

    expect(container).toMatchSnapshot();
  });

  it('should loop back to first frame after last frame', () => {
    const { container } = render(<Spinner loading={true} />);

    for (let i = 0; i < 10; i++) {
      act(() => {
        jest.advanceTimersByTime(80);
      });
    }

    expect(container).toMatchSnapshot();
  });

  it('should use different spinner type', () => {
    const { container } = render(<Spinner type="line" loading={true} />);

    expect(container).toMatchSnapshot();

    act(() => {
      jest.advanceTimersByTime(130);
    });

    expect(container).toMatchSnapshot();
  });

  it('should stop animation when loading becomes false', () => {
    const { container, rerender } = render(<Spinner loading={true} />);

    act(() => {
      jest.advanceTimersByTime(80);
    });
    expect(container).toMatchSnapshot();

    rerender(<Spinner loading={false} />);

    expect(container).toMatchSnapshot();

    act(() => {
      jest.advanceTimersByTime(80);
    });
    expect(container).toMatchSnapshot();
  });

  it('should restart animation when loading becomes true again', () => {
    const { container, rerender } = render(<Spinner loading={false} />);

    expect(container).toMatchSnapshot();

    rerender(<Spinner loading={true} />);

    act(() => {
      jest.advanceTimersByTime(80);
    });

    expect(container).toMatchSnapshot();
  });

  it('should handle multiple timer advances', () => {
    const { container } = render(<Spinner loading={true} />);

    act(() => {
      jest.advanceTimersByTime(240); // 3 intervals
    });

    expect(container).toMatchSnapshot();
  });

  it('should use default type when type is not specified', () => {
    const { container } = render(<Spinner loading={true} />);
    expect(container).toMatchSnapshot();
  });

  it('should handle rapid loading state changes', () => {
    const { container, rerender } = render(<Spinner loading={true} />);

    act(() => {
      jest.advanceTimersByTime(80);
    });
    expect(container).toMatchSnapshot();

    rerender(<Spinner loading={false} />);
    rerender(<Spinner loading={true} />);

    expect(container).toMatchSnapshot();
  });
});

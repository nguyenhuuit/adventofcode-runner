/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';

import { act } from 'react';

import { useInput } from 'ink';

import { TrackingEvent } from '@utils/analytics';
import { HELP_MESSAGE, InputMode } from '@utils/constants';
import { Executor } from '@utils/executors';

import { createExecutionStore } from '@hooks/useExecutionStore';
import { useHandleInput } from '@hooks/useHandleInput';

jest.mock('ink', () => ({
  useInput: jest.fn(),
}));

jest.mock('@hooks/useExecuteAsStream', () => ({
  useExecuteAsStream: jest.fn(() => jest.fn()),
}));

jest.mock('@hooks/useSubmit', () => ({
  useSubmit: jest.fn(() => ({ submit: jest.fn() })),
}));

jest.mock('@hooks/useTelemetry', () => ({
  useTelemetry: jest.fn(() => ({ track: jest.fn() })),
}));

jest.mock('@utils/executors', () => ({
  Executor: {
    terminate: jest.fn(),
  },
}));

jest.mock('@utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('useHandleInput', () => {
  let mockExecutionStore: ReturnType<typeof createExecutionStore>;
  let mockUseInput: jest.MockedFunction<typeof useInput>;
  let mockHandleInput: (input: string, key: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecutionStore = createExecutionStore({
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      baseDir: './',
    });
    mockUseInput = useInput as jest.MockedFunction<typeof useInput>;
    mockUseInput.mockImplementation((handler) => {
      mockHandleInput = handler;
    });
  });

  it('should register input handler with useInput', () => {
    renderHook(() => useHandleInput(mockExecutionStore));
    expect(mockUseInput).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should track key press for enter key', () => {
    const mockTrack = jest.fn();
    const useTelemetry = require('@hooks/useTelemetry');
    useTelemetry.useTelemetry.mockReturnValue({ track: mockTrack });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', { return: true });
    });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.KEY_PRESS, { key: 'enter' });
  });

  it('should track key press for up arrow', () => {
    const mockTrack = jest.fn();
    const useTelemetry = require('@hooks/useTelemetry');
    useTelemetry.useTelemetry.mockReturnValue({ track: mockTrack });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', { upArrow: true });
    });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.KEY_PRESS, { key: 'up' });
  });

  it('should track key press for down arrow', () => {
    const mockTrack = jest.fn();
    const useTelemetry = require('@hooks/useTelemetry');
    useTelemetry.useTelemetry.mockReturnValue({ track: mockTrack });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', { downArrow: true });
    });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.KEY_PRESS, { key: 'down' });
  });

  it('should track key press for character input', () => {
    const mockTrack = jest.fn();
    const useTelemetry = require('@hooks/useTelemetry');
    useTelemetry.useTelemetry.mockReturnValue({ track: mockTrack });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('a', {});
    });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.KEY_PRESS, { key: 'a' });
  });

  it('should track key press for unknown input', () => {
    const mockTrack = jest.fn();
    const useTelemetry = require('@hooks/useTelemetry');
    useTelemetry.useTelemetry.mockReturnValue({ track: mockTrack });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', {});
    });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.KEY_PRESS, { key: 'unknown' });
  });

  it('should quit application when q is pressed', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('q', {});
    });

    expect(Executor.terminate).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalled();
    mockExit.mockRestore();
  });

  it('should set input mode to INPUT when i is pressed', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('i', {});
    });

    expect(mockExecutionStore.getState().inputMode).toBe(InputMode.INPUT);
  });

  it('should set input mode to SAMPLE when s is pressed', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('s', {});
    });

    expect(mockExecutionStore.getState().inputMode).toBe(InputMode.SAMPLE);
  });

  it('should clear output when c is pressed', () => {
    mockExecutionStore.setState({ output: 'some output' });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('c', {});
    });

    expect(mockExecutionStore.getState().output).toBe('');
  });

  it('should set part when number 0-9 is pressed', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('5', {});
    });

    expect(mockExecutionStore.getState().part).toBe('5');
  });

  it.each(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])(
    'should set part to %s when %s is pressed',
    (number) => {
      renderHook(() => useHandleInput(mockExecutionStore));

      act(() => {
        mockHandleInput(number, {});
      });

      expect(mockExecutionStore.getState().part).toBe(number);
    }
  );

  it('should terminate execution when x is pressed and loading is true', () => {
    mockExecutionStore.setState({ loading: true });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('x', {});
    });

    expect(Executor.terminate).toHaveBeenCalled();
  });

  it('should not terminate execution when x is pressed and loading is false', () => {
    mockExecutionStore.setState({ loading: false });
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('x', {});
    });

    expect(Executor.terminate).not.toHaveBeenCalled();
  });

  it('should show help message when h is pressed', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('h', {});
    });

    expect(mockExecutionStore.getState().output).toBe(HELP_MESSAGE);
  });

  it('should submit solution when u is pressed', () => {
    const mockSubmit = jest.fn();
    const useSubmit = require('@hooks/useSubmit');
    useSubmit.useSubmit.mockReturnValue({ submit: mockSubmit });

    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('u', {});
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should set input mode to INPUT when down arrow is pressed', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', { downArrow: true });
    });

    expect(mockExecutionStore.getState().inputMode).toBe(InputMode.INPUT);
  });

  it('should set input mode to SAMPLE when up arrow is pressed', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', { upArrow: true });
    });

    expect(mockExecutionStore.getState().inputMode).toBe(InputMode.SAMPLE);
  });

  it('should execute solution when enter is pressed', () => {
    const mockExecute = jest.fn();
    const useExecuteAsStream = require('@hooks/useExecuteAsStream');
    useExecuteAsStream.useExecuteAsStream.mockReturnValue(mockExecute);

    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('', { return: true });
    });

    expect(mockExecute).toHaveBeenCalled();
  });

  it('should handle case insensitive input', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    act(() => {
      mockHandleInput('I', {});
    });

    expect(mockExecutionStore.getState().inputMode).toBe(InputMode.INPUT);
  });

  it('should handle unknown input without errors', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    expect(() => {
      act(() => {
        mockHandleInput('z', {});
      });
    }).not.toThrow();
  });

  it('should handle empty input with special keys', () => {
    renderHook(() => useHandleInput(mockExecutionStore));

    expect(() => {
      act(() => {
        mockHandleInput('', { ctrl: true, meta: true });
      });
    }).not.toThrow();
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';

import { act } from 'react';

import { TrackingEvent } from '@utils/analytics';
import { aocClient } from '@utils/aocClient';
import { logger } from '@utils/logger';

import { createExecutionStore } from '@hooks/useExecutionStore';
import { useSubmit } from '@hooks/useSubmit';

jest.mock('chalk', () => ({
  bold: jest.fn((text) => `bold:${text}`),
  greenBright: jest.fn((text) => `greenBright:${text}`),
  red: jest.fn((text) => `red:${text}`),
  redBright: jest.fn((text) => `redBright:${text}`),
  yellowBright: jest.fn((text) => `yellowBright:${text}`),
}));

jest.mock('@utils/aocClient', () => ({
  aocClient: {
    submitAnswer: jest.fn(),
  },
}));

jest.mock('@utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('@hooks/useTelemetry', () => ({
  useTelemetry: jest.fn(() => ({ track: jest.fn() })),
}));

describe('useSubmit', () => {
  let mockExecutionStore: ReturnType<typeof createExecutionStore>;
  let mockSubmitAnswer: jest.MockedFunction<typeof aocClient.submitAnswer>;
  let mockTrack: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecutionStore = createExecutionStore({
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      baseDir: './',
    });
    mockSubmitAnswer = aocClient.submitAnswer as jest.MockedFunction<typeof aocClient.submitAnswer>;
    mockTrack = jest.fn();
    const useTelemetry = require('@hooks/useTelemetry');
    useTelemetry.useTelemetry.mockReturnValue({ track: mockTrack });
  });

  it('should return submit function', () => {
    const { result } = renderHook(() => useSubmit(mockExecutionStore));
    expect(result.current.submit).toBeDefined();
    expect(typeof result.current.submit).toBe('function');
  });

  it('should not submit when answer is empty', async () => {
    mockExecutionStore.setState({ answer: '' });
    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).not.toHaveBeenCalled();
    expect(mockTrack).not.toHaveBeenCalled();
  });

  it('should not submit when answer is null', async () => {
    mockExecutionStore.setState({ answer: null as any });
    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).not.toHaveBeenCalled();
    expect(mockTrack).not.toHaveBeenCalled();
  });

  it('should submit correct answer successfully', async () => {
    const mockResult = { correct: true, message: 'Correct answer!' };
    mockSubmitAnswer.mockResolvedValue(mockResult);
    mockExecutionStore.setState({ answer: '123', year: '2024', day: '1', part: '1' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '123');
    expect(logger.debug).toHaveBeenCalledWith(`Submit result: ${JSON.stringify(mockResult)}`);
    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.SUBMISSION, { success: true });
    expect(mockExecutionStore.getState().output).toBe('bold:greenBright:Right answer! 🤩');
    expect(mockExecutionStore.getState().answer).toBe('Correct answer!');
  });

  it('should handle wrong answer', async () => {
    const mockResult = { correct: false, message: 'Too low' };
    mockSubmitAnswer.mockResolvedValue(mockResult);
    mockExecutionStore.setState({ answer: '123', year: '2024', day: '1', part: '1' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '123');
    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.SUBMISSION, { success: false });
    expect(mockExecutionStore.getState().output).toBe('bold:red:Wrong answer! 🥹');
    expect(mockExecutionStore.getState().answer).toBe('Too low');
  });

  it('should handle wrong answer with waiting time', async () => {
    const mockResult = { correct: false, message: 'Rate limited', waitingTime: '5 minutes' };
    mockSubmitAnswer.mockResolvedValue(mockResult);
    mockExecutionStore.setState({ answer: '123', year: '2024', day: '1', part: '1' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '123');
    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.SUBMISSION, { success: false });
    const expectedOutput = 'bold:red:Wrong answer! 🥹' + 'bold:redBright:  Waiting 5 minutes ⏳';
    expect(mockExecutionStore.getState().output).toBe(expectedOutput);
    expect(mockExecutionStore.getState().answer).toBe('Rate limited');
  });

  it('should handle submission error', async () => {
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);
    mockSubmitAnswer.mockRejectedValue(error);
    mockExecutionStore.setState({ answer: '123', year: '2024', day: '1', part: '1' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await expect(result.current.submit()).rejects.toThrow(errorMessage);
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '123');
    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.SUBMISSION, { success: false });
    expect(mockExecutionStore.getState().output).toBe(
      'bold:red:Cannot submit answer: Network error'
    );
    expect(mockExecutionStore.getState().answer).toBe(errorMessage);
  });

  it('should handle non-Error objects', async () => {
    const error = 'String error';
    mockSubmitAnswer.mockRejectedValue(error);
    mockExecutionStore.setState({ answer: '123', year: '2024', day: '1', part: '1' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await expect(result.current.submit()).rejects.toBe(error);
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '123');
    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.SUBMISSION, { success: false });
    expect(mockExecutionStore.getState().output).toBe(
      'bold:red:Cannot submit answer: Failed to submit answer'
    );
    expect(mockExecutionStore.getState().answer).toBe('Failed to submit answer');
  });

  it('should handle different part numbers', async () => {
    const mockResult = { correct: true, message: 'Correct answer!' };
    mockSubmitAnswer.mockResolvedValue(mockResult);
    mockExecutionStore.setState({ answer: '456', year: '2023', day: '25', part: '2' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2023', '25', 2, '456');
  });

  it('should handle special characters in answer', async () => {
    const mockResult = { correct: true, message: 'Correct answer!' };
    mockSubmitAnswer.mockResolvedValue(mockResult);
    mockExecutionStore.setState({
      answer: 'answer with spaces & symbols!',
      year: '2024',
      day: '1',
      part: '1',
    });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, 'answer with spaces & symbols!');
  });

  it('should handle numeric answer as string', async () => {
    const mockResult = { correct: true, message: 'Correct answer!' };
    mockSubmitAnswer.mockResolvedValue(mockResult);
    mockExecutionStore.setState({ answer: '42', year: '2024', day: '1', part: '1' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '42');
  });

  it('should handle empty string answer', async () => {
    mockExecutionStore.setState({ answer: '' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).not.toHaveBeenCalled();
    expect(mockTrack).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only answer', async () => {
    mockExecutionStore.setState({ answer: '   ' });

    const { result } = renderHook(() => useSubmit(mockExecutionStore));

    await act(async () => {
      await result.current.submit();
    });

    expect(mockSubmitAnswer).toHaveBeenCalledWith('2024', '1', 1, '   ');
  });
});

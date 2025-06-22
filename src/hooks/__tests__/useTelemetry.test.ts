import { renderHook } from '@testing-library/react';

import { TrackingEvent, analytics } from '@utils/analytics';
import { InputMode } from '@utils/constants';

import { createExecutionStore } from '@hooks/useExecutionStore';
import { useTelemetry } from '@hooks/useTelemetry';

jest.mock('@utils/analytics', () => ({
  TrackingEvent: {
    EXECUTION: 'execution',
    SUBMISSION: 'submission',
    INPUT_FETCH: 'input_fetch',
    SAMPLE_FETCH: 'sample_fetch',
    KEY_PRESS: 'key_press',
    START_SESSION: 'start_session',
    END_SESSION: 'end_session',
  },
  analytics: {
    track: jest.fn(),
  },
}));

describe('useTelemetry', () => {
  let mockExecutionStore: ReturnType<typeof createExecutionStore>;
  let mockTrack: jest.MockedFunction<typeof analytics.track>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecutionStore = createExecutionStore({
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      baseDir: './',
    });
    mockTrack = analytics.track as jest.MockedFunction<typeof analytics.track>;
  });

  it('should return track function', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));
    expect(result.current.track).toBeDefined();
    expect(typeof result.current.track).toBe('function');
  });

  it('should track event with store context', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    result.current.track(TrackingEvent.EXECUTION, { customAttr: 'value' });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.EXECUTION, {
      customAttr: 'value',
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      inputMode: 'sample',
    });
  });

  it('should track event without additional attributes', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    result.current.track(TrackingEvent.KEY_PRESS);

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.KEY_PRESS, {
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      inputMode: 'sample',
    });
  });

  it('should track event with different store state', () => {
    mockExecutionStore.setState({
      year: '2023',
      day: '25',
      part: '2',
      language: 'python',
      inputMode: InputMode.SAMPLE,
    });

    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    result.current.track(TrackingEvent.SUBMISSION, { success: true });

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.SUBMISSION, {
      success: true,
      year: '2023',
      day: '25',
      part: '2',
      language: 'python',
      inputMode: InputMode.SAMPLE,
    });
  });

  it('should track all tracking events', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    const events = [
      TrackingEvent.EXECUTION,
      TrackingEvent.SUBMISSION,
      TrackingEvent.INPUT_FETCH,
      TrackingEvent.SAMPLE_FETCH,
      TrackingEvent.KEY_PRESS,
      TrackingEvent.START_SESSION,
      TrackingEvent.END_SESSION,
    ];

    events.forEach((event) => {
      result.current.track(event, { test: true });
    });

    expect(mockTrack).toHaveBeenCalledTimes(events.length);
    events.forEach((event) => {
      expect(mockTrack).toHaveBeenCalledWith(event, {
        test: true,
        year: '2024',
        day: '1',
        part: '1',
        language: 'javascript',
        inputMode: 'sample',
      });
    });
  });

  it('should handle complex attributes', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    const complexAttributes = {
      nested: { key: 'value' },
      array: [1, 2, 3],
      boolean: true,
      number: 42,
      string: 'test',
    };

    result.current.track(TrackingEvent.EXECUTION, complexAttributes);

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.EXECUTION, {
      ...complexAttributes,
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      inputMode: 'sample',
    });
  });

  it('should handle undefined attributes', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    result.current.track(TrackingEvent.EXECUTION, undefined);

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.EXECUTION, {
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      inputMode: 'sample',
    });
  });

  it('should handle empty attributes object', () => {
    const { result } = renderHook(() => useTelemetry(mockExecutionStore));

    result.current.track(TrackingEvent.EXECUTION, {});

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.EXECUTION, {
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      inputMode: 'sample',
    });
  });
});

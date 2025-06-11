import { useStore } from 'zustand';

import { TrackingEvent, analytics } from '@utils/analytics';

import { ExecutionStoreInstance } from '@hooks/useExecutionStore';

export const useTelemetry = (executionStore: ExecutionStoreInstance) => {
  const { year, day, part, language, inputMode } = useStore(executionStore);

  const track = (eventName: TrackingEvent, attributes?: Record<string, unknown>): void => {
    analytics.track(eventName, {
      ...attributes,
      year,
      day,
      part,
      language,
      inputMode,
    });
  };

  return { track };
};

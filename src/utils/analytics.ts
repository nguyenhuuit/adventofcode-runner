import { track as amplitudeTrack, init } from '@amplitude/analytics-node';

import { config } from '@utils/config';
import { logger } from '@utils/logger';

export enum TrackingEvent {
  EXECUTION = 'execution',
  SUBMISSION = 'submission',
  INPUT_FETCH = 'input_fetch',
  SAMPLE_FETCH = 'sample_fetch',
  KEY_PRESS = 'key_press',
}

class Analytics {
  private static instance: Analytics;

  private constructor() {
    if (!config.amplitudeApiKey) {
      logger.warn('Amplitude API key not set. Analytics will be disabled.');
      return;
    }

    init(config.amplitudeApiKey);
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public track(eventName: TrackingEvent, properties?: Record<string, unknown>): void {
    if (!config.telemetryEnabled) return;

    amplitudeTrack(
      eventName,
      {
        ...properties,

        event_type: eventName,
        time: Date.now(),
        platform: 'CLI',
        app_name: config.appName,
        app_version: config.appVersion,
      },
      {
        user_id: config.userId,
        device_id: config.deviceId,
      }
    );
  }
}

export const analytics = Analytics.getInstance();

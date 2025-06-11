import { track as amplitudeTrack, flush, init } from '@amplitude/analytics-node';
import { v4 as uuidv4 } from 'uuid';

import { config } from '@utils/config';
import { logger } from '@utils/logger';

export enum TrackingEvent {
  EXECUTION = 'execution',
  SUBMISSION = 'submission',
  INPUT_FETCH = 'input_fetch',
  SAMPLE_FETCH = 'sample_fetch',
  KEY_PRESS = 'key_press',
  START_SESSION = 'start_session',
  END_SESSION = 'end_session',
}

class Analytics {
  private static instance: Analytics;
  private sessionId: string;

  private constructor() {
    this.sessionId = uuidv4();
    if (!config.amplitudeApiKey) {
      logger.warn('Amplitude API key not set. Analytics will be disabled.');
      return;
    }

    init(config.amplitudeApiKey);
    this.track(TrackingEvent.START_SESSION);
    const exitSignals = ['SIGINT', 'SIGTERM', 'exit'];
    exitSignals.forEach((signal) => {
      process.on(signal, async () => {
        this.track(TrackingEvent.END_SESSION);
        await flush().promise;
        process.exit();
      });
    });
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
        session_id: this.sessionId,
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

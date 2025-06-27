import os from 'os';
import { v5 as uuidv5 } from 'uuid';

import {
  AOC_NAMESPACE,
  APP_AMPLITUDE_API_KEY,
  APP_DESCRIPTION,
  APP_NAME,
  APP_VERSION,
} from '@utils/constants';

export interface Config {
  sessionToken: string;
  logLevel: string;
  logDir: string;
  amplitudeApiKey: string;
  userId: string;
  deviceId: string;
  telemetryEnabled: boolean;
  appName: string;
  appVersion: string;
  appDescription: string;
}

const getMacAddress = (): string => {
  const interfaces = os.networkInterfaces();
  // Look for the first non-internal interface with a MAC address
  for (const name of Object.keys(interfaces)) {
    const networkInterface = interfaces[name];
    if (networkInterface) {
      for (const iface of networkInterface) {
        if (!iface.internal && iface.mac && iface.mac !== '00:00:00:00:00:00') {
          return iface.mac;
        }
      }
    }
  }
  return '';
};

const generateUserId = (sessionToken: string): string => {
  const input = sessionToken || getMacAddress();
  return uuidv5(input, AOC_NAMESPACE);
};

const generateDeviceId = (): string => {
  const macAddress = getMacAddress();
  return uuidv5(macAddress, AOC_NAMESPACE);
};

export const config: Config = {
  sessionToken: process.env['SESSION'] || '',
  logLevel: process.env['LOG_LEVEL'] || 'info',
  logDir: process.env['LOG_DIR'] || 'logs',
  amplitudeApiKey: APP_AMPLITUDE_API_KEY,
  userId: generateUserId(process.env['SESSION'] || ''),
  deviceId: generateDeviceId(),
  telemetryEnabled: !(process.env['DISABLE_TELEMETRY'] === 'true'),
  appName: APP_NAME,
  appVersion: APP_VERSION,
  appDescription: APP_DESCRIPTION,
};

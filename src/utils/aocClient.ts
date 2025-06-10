import axios from 'axios';

import { config } from '@utils/config';
import { APP_NAME, APP_VERSION } from '@utils/constants';
import { decode, findLongest } from '@utils/misc';

class AocClient {
  private client;

  private constructor() {
    this.client = axios.create({
      baseURL: 'https://adventofcode.com',
      headers: {
        Cookie: config.sessionToken ? `session=${config.sessionToken}` : '',
        'User-Agent': `Advent Of Code Runner (${APP_NAME}@${APP_VERSION})`,
      },
    });
  }

  private static instance: AocClient;

  public static getInstance(): AocClient {
    if (!AocClient.instance) {
      AocClient.instance = new AocClient();
    }
    return AocClient.instance;
  }

  async fetchInput(year: string, day: string): Promise<string> {
    if (!config.sessionToken) {
      throw new Error('SESSION is required to fetch input');
    }
    const response = await this.client.get(`/${year}/day/${day}/input`);
    return response.data;
  }

  async fetchProblem(year: string, day: string): Promise<string> {
    if (!config.sessionToken) {
      throw new Error('SESSION is required to fetch problem');
    }
    const response = await this.client.get(`/${year}/day/${day}`);
    return response.data;
  }

  async submitAnswer(
    year: string,
    day: string,
    part: number,
    answer: string
  ): Promise<{ correct: boolean; message: string; waitingTime?: string }> {
    if (!config.sessionToken) {
      throw new Error('SESSION is required to submit answer');
    }

    const response = await this.client.post(
      `/${year}/day/${day}/answer`,
      `level=${part}&answer=${encodeURIComponent(answer)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const html = response.data;
    const isCorrect = html.includes("That's the right answer!");
    const isTooLow = html.includes("That's not the right answer; your answer is too low.");
    const isTooHigh = html.includes("That's not the right answer; your answer is too high.");
    const isAlreadyComplete = html.includes("You don't seem to be solving the right level.");
    const isRateLimited = html.includes('You gave an answer too recently');

    let message = 'Unknown response';
    let waitingTime: string | undefined;

    if (isCorrect) {
      message = 'Correct answer!';
    } else if (isTooLow) {
      message = 'Too low';
    } else if (isTooHigh) {
      message = 'Too high';
    } else if (isAlreadyComplete) {
      message = 'Already completed';
    } else if (isRateLimited) {
      message = 'Rate limited';
      const waitingTimeMatch = html.match(/have ([0-9msh ]+) left to wait/);
      if (waitingTimeMatch) {
        waitingTime = waitingTimeMatch[1];
      }
    } else {
      message = 'Incorrect answer';
    }

    return { correct: isCorrect, message, waitingTime };
  }

  extractSampleInput(html: string): string {
    const SAMPLE_REGEX = /<code>(<em>)?([\s\S]+?)(<\/em>)?<\/code>/g;
    const matches = html.match(SAMPLE_REGEX);
    if (!matches) return '';
    return decode(findLongest(matches)).trim();
  }
}

export const aocClient = AocClient.getInstance();

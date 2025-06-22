/* eslint-disable @typescript-eslint/no-explicit-any */
import { aocClient } from '../aocClient';
import { config } from '../config';

jest.mock('axios');
jest.mock('../config', () => ({
  config: { sessionToken: 'test-session' },
}));

beforeEach(() => {
  jest.clearAllMocks();
  (config as any).sessionToken = 'test-session';
});

describe('aocClient', () => {
  describe('fetchInput', () => {
    it('fetches input successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: 'input-data' });
      (aocClient as any).client = { get: mockGet };
      const data = await aocClient.fetchInput('2022', '1');
      expect(mockGet).toHaveBeenCalledWith('/2022/day/1/input');
      expect(data).toBe('input-data');
    });

    it('throws if sessionToken is missing', async () => {
      (config as any).sessionToken = '';
      await expect(aocClient.fetchInput('2022', '1')).rejects.toThrow(
        'SESSION is required to fetch input'
      );
    });
  });

  describe('fetchProblem', () => {
    it('fetches problem successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: 'problem-html' });
      (aocClient as any).client = { get: mockGet };
      const data = await aocClient.fetchProblem('2022', '1');
      expect(mockGet).toHaveBeenCalledWith('/2022/day/1');
      expect(data).toBe('problem-html');
    });

    it('throws if sessionToken is missing', async () => {
      (config as any).sessionToken = '';
      await expect(aocClient.fetchProblem('2022', '1')).rejects.toThrow(
        'SESSION is required to fetch problem'
      );
    });
  });

  describe('submitAnswer', () => {
    const baseHtml = '<html></html>';
    const post = jest.fn();
    beforeEach(() => {
      (aocClient as any).client = { post };
      (config as any).sessionToken = 'test-session';
    });

    it('returns correct for right answer', async () => {
      post.mockResolvedValue({ data: `That's the right answer!` });
      const res = await aocClient.submitAnswer('2022', '1', 1, '42');
      expect(res).toEqual({ correct: true, message: 'Correct answer!' });
    });

    it('returns too low', async () => {
      post.mockResolvedValue({ data: `That's not the right answer; your answer is too low.` });
      const res = await aocClient.submitAnswer('2022', '1', 1, '1');
      expect(res).toEqual({ correct: false, message: 'Too low' });
    });

    it('returns too high', async () => {
      post.mockResolvedValue({ data: `That's not the right answer; your answer is too high.` });
      const res = await aocClient.submitAnswer('2022', '1', 1, '100');
      expect(res).toEqual({ correct: false, message: 'Too high' });
    });

    it('returns already completed', async () => {
      post.mockResolvedValue({ data: `You don't seem to be solving the right level.` });
      const res = await aocClient.submitAnswer('2022', '1', 2, '42');
      expect(res).toEqual({ correct: false, message: 'Already completed' });
    });

    it('returns rate limited with waiting time', async () => {
      post.mockResolvedValue({
        data: `You gave an answer too recently; you have 5m 10s left to wait.`,
      });
      const res = await aocClient.submitAnswer('2022', '1', 1, '42');
      expect(res).toEqual({ correct: false, message: 'Rate limited', waitingTime: '5m 10s' });
    });

    it('returns generic incorrect', async () => {
      post.mockResolvedValue({ data: baseHtml });
      const res = await aocClient.submitAnswer('2022', '1', 1, 'wrong');
      expect(res).toEqual({ correct: false, message: 'Incorrect answer' });
    });

    it('throws if sessionToken is missing', async () => {
      (config as any).sessionToken = '';
      await expect(aocClient.submitAnswer('2022', '1', 1, '42')).rejects.toThrow(
        'SESSION is required to submit answer'
      );
    });
  });

  it('should be a singleton', () => {
    const instance1 = require('../aocClient').aocClient;
    const instance2 = require('../aocClient').aocClient;
    expect(instance1).toBe(instance2);
  });
});

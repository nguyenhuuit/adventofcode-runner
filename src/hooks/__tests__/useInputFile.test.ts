import { renderHook } from '@testing-library/react';

import { act } from 'react';

import { aocClient } from '@utils/aocClient';
import { InputMode } from '@utils/constants';
import { FileUtil } from '@utils/file';
import { logger } from '@utils/logger';

import { createExecutionStore } from '@hooks/useExecutionStore';
import { useInputFile } from '@hooks/useInputFile';

jest.mock('@utils/file', () => ({
  FileUtil: {
    exists: jest.fn(() => true),
    createDirectory: jest.fn(() => Promise.resolve()),
    writeFile: jest.fn(() => Promise.resolve()),
    getFileStats: jest.fn(() => ({ size: 0 })),
  },
}));
jest.mock('@utils/aocClient', () => ({
  aocClient: {
    fetchInput: jest.fn(() => Promise.resolve('Mock Input')),
    fetchProblem: jest.fn(() => Promise.resolve('Mock Problem')),
  },
}));
jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));
jest.mock('@hooks/useExecuteAsStream');
jest.mock('@hooks/useTelemetry', () => ({
  useTelemetry: jest.fn(() => ({
    track: jest.fn(),
  })),
}));
jest.mock('@hooks/useExecuteAsStream', () => ({
  useExecuteAsStream: jest.fn(() => jest.fn()),
}));
jest.mock('@hooks/useWatcher', () => ({
  useWatcher: jest.fn(({ onChange }) => {
    onChange();
  }),
}));

describe('useInputFile', () => {
  describe('with inputMode as default', () => {
    const mockStore = createExecutionStore({
      year: '2023',
      day: '1',
      baseDir: './',
      part: '1',
      language: 'javascript',
    });

    const mockStoreWithInvalidYear = createExecutionStore({
      year: '2030',
      day: '1',
      baseDir: './',
      part: '1',
      language: 'javascript',
    });

    beforeEach(() => {
      jest.clearAllMocks();
      (FileUtil.exists as jest.Mock).mockImplementation((_path: string) => false);
      (FileUtil.createDirectory as jest.Mock).mockImplementation(() => {});
      (FileUtil.writeFile as jest.Mock).mockImplementation(() => {});
      (FileUtil.getFileStats as jest.Mock).mockImplementation(() => ({ size: 0 }));
    });

    it('should create directory and file if they do not exist', () => {
      renderHook(() => useInputFile(mockStore));

      expect(FileUtil.exists).toHaveBeenCalledWith('./2023/day1/');
      expect(FileUtil.createDirectory).toHaveBeenCalledWith('./2023/day1/');
      expect(FileUtil.exists).toHaveBeenCalledWith('./2023/day1/sample.txt');
      expect(FileUtil.writeFile).toHaveBeenCalledWith('./2023/day1/sample.txt', '', {
        flag: 'as+',
      });
    });

    it('should fetch problem when file is empty and input mode is default', async () => {
      const mockHtml = '<code>sample text</code>';
      (aocClient.fetchProblem as jest.Mock).mockResolvedValue(mockHtml);

      await act(async () => {
        renderHook(() => useInputFile(mockStore));
      });

      expect(aocClient.fetchProblem).toHaveBeenCalledWith('2023', '1');
      expect(FileUtil.writeFile).toHaveBeenCalledWith('./2023/day1/sample.txt', 'sample text');
    });

    it('should not fetch input if file already has content', () => {
      (FileUtil.getFileStats as jest.Mock).mockImplementation(() => ({ size: 100 }));

      renderHook(() => useInputFile(mockStore));

      expect(aocClient.fetchProblem).not.toHaveBeenCalled();
    });

    it('should handle fetch input error gracefully', async () => {
      const mockError = new Error('Failed to fetch');
      (aocClient.fetchProblem as jest.Mock).mockRejectedValue(mockError);

      await act(async () => {
        renderHook(() => useInputFile(mockStore));
      });

      expect(aocClient.fetchProblem).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should not fetch anything if year was invalid', () => {
      renderHook(() => useInputFile(mockStoreWithInvalidYear));

      expect(aocClient.fetchProblem).not.toHaveBeenCalled();
    });
  });

  describe('with inputMode as input', () => {
    const storeWithInputMode = createExecutionStore({
      year: '2023',
      day: '1',
      baseDir: './',
      part: '1',
      language: 'javascript',
      inputMode: InputMode.INPUT,
    });
    beforeEach(() => {
      jest.clearAllMocks();
      // Mock FileUtil methods
      (FileUtil.exists as jest.Mock).mockImplementation((_path: string) => false);
      (FileUtil.createDirectory as jest.Mock).mockImplementation(() => {});
      (FileUtil.writeFile as jest.Mock).mockImplementation(() => {});
      (FileUtil.getFileStats as jest.Mock).mockImplementation(() => ({ size: 0 }));
    });

    it('should create directory and file if they do not exist', () => {
      renderHook(() => useInputFile(storeWithInputMode));

      expect(FileUtil.exists).toHaveBeenCalledWith('./2023/day1/');
      expect(FileUtil.createDirectory).toHaveBeenCalledWith('./2023/day1/');
      expect(FileUtil.exists).toHaveBeenCalledWith('./2023/day1/input.txt');
      expect(FileUtil.writeFile).toHaveBeenCalledWith('./2023/day1/input.txt', '', { flag: 'as+' });
    });

    it('should fetch input when file is empty and input mode is default', async () => {
      const mockInput = 'mock input';
      (aocClient.fetchInput as jest.Mock).mockResolvedValue(mockInput);

      await act(async () => {
        renderHook(() => useInputFile(storeWithInputMode));
      });

      expect(aocClient.fetchInput).toHaveBeenCalledWith('2023', '1');
      expect(FileUtil.writeFile).toHaveBeenCalledWith('./2023/day1/input.txt', mockInput);
    });

    it('should not fetch input if file already has content', () => {
      (FileUtil.getFileStats as jest.Mock).mockImplementation(() => ({ size: 100 }));

      renderHook(() => useInputFile(storeWithInputMode));

      expect(aocClient.fetchInput).not.toHaveBeenCalled();
    });

    it('should handle fetch input error gracefully', async () => {
      const mockError = new Error('Failed to fetch');
      (aocClient.fetchInput as jest.Mock).mockRejectedValue(mockError);

      await act(async () => {
        renderHook(() => useInputFile(storeWithInputMode));
      });

      expect(aocClient.fetchInput).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});

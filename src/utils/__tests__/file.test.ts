import fs from 'fs';

import { FileUtil } from '../file';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('FileUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exists', () => {
    it('should return true when file exists', () => {
      mockFs.existsSync.mockReturnValue(true);

      const result = FileUtil.exists('/path/to/file.txt');

      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
    });

    it('should return false when file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = FileUtil.exists('/path/to/nonexistent.txt');

      expect(result).toBe(false);
      expect(mockFs.existsSync).toHaveBeenCalledWith('/path/to/nonexistent.txt');
    });
  });

  describe('createDirectory', () => {
    it('should create directory with recursive option', () => {
      FileUtil.createDirectory('/path/to/new/directory');

      expect(mockFs.mkdirSync).toHaveBeenCalledWith('/path/to/new/directory', { recursive: true });
    });

    it('should handle empty path', () => {
      FileUtil.createDirectory('');

      expect(mockFs.mkdirSync).toHaveBeenCalledWith('', { recursive: true });
    });
  });

  describe('writeFile', () => {
    it('should write file with default options', () => {
      const path = '/path/to/file.txt';
      const data = 'Hello, World!';

      FileUtil.writeFile(path, data);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(path, data, undefined);
    });

    it('should write file with custom options', () => {
      const path = '/path/to/file.txt';
      const data = 'Hello, World!';
      const options = { encoding: 'utf8' as const };

      FileUtil.writeFile(path, data, options);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(path, data, options);
    });

    it('should handle empty data', () => {
      const path = '/path/to/file.txt';
      const data = '';

      FileUtil.writeFile(path, data);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(path, data, undefined);
    });
  });

  describe('getFileStats', () => {
    it('should return file stats', () => {
      const mockStats = {
        isFile: () => true,
        isDirectory: () => false,
        size: 1024,
        mtime: new Date(),
      } as fs.Stats;

      mockFs.statSync.mockReturnValue(mockStats);

      const result = FileUtil.getFileStats('/path/to/file.txt');

      expect(result).toBe(mockStats);
      expect(mockFs.statSync).toHaveBeenCalledWith('/path/to/file.txt');
    });

    it('should handle directory stats', () => {
      const mockStats = {
        isFile: () => false,
        isDirectory: () => true,
        size: 0,
        mtime: new Date(),
      } as fs.Stats;

      mockFs.statSync.mockReturnValue(mockStats);

      const result = FileUtil.getFileStats('/path/to/directory');

      expect(result).toBe(mockStats);
      expect(mockFs.statSync).toHaveBeenCalledWith('/path/to/directory');
    });
  });
});

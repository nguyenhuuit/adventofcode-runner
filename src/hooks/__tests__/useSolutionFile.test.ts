import { renderHook } from '@testing-library/react';
import { create } from 'zustand';

import { InputMode } from '@utils/constants';
import { FileUtil } from '@utils/file';
import { TEMPLATES } from '@utils/languages';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { ExecutionStore } from '@hooks/useExecutionStore';
import { useSolutionFile } from '@hooks/useSolutionFile';
import { useVsCode } from '@hooks/useVsCode';

jest.mock('@utils/file', () => ({
  FileUtil: {
    exists: jest.fn(() => true),
    createDirectory: jest.fn(() => Promise.resolve()),
    writeFile: jest.fn(() => Promise.resolve()),
    getFileStats: jest.fn(() => ({ size: 0 })),
  },
}));
jest.mock('@utils/languages', () => ({
  TEMPLATES: {
    typescript: 'console.log("Hello World");',
  },
}));
jest.mock('@hooks/useVsCode', () => ({
  useVsCode: jest.fn(() => ({
    openFile: jest.fn(),
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

describe('useSolutionFile', () => {
  const mockExecutionStore = create<ExecutionStore>(() => ({
    year: '2023',
    day: '1',
    part: '1',
    language: 'typescript',
    baseDir: '/base',
    inputMode: InputMode.SAMPLE,
    output: '',
    answer: '',
    perfLog: '',
    loading: false,
    setInputMode: () => {},
    setPart: () => {},
    setOutput: () => {},
    clearOutput: () => {},
    appendOutput: () => {},
    setAnswer: () => {},
    setPerfLog: () => {},
    setLoading: () => {},
    getRelativeDir: () => '/2023/01',
    getSolutionFile: () => '/2023/01/part1.ts',
    getInputFile: () => '/2023/01/sample.txt',
  }));

  const mockOpenFile = jest.fn();
  const mockExecuteSolution = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVsCode as jest.Mock).mockReturnValue({ openFile: mockOpenFile });
    (useExecuteAsStream as jest.Mock).mockReturnValue(mockExecuteSolution);
    (FileUtil.exists as jest.Mock).mockImplementation((_path: string) => false);
    (FileUtil.createDirectory as jest.Mock).mockImplementation(() => {});
    (FileUtil.writeFile as jest.Mock).mockImplementation(() => {});
    (FileUtil.getFileStats as jest.Mock).mockImplementation(() => ({ size: 100 }));
  });

  it('should create directory and solution file if they do not exist', () => {
    renderHook(() => useSolutionFile(mockExecutionStore));

    expect(FileUtil.exists).toHaveBeenCalledWith('/2023/01');
    expect(FileUtil.createDirectory).toHaveBeenCalledWith('/2023/01');
    expect(FileUtil.exists).toHaveBeenCalledWith('/2023/01/part1.ts');
    expect(FileUtil.writeFile).toHaveBeenCalledWith(
      '/2023/01/part1.ts',
      'console.log("Hello World");',
      { flag: 'as+' }
    );
  });

  it('should use template function if provided', () => {
    const templateFn = jest.fn().mockReturnValue('custom template');
    TEMPLATES['typescript'] = templateFn;

    renderHook(() => useSolutionFile(mockExecutionStore));

    expect(templateFn).toHaveBeenCalledWith({
      year: '2023',
      day: '1',
      part: '1',
    });
    expect(FileUtil.writeFile).toHaveBeenCalledWith('/2023/01/part1.ts', 'custom template', {
      flag: 'as+',
    });
  });

  it('should not create files if they already exist', () => {
    (FileUtil.exists as jest.Mock).mockReturnValue(true);

    renderHook(() => useSolutionFile(mockExecutionStore));

    expect(FileUtil.createDirectory).not.toHaveBeenCalled();
    expect(FileUtil.writeFile).not.toHaveBeenCalled();
  });

  it('should open the solution file in VS Code', () => {
    renderHook(() => useSolutionFile(mockExecutionStore));

    expect(mockOpenFile).toHaveBeenCalledWith('/2023/01/part1.ts');
  });

  it('should return file name and size', () => {
    const { result } = renderHook(() => useSolutionFile(mockExecutionStore));

    expect(result.current).toEqual({
      name: '/2023/01/part1.ts',
      size: 100,
    });
  });

  it('should execute solution when file changes', () => {
    renderHook(() => useSolutionFile(mockExecutionStore));

    expect(mockExecuteSolution).toHaveBeenCalled();
  });
});

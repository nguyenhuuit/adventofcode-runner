import { renderHook } from '@testing-library/react';
import { exec } from 'child_process';

import { act } from 'react';

import { useVsCode } from '@hooks/useVsCode';

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('useVsCode', () => {
  let mockExec: jest.MockedFunction<typeof exec>;
  let originalTermProgram: string | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExec = exec as jest.MockedFunction<typeof exec>;
    originalTermProgram = process.env['TERM_PROGRAM'];
  });

  afterEach(() => {
    if (originalTermProgram !== undefined) {
      process.env['TERM_PROGRAM'] = originalTermProgram;
    } else {
      delete process.env['TERM_PROGRAM'];
    }
  });

  it('should return openFile function', () => {
    const { result } = renderHook(() => useVsCode());
    expect(result.current.openFile).toBeDefined();
    expect(typeof result.current.openFile).toBe('function');
  });

  it('should open file in VS Code when TERM_PROGRAM is vscode', () => {
    process.env['TERM_PROGRAM'] = 'vscode';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('/path/to/file.js');
    });

    expect(mockExec).toHaveBeenCalledWith(
      'code --reuse-window /path/to/file.js',
      expect.any(Function)
    );
  });

  it('should not open file when TERM_PROGRAM is not vscode', () => {
    process.env['TERM_PROGRAM'] = 'iTerm.app';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('/path/to/file.js');
    });

    expect(mockExec).not.toHaveBeenCalled();
  });

  it('should not open file when TERM_PROGRAM is undefined', () => {
    delete process.env['TERM_PROGRAM'];
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('/path/to/file.js');
    });

    expect(mockExec).not.toHaveBeenCalled();
  });

  it('should handle file paths with spaces', () => {
    process.env['TERM_PROGRAM'] = 'vscode';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('/path/with spaces/file.js');
    });

    expect(mockExec).toHaveBeenCalledWith(
      'code --reuse-window /path/with spaces/file.js',
      expect.any(Function)
    );
  });

  it('should handle relative file paths', () => {
    process.env['TERM_PROGRAM'] = 'vscode';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('./src/components/App.tsx');
    });

    expect(mockExec).toHaveBeenCalledWith(
      'code --reuse-window ./src/components/App.tsx',
      expect.any(Function)
    );
  });

  it('should handle empty file path', () => {
    process.env['TERM_PROGRAM'] = 'vscode';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('');
    });

    expect(mockExec).toHaveBeenCalledWith('code --reuse-window ', expect.any(Function));
  });

  it('should handle exec callback without errors', () => {
    process.env['TERM_PROGRAM'] = 'vscode';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('/path/to/file.js');
    });

    expect(mockExec).toHaveBeenCalledWith(
      'code --reuse-window /path/to/file.js',
      expect.any(Function)
    );

    const callback = mockExec.mock.calls[0]?.[1];
    expect(typeof callback).toBe('function');
  });

  it('should handle different TERM_PROGRAM values', () => {
    const termPrograms = ['vscode', 'iTerm.app', 'Apple_Terminal', 'unknown'];

    termPrograms.forEach((termProgram) => {
      process.env['TERM_PROGRAM'] = termProgram;
      const { result } = renderHook(() => useVsCode());

      act(() => {
        result.current.openFile('/path/to/file.js');
      });

      if (termProgram === 'vscode') {
        expect(mockExec).toHaveBeenCalledWith(
          'code --reuse-window /path/to/file.js',
          expect.any(Function)
        );
      } else {
        expect(mockExec).not.toHaveBeenCalled();
      }

      jest.clearAllMocks();
    });
  });

  it('should handle multiple file opens', () => {
    process.env['TERM_PROGRAM'] = 'vscode';
    const { result } = renderHook(() => useVsCode());

    act(() => {
      result.current.openFile('/path/to/file1.js');
      result.current.openFile('/path/to/file2.ts');
      result.current.openFile('/path/to/file3.py');
    });

    expect(mockExec).toHaveBeenCalledTimes(3);
    expect(mockExec).toHaveBeenNthCalledWith(
      1,
      'code --reuse-window /path/to/file1.js',
      expect.any(Function)
    );
    expect(mockExec).toHaveBeenNthCalledWith(
      2,
      'code --reuse-window /path/to/file2.ts',
      expect.any(Function)
    );
    expect(mockExec).toHaveBeenNthCalledWith(
      3,
      'code --reuse-window /path/to/file3.py',
      expect.any(Function)
    );
  });
});

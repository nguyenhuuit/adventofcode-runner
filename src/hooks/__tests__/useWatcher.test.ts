import { renderHook } from '@testing-library/react';

import { act } from 'react';

const mockWatcher = {
  add: jest.fn(),
  removeAllListeners: jest.fn(),
  on: jest.fn(),
  unwatch: jest.fn(),
};

jest.mock('chokidar', () => ({
  watch: jest.fn(() => mockWatcher),
}));

import { useWatcher } from '@hooks/useWatcher';

describe('useWatcher', () => {
  let mockOnChange: jest.Mock;
  const SAMPLE_FILE_PATH = '/2024/day1/sample.txt';
  const INPUT_FILE_PATH = '/2024/day1/input.txt';

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnChange = jest.fn();
  });

  it('should set up file watching when filePath is provided', () => {
    renderHook(() => useWatcher({ filePath: SAMPLE_FILE_PATH, onChange: mockOnChange }));

    expect(mockWatcher.add).toHaveBeenCalledWith(SAMPLE_FILE_PATH);
    expect(mockWatcher.removeAllListeners).toHaveBeenCalledWith('change');
    expect(mockWatcher.on).toHaveBeenCalledWith('change', mockOnChange);
  });

  it.each([
    ['empty string', ''],
    ['null', null],
    ['undefined', undefined],
  ])('should not set up file watching when filePath is %s', (_, filePath) => {
    renderHook(() => useWatcher({ filePath, onChange: mockOnChange }));

    expect(mockWatcher.add).not.toHaveBeenCalled();
    expect(mockWatcher.removeAllListeners).not.toHaveBeenCalled();
    expect(mockWatcher.on).not.toHaveBeenCalled();
  });

  it('should call onChange when file changes', () => {
    let changeCallback: Function;

    mockWatcher.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'change') {
        changeCallback = callback;
      }
    });

    renderHook(() => useWatcher({ filePath: SAMPLE_FILE_PATH, onChange: mockOnChange }));

    // Simulate file change
    act(() => {
      changeCallback();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should clean up watcher when component unmounts', () => {
    const { unmount } = renderHook(() =>
      useWatcher({ filePath: SAMPLE_FILE_PATH, onChange: mockOnChange })
    );

    unmount();

    expect(mockWatcher.unwatch).toHaveBeenCalledWith(SAMPLE_FILE_PATH);
  });

  it('should re-setup watcher when filePath changes', () => {
    const { rerender } = renderHook(
      ({ filePath, onChange }) => useWatcher({ filePath, onChange }),
      { initialProps: { filePath: SAMPLE_FILE_PATH, onChange: mockOnChange } }
    );

    jest.clearAllMocks();

    rerender({ filePath: INPUT_FILE_PATH, onChange: mockOnChange });

    expect(mockWatcher.add).toHaveBeenCalledWith(INPUT_FILE_PATH);
    expect(mockWatcher.removeAllListeners).toHaveBeenCalledWith('change');
    expect(mockWatcher.on).toHaveBeenCalledWith('change', mockOnChange);
  });

  it('should re-setup watcher when onChange callback changes', () => {
    const newOnChange = jest.fn();

    const { rerender } = renderHook(
      ({ onChange }) => useWatcher({ filePath: SAMPLE_FILE_PATH, onChange }),
      { initialProps: { filePath: SAMPLE_FILE_PATH, onChange: mockOnChange } }
    );

    jest.clearAllMocks();

    rerender({ filePath: SAMPLE_FILE_PATH, onChange: newOnChange });

    expect(mockWatcher.add).toHaveBeenCalledWith(SAMPLE_FILE_PATH);
    expect(mockWatcher.removeAllListeners).toHaveBeenCalledWith('change');
    expect(mockWatcher.on).toHaveBeenCalledWith('change', newOnChange);
  });

  it('should handle multiple file changes correctly', () => {
    let changeCallback: Function;

    mockWatcher.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'change') {
        changeCallback = callback;
      }
    });

    renderHook(() => useWatcher({ filePath: SAMPLE_FILE_PATH, onChange: mockOnChange }));

    act(() => {
      changeCallback();
      changeCallback();
      changeCallback();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });
});

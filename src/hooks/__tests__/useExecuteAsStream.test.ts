/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';
import { ChildProcess } from 'child_process';

import { act } from 'react';

import { executeAsStream } from '@utils/execute';

import { useExecuteAsStream } from '@hooks/useExecuteAsStream';
import { createExecutionStore } from '@hooks/useExecutionStore';

jest.mock('@utils/execute', () => ({
  executeAsStream: jest.fn(),
}));

describe('useExecuteAsStream', () => {
  let mockExecutionStore: ReturnType<typeof createExecutionStore>;
  let mockChildProcess: Partial<ChildProcess>;
  let mockExecuteAsStream: jest.MockedFunction<typeof executeAsStream>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecutionStore = createExecutionStore({
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      baseDir: './',
    });
    mockChildProcess = {
      on: jest.fn() as jest.MockedFunction<ChildProcess['on']>,
      stdout: {
        setEncoding: jest.fn(),
        on: jest.fn() as jest.MockedFunction<any>,
      } as any,
      stderr: {
        setEncoding: jest.fn(),
        on: jest.fn() as jest.MockedFunction<any>,
      } as any,
    };
    mockExecuteAsStream = executeAsStream as jest.MockedFunction<typeof executeAsStream>;
    mockExecuteAsStream.mockReturnValue(mockChildProcess as ChildProcess);
  });

  it('should return an execute function', () => {
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    expect(typeof result.current).toBe('function');
  });

  it('should not execute when solution file is missing', () => {
    mockExecutionStore.getState().getSolutionFile = () => null as any;
    mockExecutionStore.getState().getInputFile = () => './2024/day1/sample.txt';
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    expect(mockExecuteAsStream).not.toHaveBeenCalled();
  });

  it('should not execute when input file is missing', () => {
    mockExecutionStore.getState().getSolutionFile = () => './2024/day1/part1.js';
    mockExecutionStore.getState().getInputFile = () => null as any;
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    expect(mockExecuteAsStream).not.toHaveBeenCalled();
  });

  it('should execute with correct parameters when both files exist', () => {
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    expect(mockExecuteAsStream).toHaveBeenCalledWith({
      solutionFile: './2024/day1/part1.mjs',
      inputFile: './2024/day1/sample.txt',
      language: 'javascript',
      baseDir: './',
    });
  });

  it('should set loading to true and clear output when execution starts', () => {
    mockExecutionStore.setState({ output: 'something', loading: false });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    expect(mockExecutionStore.getState().loading).toBe(true);
    expect(mockExecutionStore.getState().output).toBe('');
  });

  it('should handle message events correctly', () => {
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const messageCallback = (mockChildProcess.on as jest.MockedFunction<any>).mock.calls.find(
      (call: any[]) => call[0] === 'message'
    )?.[1] as (msg: any) => void;
    expect(messageCallback).toBeDefined();
    act(() => {
      messageCallback({ result: '42', time: '1.234ms' });
    });
    expect(mockExecutionStore.getState().answer).toBe('42');
    expect(mockExecutionStore.getState().perfLog).toBe('1.234ms');
  });

  it('should handle exit events with non-zero code', () => {
    mockExecutionStore.setState({ answer: 'something', perfLog: 'something', loading: true });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const exitCallback = (mockChildProcess.on as jest.MockedFunction<any>).mock.calls.find(
      (call: any[]) => call[0] === 'exit'
    )?.[1] as (code: number) => void;
    expect(exitCallback).toBeDefined();
    act(() => {
      exitCallback(1);
    });
    expect(mockExecutionStore.getState().answer).toBe('-');
    expect(mockExecutionStore.getState().perfLog).toBe('-');
    expect(mockExecutionStore.getState().loading).toBe(false);
  });

  it('should handle exit events with zero code', () => {
    mockExecutionStore.setState({ loading: true });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const exitCallback = (mockChildProcess.on as jest.MockedFunction<any>).mock.calls.find(
      (call: any[]) => call[0] === 'exit'
    )?.[1] as (code: number) => void;
    expect(exitCallback).toBeDefined();
    act(() => {
      exitCallback(0);
    });
    expect(mockExecutionStore.getState().loading).toBe(false);
  });

  it('should handle stdout data correctly', () => {
    mockExecutionStore.setState({ output: '' });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const stdoutDataCallback = (
      mockChildProcess.stdout?.on as jest.MockedFunction<any>
    ).mock.calls.find((call: any[]) => call[0] === 'data')?.[1] as (data: Buffer) => void;
    expect(stdoutDataCallback).toBeDefined();
    act(() => {
      stdoutDataCallback(Buffer.from('Hello World\n'));
    });
    expect(mockExecutionStore.getState().output).toBe('Hello World\n');
  });

  it('should handle stdout data with command failed message', () => {
    mockExecutionStore.setState({ output: '', answer: '', perfLog: '' });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const stdoutDataCallback = (
      mockChildProcess.stdout?.on as jest.MockedFunction<any>
    ).mock.calls.find((call: any[]) => call[0] === 'data')?.[1] as (data: Buffer) => void;
    expect(stdoutDataCallback).toBeDefined();
    act(() => {
      stdoutDataCallback(Buffer.from('Command failed: some error\n'));
    });
    expect(mockExecutionStore.getState().answer).toBe('-');
    expect(mockExecutionStore.getState().perfLog).toBe('-');
    expect(mockExecutionStore.getState().output).toBe('Command failed: some error\n');
  });

  it('should handle stderr data correctly', () => {
    mockExecutionStore.setState({ output: '' });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const stderrDataCallback = (
      mockChildProcess.stderr?.on as jest.MockedFunction<any>
    ).mock.calls.find((call: any[]) => call[0] === 'data')?.[1] as (data: Buffer) => void;
    expect(stderrDataCallback).toBeDefined();
    act(() => {
      stderrDataCallback(Buffer.from('Error: something went wrong\n'));
    });
    expect(mockExecutionStore.getState().output).toBe('Error: something went wrong\n');
  });

  it('should set encoding to utf8 for stdout and stderr', () => {
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    expect(mockChildProcess.stdout?.setEncoding).toHaveBeenCalledWith('utf8');
    expect(mockChildProcess.stderr?.setEncoding).toHaveBeenCalledWith('utf8');
  });

  it('should handle multiple stdout data events', () => {
    mockExecutionStore.setState({ output: '' });
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const stdoutDataCallback = (
      mockChildProcess.stdout?.on as jest.MockedFunction<any>
    ).mock.calls.find((call: any[]) => call[0] === 'data')?.[1] as (data: Buffer) => void;
    expect(stdoutDataCallback).toBeDefined();
    act(() => {
      stdoutDataCallback(Buffer.from('First line\n'));
      stdoutDataCallback(Buffer.from('Second line\n'));
      stdoutDataCallback(Buffer.from('Third line\n'));
    });
    expect(mockExecutionStore.getState().output).toBe('First line\nSecond line\nThird line\n');
  });

  it('should handle close events (no action)', () => {
    const { result } = renderHook(() => useExecuteAsStream(mockExecutionStore));
    act(() => {
      result.current();
    });
    const closeCall = (mockChildProcess.on as jest.MockedFunction<any>).mock.calls.find(
      (call: any[]) => call[0] === 'close'
    );
    expect(closeCall).toBeDefined();
    expect(typeof closeCall?.[1]).toBe('function');
  });
});

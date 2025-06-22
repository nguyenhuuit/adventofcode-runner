import { renderHook, waitFor } from '@testing-library/react';

import { aocClient } from '@utils/aocClient';
import { VALID_YEARS } from '@utils/constants';

import { createExecutionStore } from '@hooks/useExecutionStore';
import { useYearInfo } from '@hooks/useYearInfo';

jest.mock('@utils/aocClient', () => ({
  aocClient: {
    fetchProblem: jest.fn(),
  },
}));

jest.mock('@utils/constants', () => ({
  VALID_YEARS: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  InputMode: {
    INPUT: 'input',
    SAMPLE: 'sample',
  },
}));

describe('useYearInfo', () => {
  let mockExecutionStore: ReturnType<typeof createExecutionStore>;
  let mockFetchProblem: jest.MockedFunction<typeof aocClient.fetchProblem>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecutionStore = createExecutionStore({
      year: '2024',
      day: '1',
      part: '1',
      language: 'javascript',
      baseDir: './',
    });
    mockFetchProblem = aocClient.fetchProblem as jest.MockedFunction<typeof aocClient.fetchProblem>;
    // Set default mock to return a resolved promise
    mockFetchProblem.mockResolvedValue('');
  });

  it('should return userName and star properties', () => {
    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    expect(result.current).toHaveProperty('userName');
    expect(result.current).toHaveProperty('star');
    expect(typeof result.current.userName).toBe('string');
    expect(typeof result.current.star).toBe('string');
  });

  it('should fetch user info for valid year', async () => {
    const mockHtml = `
      <div class="user">JohnDoe</div>
      <div class="star-count">42*</div>
    `;
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('JohnDoe');
      expect(result.current.star).toBe('42');
    });

    expect(mockFetchProblem).toHaveBeenCalledWith('2024', '1');
  });

  it('should handle HTML without user info', async () => {
    const mockHtml = '<div>No user info here</div>';
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('');
      expect(result.current.star).toBe('');
    });

    expect(mockFetchProblem).toHaveBeenCalledWith('2024', '1');
  });

  it('should handle HTML without star count', async () => {
    const mockHtml = '<div class="user">JaneDoe</div>';
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('JaneDoe');
      expect(result.current.star).toBe('');
    });
  });

  it('should handle HTML with only star count', async () => {
    const mockHtml = '<div class="star-count">100*</div>';
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('');
      expect(result.current.star).toBe('100');
    });
  });

  it('should clear user info for invalid year', async () => {
    mockExecutionStore.setState({ year: 'invalid' });

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('');
      expect(result.current.star).toBe('');
    });

    expect(mockFetchProblem).not.toHaveBeenCalled();
  });

  it('should handle different valid years', async () => {
    const mockHtml = `
      <div class="user">TestUser</div>
      <div class="star-count">50*</div>
    `;
    mockFetchProblem.mockResolvedValue(mockHtml);

    for (const year of VALID_YEARS) {
      mockExecutionStore.setState({ year });
      const { result } = renderHook(() => useYearInfo(mockExecutionStore));

      await waitFor(() => {
        expect(result.current.userName).toBe('TestUser');
        expect(result.current.star).toBe('50');
      });

      expect(mockFetchProblem).toHaveBeenCalledWith(year, '1');
    }
  });

  it('should handle complex HTML structure', async () => {
    const mockHtml = `
      <html>
        <body>
          <div class="user">ComplexUser</div>
          <div class="star-count">75*</div>
          <div class="other">Other content</div>
        </body>
      </html>
    `;
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('ComplexUser');
      expect(result.current.star).toBe('75');
    });
  });

  it('should handle multiple user/star elements', async () => {
    const mockHtml = `
      <div class="user">FirstUser</div>
      <div class="star-count">10*</div>
      <div class="user">SecondUser</div>
      <div class="star-count">20*</div>
    `;
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('FirstUser');
      expect(result.current.star).toBe('10');
    });
  });

  it('should handle empty HTML response', async () => {
    mockFetchProblem.mockResolvedValue('');

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('');
      expect(result.current.star).toBe('');
    });
  });

  it('should handle whitespace in user name', async () => {
    const mockHtml = '<div class="user">  User With Spaces </div>';
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('  User With Spaces');
      expect(result.current.star).toBe('');
    });
  });

  it('should handle special characters in star count', async () => {
    const mockHtml = '<div class="star-count">1,234*</div>';
    mockFetchProblem.mockResolvedValue(mockHtml);

    const { result } = renderHook(() => useYearInfo(mockExecutionStore));

    await waitFor(() => {
      expect(result.current.userName).toBe('');
      expect(result.current.star).toBe('1,234');
    });
  });
});

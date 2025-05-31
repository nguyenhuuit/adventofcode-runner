import { validate } from '../prompter';
import { MockPrompt } from './types';

jest.mock('enquirer', () => ({
  prompt: jest.fn(),
}));

const mockPrompt = jest.mocked(require('enquirer').prompt) as MockPrompt;

describe('prompter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return all options when all are provided', async () => {
      const options = {
        year: '2023',
        day: '1',
        part: '1',
        language: 'python',
      };

      const result = await validate(options);

      expect(result).toEqual(options);
      expect(mockPrompt).not.toHaveBeenCalled();
    });

    it('should prompt for language when not provided', async () => {
      mockPrompt.mockResolvedValueOnce({ language: 'Python' });

      const options = {
        year: '2023',
        day: '1',
        part: '1',
      };

      const result = await validate(options);

      expect(result).toEqual({
        ...options,
        language: 'python',
      });
      expect(mockPrompt).toHaveBeenCalledTimes(1);
      expect(mockPrompt).toHaveBeenCalledWith({
        type: 'select',
        name: 'language',
        message: 'Select programming language',
        choices: [
          { name: 'Python' },
          { name: 'Javascript' },
          { name: 'Java' },
          { name: 'C++' },
          { name: 'Ruby' },
        ],
      });
    });

    it('should prompt for year when not provided', async () => {
      mockPrompt.mockResolvedValueOnce({ year: '2023' });

      const options = {
        day: '1',
        part: '1',
        language: 'python',
      };

      const result = await validate(options);

      expect(result).toEqual({
        ...options,
        year: '2023',
      });
      expect(mockPrompt).toHaveBeenCalledTimes(1);
      expect(mockPrompt).toHaveBeenCalledWith({
        type: 'input',
        name: 'year',
        message: 'Select year',
      });
    });

    it('should prompt for day when not provided', async () => {
      mockPrompt.mockResolvedValueOnce({ day: '1' });

      const options = {
        year: '2023',
        part: '1',
        language: 'python',
      };

      const result = await validate(options);

      expect(result).toEqual({
        ...options,
        day: '1',
      });
      expect(mockPrompt).toHaveBeenCalledTimes(1);
      expect(mockPrompt).toHaveBeenCalledWith({
        type: 'input',
        name: 'day',
        message: 'Select day',
      });
    });

    it('should prompt for part when not provided', async () => {
      mockPrompt.mockResolvedValueOnce({ part: 'Part 1' });

      const options = {
        year: '2023',
        day: '1',
        language: 'python',
      };

      const result = await validate(options);

      expect(result).toEqual({
        ...options,
        part: '1',
      });
      expect(mockPrompt).toHaveBeenCalledTimes(1);
      expect(mockPrompt).toHaveBeenCalledWith({
        type: 'select',
        name: 'part',
        message: 'Select part',
        choices: [{ name: 'Part 1' }, { name: 'Part 2' }],
      });
    });

    it('should convert Part 2 to 2', async () => {
      mockPrompt.mockResolvedValueOnce({ part: 'Part 2' });

      const options = {
        year: '2023',
        day: '1',
        language: 'python',
      };

      const result = await validate(options);

      expect(result).toEqual({
        ...options,
        part: '2',
      });
    });

    it('should prompt for all missing options', async () => {
      mockPrompt
        .mockResolvedValueOnce({ language: 'Python' })
        .mockResolvedValueOnce({ year: '2023' })
        .mockResolvedValueOnce({ day: '1' })
        .mockResolvedValueOnce({ part: 'Part 1' });

      const result = await validate({});

      expect(result).toEqual({
        year: '2023',
        day: '1',
        part: '1',
        language: 'python',
      });
      expect(mockPrompt).toHaveBeenCalledTimes(4);
    });
  });
});

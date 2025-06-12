import { logger } from '@utils/logger';

const HTML_ENTITIES: Record<string, string> = {
  '&gt;': '>',
  '&lt;': '<',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
};

const HTML_TAGS = ['<code>', '</code>', '<em>', '</em>', '<pre>', '</pre>'];

export const decode = (str: string): string => {
  if (!str) return '';

  try {
    let result = str;
    for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
      result = result.replaceAll(entity, char);
    }

    for (const tag of HTML_TAGS) {
      result = result.replaceAll(tag, '');
    }

    return result.trim();
  } catch (error) {
    logger.error(`Error in decode function ${error}`);
    return str;
  }
};

export const findLongest = (strings: string[]): string => {
  if (!Array.isArray(strings) || strings.length === 0) {
    return '';
  }

  return strings.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    ''
  );
};

export const extractSampleInput = (html: string): string => {
  const SAMPLE_REGEX = /<code>(<em>)?([\s\S]+?)(<\/em>)?<\/code>/g;
  const matches = html.match(SAMPLE_REGEX);

  if (!matches) return '';
  return decode(findLongest(matches)).trim();
};

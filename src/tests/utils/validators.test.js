import {
  validateField,
  validateForm,
  isFormValid,
  formatFieldName,
  formatDateToDDMMYYYY,
  parseDDMMYYYYToISO,
  isValidUrl,
  validateUrlField,
  validateUrlFields
} from '../../utils/validators';

describe('validateField', () => {
  test('returns error message for empty required field', () => {
    const result = validateField('channel', '', true);
    expect(result).toBe('Channel is required');
  });

  test('returns error message for null required field', () => {
    const result = validateField('channel', null, true);
    expect(result).toBe('Channel is required');
  });

  test('returns error message for whitespace-only required field', () => {
    const result = validateField('description', '   ', true);
    expect(result).toBe('Description is required');
  });

  test('returns null for non-empty required field', () => {
    const result = validateField('channel', 'Janam Global', true);
    expect(result).toBeNull();
  });

  test('returns null for empty optional field', () => {
    const result = validateField('thumbnailUrl', '', false);
    expect(result).toBeNull();
  });
});

describe('validateForm', () => {
  test('returns errors for all empty mandatory fields', () => {
    const formData = {};
    const errors = validateForm(formData);
    
    expect(errors.channel).toBe('Channel is required');
    expect(errors.description).toBe('Description is required');
    expect(errors.tags).toBe('Tags is required');
    expect(errors.language).toBe('Language is required');
    expect(errors.status).toBe('Status is required');
    expect(errors.publishDate).toBe('Publish Date is required');
    // contentExpiry is no longer mandatory
    expect(errors.contentExpiry).toBeUndefined();
  });

  test('returns empty object when all mandatory fields are filled', () => {
    const formData = {
      channel: 'Janam Global',
      description: 'Test description',
      tags: 'tag1, tag2',
      language: 'Tamil',
      status: 'Draft',
      publishDate: '2024-01-15'
    };
    const errors = validateForm(formData);
    
    expect(Object.keys(errors).length).toBe(0);
  });

  test('returns errors only for empty mandatory fields', () => {
    const formData = {
      channel: 'Janam Global',
      description: '',
      tags: 'tag1',
      language: '',
      status: 'Draft',
      publishDate: '2024-01-15'
    };
    const errors = validateForm(formData);
    
    expect(errors.description).toBe('Description is required');
    expect(errors.language).toBe('Language is required');
    expect(errors.channel).toBeUndefined();
  });
});

describe('isValidUrl', () => {
  test('returns true for valid http URL', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('returns true for valid https URL', () => {
    expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
  });

  test('returns true for empty string (optional field)', () => {
    expect(isValidUrl('')).toBe(true);
  });

  test('returns true for null (optional field)', () => {
    expect(isValidUrl(null)).toBe(true);
  });

  test('returns false for invalid URL', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  test('returns false for URL without protocol', () => {
    expect(isValidUrl('example.com')).toBe(false);
  });

  test('returns false for ftp protocol', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });
});

describe('validateUrlField', () => {
  test('returns null for valid URL', () => {
    const result = validateUrlField('newsThumbnailUrl', 'https://example.com/image.jpg');
    expect(result).toBeNull();
  });

  test('returns null for empty value', () => {
    const result = validateUrlField('newsThumbnailUrl', '');
    expect(result).toBeNull();
  });

  test('returns error message for invalid URL', () => {
    const result = validateUrlField('newsThumbnailUrl', 'not-a-url');
    expect(result).toBe('News Thumbnail Url must be a valid URL');
  });
});

describe('validateUrlFields', () => {
  test('returns empty object for valid URLs', () => {
    const formData = {
      newsThumbnailUrl: 'https://example.com/image.jpg',
      newsUrl: 'https://example.com/news'
    };
    const urlFields = [
      { name: 'newsThumbnailUrl', validateUrl: true },
      { name: 'newsUrl', validateUrl: true }
    ];
    const errors = validateUrlFields(formData, urlFields);
    
    expect(Object.keys(errors).length).toBe(0);
  });

  test('returns errors for invalid URLs', () => {
    const formData = {
      newsThumbnailUrl: 'invalid-url',
      newsUrl: 'https://valid.com'
    };
    const urlFields = [
      { name: 'newsThumbnailUrl', validateUrl: true },
      { name: 'newsUrl', validateUrl: true }
    ];
    const errors = validateUrlFields(formData, urlFields);
    
    expect(errors.newsThumbnailUrl).toBe('News Thumbnail Url must be a valid URL');
    expect(errors.newsUrl).toBeUndefined();
  });

  test('skips fields without validateUrl flag', () => {
    const formData = {
      newsTitle: 'not-a-url-but-text-field'
    };
    const urlFields = [
      { name: 'newsTitle', validateUrl: false }
    ];
    const errors = validateUrlFields(formData, urlFields);
    
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe('isFormValid', () => {
  test('returns true for empty errors object', () => {
    expect(isFormValid({})).toBe(true);
  });

  test('returns false for non-empty errors object', () => {
    expect(isFormValid({ channel: 'Required' })).toBe(false);
  });
});

describe('formatFieldName', () => {
  test('converts camelCase to Title Case', () => {
    expect(formatFieldName('newsThumbnailUrl')).toBe('News Thumbnail Url');
  });

  test('handles single word', () => {
    expect(formatFieldName('channel')).toBe('Channel');
  });

  test('handles multiple camelCase words', () => {
    expect(formatFieldName('audioPodcastName')).toBe('Audio Podcast Name');
  });
});

describe('formatDateToDDMMYYYY', () => {
  test('formats ISO date to dd/mm/yyyy', () => {
    expect(formatDateToDDMMYYYY('2024-01-15')).toBe('15/01/2024');
  });

  test('returns empty string for empty input', () => {
    expect(formatDateToDDMMYYYY('')).toBe('');
  });

  test('returns empty string for null input', () => {
    expect(formatDateToDDMMYYYY(null)).toBe('');
  });

  test('pads single digit day and month', () => {
    expect(formatDateToDDMMYYYY('2024-05-05')).toBe('05/05/2024');
  });
});

describe('parseDDMMYYYYToISO', () => {
  test('parses dd/mm/yyyy to ISO format', () => {
    expect(parseDDMMYYYYToISO('15/01/2024')).toBe('2024-01-15');
  });

  test('returns empty string for empty input', () => {
    expect(parseDDMMYYYYToISO('')).toBe('');
  });

  test('returns empty string for invalid format', () => {
    expect(parseDDMMYYYYToISO('2024-01-15')).toBe('');
  });

  test('returns empty string for null input', () => {
    expect(parseDDMMYYYYToISO(null)).toBe('');
  });
});


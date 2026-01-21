import {
  submitFormData,
  getErrorMessage,
  ApiError,
  ERROR_MESSAGES
} from '../../services/formSubmitApi';

// Mock the config
jest.mock('../../config/formSubmitConfig', () => ({
  getFormSubmitUrl: () => 'https://test-api.example.com/api/postJanamFormData?code=test-code'
}));

describe('formSubmitApi', () => {
  // Store original fetch
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterAll(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('getErrorMessage', () => {
    test('returns validation error message for 400 status', () => {
      expect(getErrorMessage(400)).toBe('Form Upload Failed with validation error from Backend');
    });

    test('returns server error message for 500 status', () => {
      expect(getErrorMessage(500)).toBe('Something went wrong in Backend');
    });

    test('returns server error message for 502 status', () => {
      expect(getErrorMessage(502)).toBe('Something went wrong in Backend');
    });

    test('returns server error message for 503 status', () => {
      expect(getErrorMessage(503)).toBe('Something went wrong in Backend');
    });

    test('returns default error message for other status codes', () => {
      expect(getErrorMessage(404)).toBe('An unexpected error occurred');
    });

    test('returns default error message for 401 status', () => {
      expect(getErrorMessage(401)).toBe('An unexpected error occurred');
    });
  });

  describe('ApiError', () => {
    test('creates error with message and status code', () => {
      const error = new ApiError('Test error', 400);
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ApiError');
    });

    test('is instance of Error', () => {
      const error = new ApiError('Test error', 500);
      
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe('ERROR_MESSAGES', () => {
    test('contains correct message for 400', () => {
      expect(ERROR_MESSAGES[400]).toBe('Form Upload Failed with validation error from Backend');
    });

    test('contains correct message for 500', () => {
      expect(ERROR_MESSAGES[500]).toBe('Something went wrong in Backend');
    });

    test('contains default message', () => {
      expect(ERROR_MESSAGES.DEFAULT).toBe('An unexpected error occurred');
    });
  });

  describe('submitFormData', () => {
    const mockPayload = {
      channel: 'Janam Global',
      description: 'Test description',
      tags: 'tag1, tag2',
      language: 'Tamil',
      status: 'Draft',
      publishDate: '2024-01-15',
      news: [],
      audio: [],
      events: [],
      chat: []
    };

    test('makes POST request with correct headers and body', async () => {
      const mockResponse = { success: true, id: '123' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await submitFormData(mockPayload);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-api.example.com/api/postJanamFormData?code=test-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mockPayload)
        }
      );
    });

    test('returns response data on success', async () => {
      const mockResponse = { success: true, id: '123' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await submitFormData(mockPayload);

      expect(result).toEqual(mockResponse);
    });

    test('throws ApiError with validation message for 400 response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      try {
        await submitFormData(mockPayload);
        fail('Expected submitFormData to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('Form Upload Failed with validation error from Backend');
        expect(error.statusCode).toBe(400);
      }
    });

    test('throws ApiError with server error message for 500 response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      try {
        await submitFormData(mockPayload);
        fail('Expected submitFormData to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('Something went wrong in Backend');
        expect(error.statusCode).toBe(500);
      }
    });

    test('throws ApiError with server error message for 502 response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 502
      });

      try {
        await submitFormData(mockPayload);
        fail('Expected submitFormData to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('Something went wrong in Backend');
        expect(error.statusCode).toBe(502);
      }
    });

    test('throws ApiError with default message for other error status codes', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403
      });

      try {
        await submitFormData(mockPayload);
        fail('Expected submitFormData to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('An unexpected error occurred');
        expect(error.statusCode).toBe(403);
      }
    });

    test('propagates network errors', async () => {
      const networkError = new Error('Network error');
      global.fetch.mockRejectedValueOnce(networkError);

      await expect(submitFormData(mockPayload)).rejects.toThrow('Network error');
    });
  });
});


import { getFormSubmitUrl, getExcelUploadUrl } from '../config/formSubmitConfig';

/**
 * Error messages for different HTTP status codes
 */
export const ERROR_MESSAGES = {
  400: 'Form Upload Failed with validation error from Backend',
  500: 'Something went wrong in Backend',
  DEFAULT: 'An unexpected error occurred'
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Get error message based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error message
 */
export const getErrorMessage = (statusCode) => {
  if (statusCode === 400) {
    return ERROR_MESSAGES[400];
  }
  if (statusCode >= 500) {
    return ERROR_MESSAGES[500];
  }
  return ERROR_MESSAGES.DEFAULT;
};

/**
 * Submit form data to the API
 * @param {Object} payload - The form data payload
 * @returns {Promise<Object>} - API response data
 * @throws {ApiError} - Throws ApiError with status code on failure
 */
export const submitFormData = async (payload) => {
  const url = getFormSubmitUrl();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorMessage = getErrorMessage(response.status);
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data;
};

/**
 * Upload Excel file to the API
 * @param {File} file - The Excel file to upload
 * @returns {Promise<Object>} - API response data
 * @throws {ApiError} - Throws ApiError with status code on failure
 */
export const uploadExcelFile = async (file) => {
  const url = getExcelUploadUrl();
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorMessage = getErrorMessage(response.status);
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data;
};


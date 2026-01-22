/**
 * Configuration for Form Submit API
 * API_CODE is read from environment variable REACT_APP_FORM_SUBMIT_API_CODE
 */
export const FORM_SUBMIT_CONFIG = {
  BASE_URL: 'https://auth-uat-api.azurewebsites.net',
  ENDPOINT: '/api/postJanamFormData',
  API_CODE: process.env.codeform || ''
};

/**
 * Get the full API URL with code parameter
 * @returns {string} Complete API URL
 */
export const getFormSubmitUrl = () => {
  const { BASE_URL, ENDPOINT, API_CODE } = FORM_SUBMIT_CONFIG;
  return `${BASE_URL}${ENDPOINT}?code=${API_CODE}`;
};

/**
 * Configuration for Excel Upload API
 * API_CODE is read from environment variable REACT_APP_EXCEL_UPLOAD_API_CODE
 */
export const EXCEL_UPLOAD_CONFIG = {
  BASE_URL: 'https://auth-uat-api.azurewebsites.net',
  ENDPOINT: '/api/UploadMedia',
  API_CODE: process.env.codeexcel || ''
};

/**
 * Get the Excel Upload API URL with code parameter
 * @returns {string} Complete API URL
 */
export const getExcelUploadUrl = () => {
  const { BASE_URL, ENDPOINT, API_CODE } = EXCEL_UPLOAD_CONFIG;
  return `${BASE_URL}${ENDPOINT}?code=${API_CODE}`;
};


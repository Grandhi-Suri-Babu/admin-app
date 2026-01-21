/**
 * Form validation utilities
 */

import { mandatoryFields } from '../data/formFields';

/**
 * Validates if a string is a valid URL
 * @param {string} url - The URL string to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || url.trim() === '') return true; // Empty is valid (not required)
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates a URL field and returns error message if invalid
 * @param {string} fieldName - The name of the field
 * @param {string} value - The URL value to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateUrlField = (fieldName, value) => {
  if (value && value.trim() !== '' && !isValidUrl(value)) {
    return `${formatFieldName(fieldName)} must be a valid URL`;
  }
  return null;
};

/**
 * Validates a single field value
 * @param {string} fieldName - The name of the field
 * @param {any} value - The value to validate
 * @param {boolean} required - Whether the field is required
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (fieldName, value, required) => {
  if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${formatFieldName(fieldName)} is required`;
  }
  return null;
};

/**
 * Validates all mandatory fields in the form data
 * @param {Object} formData - The form data object
 * @returns {Object} - Object with errors for each invalid field
 */
export const validateForm = (formData) => {
  const errors = {};

  mandatoryFields.forEach((fieldName) => {
    const error = validateField(fieldName, formData[fieldName], true);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Validates URL fields in the form data
 * @param {Object} formData - The form data object
 * @param {Array} urlFields - Array of field objects with validateUrl: true
 * @returns {Object} - Object with errors for each invalid URL field
 */
export const validateUrlFields = (formData, urlFields) => {
  const errors = {};

  urlFields.forEach((field) => {
    if (field.validateUrl && formData[field.name]) {
      const error = validateUrlField(field.name, formData[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    }
  });

  return errors;
};

/**
 * Checks if the form is valid (no errors)
 * @param {Object} errors - The errors object
 * @returns {boolean} - True if no errors
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Formats a camelCase field name to a readable label
 * @param {string} fieldName - The camelCase field name
 * @returns {string} - Formatted label
 */
export const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Formats a date string to dd/mm/yyyy format
 * @param {string} dateString - ISO date string or Date object
 * @returns {string} - Formatted date string
 */
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parses dd/mm/yyyy format to ISO date string
 * @param {string} dateString - Date in dd/mm/yyyy format
 * @returns {string} - ISO date string for input[type="date"]
 */
export const parseDDMMYYYYToISO = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

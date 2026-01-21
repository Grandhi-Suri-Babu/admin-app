import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormPage from '../../../components/Form/FormPage';

// Mock the API service
jest.mock('../../../services/formSubmitApi', () => ({
  submitFormData: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = 'ApiError';
      this.statusCode = statusCode;
    }
  }
}));

// Import the mocked function for use in tests
import { submitFormData } from '../../../services/formSubmitApi';

describe('FormPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  test('renders the form header', () => {
    render(<FormPage />);
    expect(screen.getByText('Content Form')).toBeInTheDocument();
  });

  test('renders Common Information Section', () => {
    render(<FormPage />);
    expect(screen.getByText('Common Information Section')).toBeInTheDocument();
  });

  test('renders all collapsible sections with record counts', () => {
    render(<FormPage />);
    expect(screen.getByText('News Section (0)')).toBeInTheDocument();
    expect(screen.getByText('Audio Section (0)')).toBeInTheDocument();
    expect(screen.getByText('Event Section (0)')).toBeInTheDocument();
    expect(screen.getByText('Chat Section (0)')).toBeInTheDocument();
  });

  test('renders Submit and Reset buttons', () => {
    render(<FormPage />);
    expect(screen.getByText('Submit Form')).toBeInTheDocument();
    expect(screen.getByText('Reset Form')).toBeInTheDocument();
  });

  test('renders Add Record buttons for each section', () => {
    render(<FormPage />);
    expect(screen.getByText('+ Add News Record')).toBeInTheDocument();
    expect(screen.getByText('+ Add Audio Record')).toBeInTheDocument();
    expect(screen.getByText('+ Add Event Record')).toBeInTheDocument();
    expect(screen.getByText('+ Add Chat Record')).toBeInTheDocument();
  });

  test('renders mandatory field labels with asterisk', () => {
    render(<FormPage />);
    const channelLabel = screen.getByText('Channel');
    const requiredMark = channelLabel.parentElement.querySelector('.required-mark');
    expect(requiredMark).toBeInTheDocument();
  });

  test('shows error message when submitting empty form', async () => {
    render(<FormPage />);
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please fix.*error/)).toBeInTheDocument();
    });
  });

  test('shows success message when all mandatory fields are filled and API succeeds', async () => {
    // Mock successful API response
    submitFormData.mockResolvedValueOnce({ success: true });
    
    render(<FormPage />);
    
    // Fill mandatory fields
    const channelSelect = screen.getByLabelText(/Channel/);
    const descriptionTextarea = screen.getByLabelText(/Description/);
    const tagsInput = screen.getByLabelText(/Tags/);
    const languageSelect = screen.getByLabelText(/Language/);
    const statusSelect = screen.getByLabelText(/Status/);
    const publishDateInput = screen.getByLabelText(/Publish Date/);
    
    await userEvent.selectOptions(channelSelect, 'Janam Global');
    await userEvent.type(descriptionTextarea, 'Test description');
    await userEvent.type(tagsInput, 'tag1, tag2');
    await userEvent.selectOptions(languageSelect, 'Tamil');
    await userEvent.selectOptions(statusSelect, 'Draft');
    fireEvent.change(publishDateInput, { target: { value: '2024-01-15' } });
    
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Form submitted successfully/)).toBeInTheDocument();
    });
  });

  test('shows error message when API returns 400', async () => {
    // Mock 400 error
    const { ApiError } = require('../../../services/formSubmitApi');
    submitFormData.mockRejectedValueOnce(new ApiError('Form Upload Failed with validation error from Backend', 400));
    
    render(<FormPage />);
    
    // Fill mandatory fields
    const channelSelect = screen.getByLabelText(/Channel/);
    const descriptionTextarea = screen.getByLabelText(/Description/);
    const tagsInput = screen.getByLabelText(/Tags/);
    const languageSelect = screen.getByLabelText(/Language/);
    const statusSelect = screen.getByLabelText(/Status/);
    const publishDateInput = screen.getByLabelText(/Publish Date/);
    
    await userEvent.selectOptions(channelSelect, 'Janam Global');
    await userEvent.type(descriptionTextarea, 'Test description');
    await userEvent.type(tagsInput, 'tag1, tag2');
    await userEvent.selectOptions(languageSelect, 'Tamil');
    await userEvent.selectOptions(statusSelect, 'Draft');
    fireEvent.change(publishDateInput, { target: { value: '2024-01-15' } });
    
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Form Upload Failed with validation error from Backend/)).toBeInTheDocument();
    });
  });

  test('shows error message when API returns 500', async () => {
    // Mock 500 error
    const { ApiError } = require('../../../services/formSubmitApi');
    submitFormData.mockRejectedValueOnce(new ApiError('Something went wrong in Backend', 500));
    
    render(<FormPage />);
    
    // Fill mandatory fields
    const channelSelect = screen.getByLabelText(/Channel/);
    const descriptionTextarea = screen.getByLabelText(/Description/);
    const tagsInput = screen.getByLabelText(/Tags/);
    const languageSelect = screen.getByLabelText(/Language/);
    const statusSelect = screen.getByLabelText(/Status/);
    const publishDateInput = screen.getByLabelText(/Publish Date/);
    
    await userEvent.selectOptions(channelSelect, 'Janam Global');
    await userEvent.type(descriptionTextarea, 'Test description');
    await userEvent.type(tagsInput, 'tag1, tag2');
    await userEvent.selectOptions(languageSelect, 'Tamil');
    await userEvent.selectOptions(statusSelect, 'Draft');
    fireEvent.change(publishDateInput, { target: { value: '2024-01-15' } });
    
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong in Backend/)).toBeInTheDocument();
    });
  });

  test('all sections are expanded by default', () => {
    render(<FormPage />);
    
    const newsSection = screen.getByText('News Section (0)').closest('.collapsible-section');
    const audioSection = screen.getByText('Audio Section (0)').closest('.collapsible-section');
    const eventSection = screen.getByText('Event Section (0)').closest('.collapsible-section');
    const chatSection = screen.getByText('Chat Section (0)').closest('.collapsible-section');
    
    expect(newsSection).toHaveClass('expanded');
    expect(audioSection).toHaveClass('expanded');
    expect(eventSection).toHaveClass('expanded');
    expect(chatSection).toHaveClass('expanded');
  });

  test('shows empty state message for sections with no records', () => {
    render(<FormPage />);
    expect(screen.getByText('No news records added yet.')).toBeInTheDocument();
    expect(screen.getByText('No audio records added yet.')).toBeInTheDocument();
    expect(screen.getByText('No event records added yet.')).toBeInTheDocument();
    expect(screen.getByText('No chat records added yet.')).toBeInTheDocument();
  });

  test('opens modal when Add Record button is clicked', async () => {
    render(<FormPage />);
    
    const addNewsButton = screen.getByText('+ Add News Record');
    fireEvent.click(addNewsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add News')).toBeInTheDocument();
    });
  });

  test('closes modal when Cancel button is clicked', async () => {
    render(<FormPage />);
    
    const addNewsButton = screen.getByText('+ Add News Record');
    fireEvent.click(addNewsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add News')).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Add News')).not.toBeInTheDocument();
    });
  });

  test('reset button clears all form fields and records', async () => {
    render(<FormPage />);
    
    // Fill some fields
    const channelSelect = screen.getByLabelText(/Channel/);
    await userEvent.selectOptions(channelSelect, 'Janam Global');
    
    // Click reset
    const resetButton = screen.getByText('Reset Form');
    fireEvent.click(resetButton);
    
    // Check if field is cleared
    expect(channelSelect.value).toBe('');
  });

  test('toggles collapsible sections when header is clicked', async () => {
    render(<FormPage />);
    
    const chatHeader = screen.getByText('Chat Section (0)');
    const chatSection = chatHeader.closest('.collapsible-section');
    
    // Initially expanded
    expect(chatSection).toHaveClass('expanded');
    
    // Click to collapse
    fireEvent.click(chatHeader);
    expect(chatSection).not.toHaveClass('expanded');
    
    // Click to expand again
    fireEvent.click(chatHeader);
    expect(chatSection).toHaveClass('expanded');
  });
});


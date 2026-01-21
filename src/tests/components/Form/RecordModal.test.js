import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecordModal from '../../../components/Form/RecordModal';

const mockFields = [
  { name: 'newsTitle', label: 'News Title', type: 'text' },
  { name: 'newsType', label: 'News Type', type: 'select', options: ['Normal News', 'Breaking News'] },
  { name: 'newsThumbnailUrl', label: 'Thumbnail Url', type: 'url', validateUrl: true }
];

describe('RecordModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(
      <RecordModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    expect(screen.queryByText('Add News')).not.toBeInTheDocument();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    expect(screen.getByText('Add News')).toBeInTheDocument();
  });

  test('shows Edit title when initialData is provided', () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{ newsTitle: 'Existing News' }}
      />
    );
    expect(screen.getByText('Edit News')).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    expect(screen.getByLabelText('News Title')).toBeInTheDocument();
    expect(screen.getByLabelText('News Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Thumbnail Url')).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onClose when close X button is clicked', () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onSave with form data when Save button is clicked', async () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    
    const titleInput = screen.getByLabelText('News Title');
    await userEvent.type(titleInput, 'Test News Title');
    
    const saveButton = screen.getByText('Save Record');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      newsTitle: 'Test News Title'
    }));
  });

  test('shows validation error for invalid URL', async () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{}}
      />
    );
    
    const urlInput = screen.getByLabelText('Thumbnail Url');
    await userEvent.type(urlInput, 'not-a-valid-url');
    
    const saveButton = screen.getByText('Save Record');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('pre-fills form with initialData', () => {
    render(
      <RecordModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        sectionTitle="News"
        fields={mockFields}
        initialData={{ newsTitle: 'Pre-filled Title', newsType: 'Breaking News' }}
      />
    );
    
    expect(screen.getByLabelText('News Title').value).toBe('Pre-filled Title');
    expect(screen.getByLabelText('News Type').value).toBe('Breaking News');
  });
});


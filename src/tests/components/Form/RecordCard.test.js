import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecordCard from '../../../components/Form/RecordCard';

const mockFields = [
  { name: 'newsTitle', label: 'News Title', type: 'text' },
  { name: 'newsType', label: 'News Type', type: 'select' },
  { name: 'newsThumbnailUrl', label: 'Thumbnail Url', type: 'url' }
];

const mockRecord = {
  newsTitle: 'Test News',
  newsType: 'Breaking News',
  newsThumbnailUrl: 'https://example.com/image.jpg'
};

describe('RecordCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders record number', () => {
    render(
      <RecordCard
        record={mockRecord}
        fields={mockFields}
        index={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('Record 1')).toBeInTheDocument();
  });

  test('displays field values from record', () => {
    render(
      <RecordCard
        record={mockRecord}
        fields={mockFields}
        index={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('Test News')).toBeInTheDocument();
    expect(screen.getByText('Breaking News')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <RecordCard
        record={mockRecord}
        fields={mockFields}
        index={2}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButton = screen.getByTitle('Edit record');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(2);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <RecordCard
        record={mockRecord}
        fields={mockFields}
        index={1}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByTitle('Delete record');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('shows "No data entered" for empty record', () => {
    render(
      <RecordCard
        record={{}}
        fields={mockFields}
        index={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('No data entered')).toBeInTheDocument();
  });

  test('truncates long values', () => {
    const longRecord = {
      newsTitle: 'This is a very long news title that should be truncated in the display'
    };
    
    render(
      <RecordCard
        record={longRecord}
        fields={mockFields}
        index={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Value is truncated at 30 characters + "..."
    expect(screen.getByText('This is a very long news title...')).toBeInTheDocument();
  });
});


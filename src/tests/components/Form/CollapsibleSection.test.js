import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CollapsibleSection from '../../../components/Form/CollapsibleSection';

describe('CollapsibleSection', () => {
  const defaultProps = {
    title: 'Test Section',
    isExpanded: false,
    onToggle: jest.fn(),
    children: <div>Section Content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the section title', () => {
    render(<CollapsibleSection {...defaultProps} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(<CollapsibleSection {...defaultProps} />);
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });

  test('calls onToggle when header is clicked', () => {
    render(<CollapsibleSection {...defaultProps} />);
    const header = screen.getByRole('button');
    fireEvent.click(header);
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  test('has collapsed class when not expanded', () => {
    const { container } = render(<CollapsibleSection {...defaultProps} />);
    expect(container.firstChild).not.toHaveClass('expanded');
  });

  test('has expanded class when expanded', () => {
    const { container } = render(
      <CollapsibleSection {...defaultProps} isExpanded={true} />
    );
    expect(container.firstChild).toHaveClass('expanded');
  });

  test('has highlight class when highlight prop is true', () => {
    const { container } = render(
      <CollapsibleSection {...defaultProps} highlight={true} />
    );
    expect(container.firstChild).toHaveClass('highlight');
  });

  test('icon has rotated class when expanded', () => {
    render(<CollapsibleSection {...defaultProps} isExpanded={true} />);
    const icon = screen.getByText('▼');
    expect(icon).toHaveClass('rotated');
  });

  test('icon does not have rotated class when collapsed', () => {
    render(<CollapsibleSection {...defaultProps} isExpanded={false} />);
    const icon = screen.getByText('▼');
    expect(icon).not.toHaveClass('rotated');
  });

  test('button has correct aria-expanded attribute when collapsed', () => {
    render(<CollapsibleSection {...defaultProps} isExpanded={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('button has correct aria-expanded attribute when expanded', () => {
    render(<CollapsibleSection {...defaultProps} isExpanded={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});


import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';

// Helper to render with Router
const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  test('renders the brand name', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Content Manager')).toBeInTheDocument();
  });

  test('renders Form navigation link', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Form')).toBeInTheDocument();
  });

  test('renders Upload navigation link', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  test('Form link has correct href', () => {
    renderWithRouter(<Navbar />);
    const formLink = screen.getByText('Form').closest('a');
    expect(formLink).toHaveAttribute('href', '/form');
  });

  test('Upload link has correct href', () => {
    renderWithRouter(<Navbar />);
    const uploadLink = screen.getByText('Upload').closest('a');
    expect(uploadLink).toHaveAttribute('href', '/upload');
  });
});


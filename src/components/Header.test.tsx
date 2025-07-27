import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { SearchProvider } from '../context/SearchContext';
import { ThemeProvider } from '../context/ThemeContext';

describe('Header', () => {
  it('renders the application title and search bar', () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <ThemeProvider>
            <Header />
          </ThemeProvider>
        </SearchProvider>
      </BrowserRouter>
    );

    // Check for the title link
    expect(screen.getByText('Docker Registry UI')).toBeInTheDocument();
    
    // Check for the search input
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();

    // Check for the theme toggle button
    expect(screen.getByTitle('Switch to light mode')).toBeInTheDocument();
  });
});

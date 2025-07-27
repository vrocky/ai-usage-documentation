import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { ThemeToggle } from './ThemeToggle';
import { ShipWheel } from 'lucide-react';

export function Header() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 transition-colors duration-300">
      <div className="container mx-auto p-4 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <ShipWheel className="text-primary" />
          <span>Docker Registry UI</span>
        </Link>
        <div className="flex-grow flex justify-end items-center gap-4">
          <div className="w-full max-w-xs">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-300"
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

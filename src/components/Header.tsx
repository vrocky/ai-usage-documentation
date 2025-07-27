import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

export function Header() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Docker Registry UI</Link>
        <div className="w-full max-w-xs">
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-zinc-700 border border-zinc-600 rounded-md text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
}

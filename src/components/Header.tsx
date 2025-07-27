import React from 'react';

export function Header() {
  return (
    <header className="bg-zinc-800 border-b border-zinc-700">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Docker Registry UI</h1>
        {/* Search bar can be added here later */}
      </div>
    </header>
  );
}

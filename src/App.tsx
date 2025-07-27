import React from 'react';
import { Header } from './components/Header';
import { RepositoryList } from './components/RepositoryList';

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans">
      <Header />
      <main className="container mx-auto p-4">
        <RepositoryList />
      </main>
    </div>
  );
}

export default App;

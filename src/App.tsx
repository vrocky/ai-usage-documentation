import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import RepositoryListPage from './pages/RepositoryListPage';
import RepositoryDetailPage from './pages/RepositoryDetailPage';

function Layout() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans">
      <Header />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RepositoryListPage />} />
        <Route path="repositories/:repositoryName" element={<RepositoryDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;

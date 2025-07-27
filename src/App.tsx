import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import RepositoryListPage from './pages/RepositoryListPage';
import RepositoryDetailPage from './pages/RepositoryDetailPage';
import ImageDetailsPage from './pages/ImageDetailsPage';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { ThemeProvider } from './context/ThemeContext';

function Layout() {
  return (
    <SearchProvider>
      <ToastProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
            <Header />
            <main className="container mx-auto p-4">
              <Outlet />
            </main>
            <ToastContainer />
          </div>
        </ThemeProvider>
      </ToastProvider>
    </SearchProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RepositoryListPage />} />
        <Route path="repositories/:repositoryName" element={<RepositoryDetailPage />} />
        <Route path="repositories/:repositoryName/manifests/:digest" element={<ImageDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

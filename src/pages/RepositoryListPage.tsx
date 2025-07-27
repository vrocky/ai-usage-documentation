import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';

// A simple box icon as a placeholder
const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

export default function RepositoryListPage() {
  const container = useContainer();
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        const registryService = container.get<IRegistryService>(TYPES.RegistryService);
        const repositories = await registryService.getRepositories();
        setRepos(repositories);
      } catch (err) {
        setError('Failed to fetch repositories. Make sure the registry and proxy are running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [container]);

  if (loading) {
    return <div className="text-center p-8">Loading repositories...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-400">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo) => (
          <Link to={`/repositories/${repo}`} key={repo} className="flex items-start gap-4 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors shadow-md">
            <BoxIcon />
            <div className="flex-grow">
              <h3 className="font-semibold text-lg break-all">{repo}</h3>
              <p className="text-sm text-zinc-400">Docker Image Repository</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

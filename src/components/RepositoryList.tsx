import React, { useState, useEffect } from 'react';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';

export function RepositoryList() {
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
    <div className="bg-zinc-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold p-4 border-b border-zinc-700">Repositories ({repos.length})</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo} className="border-b border-zinc-700 last:border-b-0">
            <a href="#" className="block p-4 hover:bg-zinc-700 transition-colors">
              {repo}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

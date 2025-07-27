import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';

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
          <Link to={`/repositories/${repo}`} key={repo} className="block p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors shadow-md">
            <h3 className="font-semibold text-lg truncate">{repo}</h3>
            <p className="text-sm text-zinc-400">View tags</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

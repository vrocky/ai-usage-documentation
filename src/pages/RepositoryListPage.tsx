import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';
import { useSearch } from '../context/SearchContext';
import { Package } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { SkeletonLoader } from '../components/SkeletonLoader';

export default function RepositoryListPage() {
  const container = useContainer();
  const { searchQuery } = useSearch();
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

  const filteredRepos = useMemo(() => {
    return repos.filter(repo => repo.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [repos, searchQuery]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg">
              <SkeletonLoader className="h-6 w-6 mt-1 rounded-full" />
              <div className="flex-grow space-y-2">
                <SkeletonLoader className="h-5 w-3/4" />
                <SkeletonLoader className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Error" description={error} />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Repositories</h2>
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <Link to={`/repositories/${repo}`} key={repo} className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:bg-accent hover:border-ring/50 transition-colors shadow-sm">
              <Package className="h-6 w-6 text-muted-foreground mt-1" />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg break-all text-foreground">{repo}</h3>
                <p className="text-sm text-muted-foreground">Docker Image Repository</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No repositories found"
          description={searchQuery ? "Try adjusting your search." : "This registry does not contain any repositories yet."}
        />
      )}
    </div>
  );
}

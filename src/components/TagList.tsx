import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';
import type { TagDetail } from '../types/docker';
import { ConfirmationModal } from './ConfirmationModal';
import { useSearch } from '../context/SearchContext';
import { SkeletonLoader } from './SkeletonLoader';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useToasts } from '../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface TagListProps {
  repositoryName: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export function TagList({ repositoryName }: TagListProps) {
  const container = useContainer();
  const { searchQuery } = useSearch();
  const { addToast } = useToasts();
  const [copyStatus, copy] = useCopyToClipboard();
  const [tags, setTags] = useState<Partial<TagDetail>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Partial<TagDetail> | null>(null);

  const fetchManifestForTag = useCallback(async (tagName: string) => {
    try {
      const registryService = container.get<IRegistryService>(TYPES.RegistryService);
      const manifest = await registryService.getManifest(repositoryName, tagName);
      setTags(currentTags =>
        currentTags.map(t => t.tag === tagName ? { tag: tagName, ...manifest } : t)
      );
    } catch (err) {
      console.error(`Failed to fetch manifest for ${tagName}`, err);
      // You could set an error state on the specific tag row here
    }
  }, [container, repositoryName]);

  const fetchTags = useCallback(async (url?: string) => {
    const isLoadingMore = !!url;
    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const registryService = container.get<IRegistryService>(TYPES.RegistryService);
      const response = await registryService.getTags(repositoryName, url);
      
      const newTags: Partial<TagDetail>[] = response.tags.map(tag => ({ tag }));
      setTags(currentTags => isLoadingMore ? [...currentTags, ...newTags] : newTags);
      setNextPageUrl(response.nextPageUrl);

      // Fetch manifests for the new tags
      newTags.forEach(tag => {
        if (tag.tag) fetchManifestForTag(tag.tag);
      });

    } catch (err) {
      setError(`Failed to fetch tags for ${repositoryName}.`);
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [container, repositoryName, fetchManifestForTag]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const filteredTags = useMemo(() => {
    return tags.filter(t => t.tag?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tags, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!tagToDelete || !tagToDelete.digest) return;

    try {
      const registryService = container.get<IRegistryService>(TYPES.RegistryService);
      await registryService.deleteManifest(repositoryName, tagToDelete.digest);
      setTags(currentTags => currentTags.filter(t => t.tag !== tagToDelete.tag));
      addToast(`Tag ${tagToDelete.tag} deleted successfully.`, 'success');
    } catch (err) {
      const errorMessage = `Failed to delete tag ${tagToDelete.tag}. Ensure the registry allows deletions.`;
      setError(errorMessage);
      addToast(errorMessage, 'error');
      console.error(err);
    } finally {
      setTagToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-16 w-full" />)}
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Error" description={error} />;
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-border">Tags ({filteredTags.length})</h3>
        <div className="overflow-x-auto">
          {filteredTags.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-muted text-muted-foreground text-sm">
                <tr>
                  <th className="p-3 font-semibold">Tag</th>
                  <th className="p-3 font-semibold">Digest</th>
                  <th className="p-3 font-semibold">Size</th>
                  <th className="p-3 font-semibold">Created</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag) => (
                  <tr key={tag.tag} className="border-b border-border last:border-b-0 hover:bg-accent">
                    <td className="p-3 font-mono" title={`docker pull ${repositoryName}:${tag.tag}`}>{tag.tag}</td>
                    <td className="p-3 font-mono text-muted-foreground truncate">
                      {tag.digest ? (
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/repositories/${repositoryName}/manifests/${tag.digest}`}
                            className="hover:text-foreground hover:underline"
                            title={tag.digest}
                          >
                            {tag.digest.substring(0, 19)}...
                          </Link>
                          <button onClick={() => { copy(tag.digest!); addToast('Digest copied!', 'info'); }} title="Copy digest" className="text-muted-foreground hover:text-foreground">
                            <Copy size={16} />
                          </button>
                        </div>
                      ) : <SkeletonLoader className="h-4 w-32" />}
                    </td>
                    <td className="p-3">
                      {tag.totalSize !== undefined ? formatBytes(tag.totalSize) : <SkeletonLoader className="h-4 w-16" />}
                    </td>
                    <td className="p-3 text-muted-foreground" title={tag.configBlob?.created ? new Date(tag.configBlob.created).toLocaleString() : ''}>
                      {tag.configBlob?.created ? timeAgo(tag.configBlob.created) : <SkeletonLoader className="h-4 w-24" />}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setTagToDelete(tag)}
                        className="text-muted-foreground hover:text-destructive text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!tag.digest}
                        title={!tag.digest ? "Cannot delete tag without a digest" : "Delete tag"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="font-semibold">No tags found</p>
              <p className="text-sm">{searchQuery ? "Try adjusting your search." : "This repository has no tags."}</p>
            </div>
          )}
        </div>
        {nextPageUrl && (
          <div className="p-4 border-t border-border text-center">
            <button
              onClick={() => fetchTags(nextPageUrl)}
              disabled={loadingMore}
              className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-wait"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tag"
      >
        <p>Are you sure you want to delete the tag <strong className="text-foreground">{tagToDelete?.tag}</strong>?</p>
        <p className="text-sm text-muted-foreground mt-2">This will delete the manifest associated with the tag. This action might be irreversible.</p>
      </ConfirmationModal>
    </>
  );
}

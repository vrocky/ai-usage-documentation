import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';
import type { TagDetail } from '../types/docker';
import { ConfirmationModal } from './ConfirmationModal';

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

export function TagList({ repositoryName }: TagListProps) {
  const container = useContainer();
  const [tags, setTags] = useState<TagDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<TagDetail | null>(null);

  const fetchTagDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const registryService = container.get<IRegistryService>(TYPES.RegistryService);
      const tagNames = await registryService.getTags(repositoryName);
      
      const tagDetails = await Promise.all(
        tagNames.map(async (tag) => {
          const manifest = await registryService.getManifest(repositoryName, tag);
          return { tag, ...manifest };
        })
      );

      setTags(tagDetails);
    } catch (err) {
      setError(`Failed to fetch tags for ${repositoryName}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTagDetails();
  }, [container, repositoryName]);

  const handleDeleteConfirm = async () => {
    if (!tagToDelete || !tagToDelete.digest) return;

    try {
      const registryService = container.get<IRegistryService>(TYPES.RegistryService);
      await registryService.deleteManifest(repositoryName, tagToDelete.digest);
      // Optimistically remove the tag from the list
      setTags(tags.filter(t => t.tag !== tagToDelete.tag));
    } catch (err) {
      setError(`Failed to delete tag ${tagToDelete.tag}. Ensure the registry allows deletions.`);
      console.error(err);
    } finally {
      setTagToDelete(null);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading tags...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-400">{error}</div>;
  }

  return (
    <>
      <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-zinc-700">Tags ({tags.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-700 text-sm text-zinc-300">
              <tr>
                <th className="p-3 font-semibold">Tag</th>
                <th className="p-3 font-semibold">Digest</th>
                <th className="p-3 font-semibold">Size</th>
                <th className="p-3 font-semibold">Layers</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.tag} className="border-b border-zinc-700 last:border-b-0 hover:bg-zinc-700/50">
                  <td className="p-3 font-mono">{tag.tag}</td>
                  <td className="p-3 font-mono text-zinc-400 truncate">
                    <Link 
                      to={`/repositories/${repositoryName}/manifests/${tag.digest}`}
                      className="hover:text-white hover:underline"
                      title={tag.digest}
                    >
                      {tag.digest?.substring(0, 19)}...
                    </Link>
                  </td>
                  <td className="p-3">{formatBytes(tag.totalSize ?? 0)}</td>
                  <td className="p-3">{tag.layers.length}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => setTagToDelete(tag)}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                      disabled={!tag.digest}
                      title={!tag.digest ? "Cannot delete tag without a digest" : "Delete tag"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tag"
      >
        <p>Are you sure you want to delete the tag <strong>{tagToDelete?.tag}</strong>?</p>
        <p className="text-sm text-zinc-400 mt-2">This will delete the manifest associated with the tag. This action might be irreversible.</p>
      </ConfirmationModal>
    </>
  );
}

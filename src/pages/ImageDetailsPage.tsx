import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';
import type { ImageManifest } from '../types/docker';
import { Breadcrumbs } from '../components/Breadcrumbs';

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function ImageDetailsPage() {
  const { repositoryName, digest } = useParams<{ repositoryName: string; digest: string }>();
  const container = useContainer();
  const [manifest, setManifest] = useState<ImageManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManifest = async () => {
      if (!repositoryName || !digest) return;
      try {
        setLoading(true);
        setError(null);
        const registryService = container.get<IRegistryService>(TYPES.RegistryService);
        // The digest is the "tag" we use to fetch the manifest by its content address
        const manifestData = await registryService.getManifest(repositoryName, digest);
        setManifest(manifestData);
      } catch (err) {
        setError('Failed to fetch image details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManifest();
  }, [container, repositoryName, digest]);

  if (loading) {
    return <div className="text-center p-8">Loading image details...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-400">{error}</div>;
  }

  if (!manifest || !repositoryName) {
    return <div>Image details not found.</div>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Repositories', path: '/' },
          { label: repositoryName, path: `/repositories/${repositoryName}` },
          { label: 'manifest' },
        ]}
      />
      <div className="mt-4">
        <h2 className="text-2xl font-bold break-all">{repositoryName}</h2>
        <p className="text-sm text-zinc-400 font-mono mt-1 break-all" title={digest}>
          Digest: {digest}
        </p>
      </div>

      <div className="mt-6 bg-zinc-800 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-zinc-700">Image Layers ({manifest.layers.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-700 text-sm text-zinc-300">
              <tr>
                <th className="p-3 font-semibold">Digest</th>
                <th className="p-3 font-semibold">Size</th>
              </tr>
            </thead>
            <tbody>
              {manifest.layers.map((layer, index) => (
                <tr key={index} className="border-b border-zinc-700 last:border-b-0">
                  <td className="p-3 font-mono text-zinc-400 break-all">{layer.digest}</td>
                  <td className="p-3">{formatBytes(layer.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

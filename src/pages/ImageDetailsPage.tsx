import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';
import type { ImageManifest } from '../types/docker';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useToasts } from '../context/ToastContext';

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
  const { addToast } = useToasts();
  const [copyStatus, copy] = useCopyToClipboard();
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
        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-400 font-mono mt-1 break-all" title={digest}>
            Digest: {digest}
          </p>
          <button onClick={() => { copy(digest!); addToast('Digest copied!', 'info'); }} title="Copy digest" className="mt-1 text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
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
          <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <h3 className="text-lg font-semibold p-4 border-b border-zinc-700">History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {manifest.configBlob?.history.map((h, index) => (
                    <tr key={index} className="border-b border-zinc-700 last:border-b-0">
                      <td className="p-3 font-mono text-xs text-zinc-300 break-all whitespace-pre-wrap">{h.created_by}</td>
                    </tr>
                  )).reverse()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Configuration</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-zinc-400">Command</h4>
                <pre className="bg-zinc-900 p-2 rounded-md mt-1 font-mono text-xs break-all">
                  {manifest.configBlob?.config.Cmd?.join(' ') || 'N/A'}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-400">Working Directory</h4>
                <p className="font-mono text-xs mt-1">{manifest.configBlob?.config.WorkingDir || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-400">Environment Variables</h4>
                <div className="space-y-1 mt-1">
                  {manifest.configBlob?.config.Env?.map((env, i) => (
                    <pre key={i} className="font-mono text-xs break-all">{env}</pre>
                  )) || <p className="text-xs">None</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

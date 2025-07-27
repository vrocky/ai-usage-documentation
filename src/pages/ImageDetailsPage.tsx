import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContainer } from '../hooks/useContainer';
import { TYPES } from '../inversify/types';
import type { IRegistryService } from '../services/IRegistryService';
import type { ImageManifest } from '../types/docker';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useToasts } from '../context/ToastContext';
import { Copy, Layers, History } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { SkeletonLoader } from '../components/SkeletonLoader';

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
    return (
      <div className="space-y-6">
        <SkeletonLoader className="h-10 w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonLoader className="h-64 w-full rounded-lg" />
            <SkeletonLoader className="h-48 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1">
            <SkeletonLoader className="h-72 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Error" description={error} />;
  }

  if (!manifest || !repositoryName) {
    return <EmptyState title="Not Found" description="The requested image manifest could not be found." />;
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Repositories', path: '/' },
          { label: repositoryName, path: `/repositories/${repositoryName}` },
          { label: 'Manifest Details' },
        ]}
      />
      <div className="mt-4">
        <h2 className="text-2xl font-bold break-all">{repositoryName}</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground font-mono mt-1 break-all" title={digest}>
            Digest: {digest}
          </p>
          <button onClick={() => { copy(digest!); addToast('Digest copied!', 'info'); }} title="Copy digest" className="mt-1 text-muted-foreground hover:text-foreground">
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <h3 className="text-lg font-semibold p-4 flex items-center gap-2 border-b border-border">
              <Layers size={20} className="text-primary" />
              <span>Image Layers ({manifest.layers.length})</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted text-sm text-muted-foreground">
                  <tr>
                    <th className="p-3 font-semibold">Digest</th>
                    <th className="p-3 font-semibold">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {manifest.layers.map((layer, index) => (
                    <tr key={index} className="border-b border-border last:border-b-0 hover:bg-accent">
                      <td className="p-3 font-mono text-muted-foreground break-all">{layer.digest}</td>
                      <td className="p-3">{formatBytes(layer.size)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <h3 className="text-lg font-semibold p-4 flex items-center gap-2 border-b border-border">
              <History size={20} className="text-primary" />
              <span>History</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {manifest.configBlob?.history.map((h, index) => (
                    <tr key={index} className="border-b border-border last:border-b-0 hover:bg-accent">
                      <td className="p-3 font-mono text-xs text-muted-foreground break-all whitespace-pre-wrap">{h.created_by}</td>
                    </tr>
                  )).reverse()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Configuration</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-muted-foreground">OS / Arch</h4>
                <p className="font-mono text-xs mt-1">{manifest.configBlob?.os || 'N/A'} / {manifest.configBlob?.architecture || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground">Author</h4>
                <p className="font-mono text-xs mt-1">{manifest.configBlob?.author || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground">Command</h4>
                <pre className="bg-muted p-2 rounded-md mt-1 font-mono text-xs break-all whitespace-pre-wrap text-foreground">
                  {manifest.configBlob?.config.Cmd?.join(' ') || 'N/A'}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground">Working Directory</h4>
                <p className="font-mono text-xs mt-1">{manifest.configBlob?.config.WorkingDir || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground">Environment Variables</h4>
                <div className="space-y-1 mt-1">
                  {manifest.configBlob?.config.Env?.length ? (
                    manifest.configBlob.config.Env.map((env, i) => (
                      <pre key={i} className="font-mono text-xs break-all">{env}</pre>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">None</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

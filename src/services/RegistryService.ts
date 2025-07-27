import axios from 'axios';
import type { IRegistryService } from './IRegistryService';
import { injectable } from 'inversify';
import type { ImageManifest } from '../types/docker';

@injectable()
export class RegistryService implements IRegistryService {
  private readonly client = axios.create({
    // The base URL will be proxied by Vite's dev server to the actual registry.
    baseURL: '/v2',
  });

  public async getRepositories(): Promise<string[]> {
    const response = await this.client.get<{ repositories: string[] }>('/_catalog');
    return response.data.repositories;
  }

  public async getTags(repositoryName: string): Promise<string[]> {
    const response = await this.client.get<{ name: string; tags: string[] }>(`/${repositoryName}/tags/list`);
    return response.data.tags;
  }

  public async getManifest(repositoryName: string, tag: string): Promise<ImageManifest> {
    const response = await this.client.get<ImageManifest>(`/${repositoryName}/manifests/${tag}`, {
      headers: {
        // Request the V2 manifest
        'Accept': 'application/vnd.docker.distribution.manifest.v2+json'
      }
    });
    // Add the digest from the response headers
    const digest = response.headers['docker-content-digest'];
    const totalSize = response.data.layers.reduce((acc, layer) => acc + layer.size, 0) + response.data.config.size;
    return { ...response.data, digest, totalSize };
  }

  public async deleteManifest(repositoryName: string, digest: string): Promise<void> {
    await this.client.delete(`/${repositoryName}/manifests/${digest}`, {
      headers: {
        // This header is often required, even for DELETE
        'Accept': 'application/vnd.docker.distribution.manifest.v2+json'
      }
    });
  }
}

import axios from 'axios';
import type { IRegistryService, TagsResponse } from './IRegistryService';
import { injectable } from 'inversify';
import type { ImageManifest, ImageConfig } from '../types/docker';

const parseLinkHeader = (linkHeader: string): string | undefined => {
  if (!linkHeader) return undefined;
  const match = /<([^>]+)>; rel="next"/.exec(linkHeader);
  return match ? match[1] : undefined;
};

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

  public async getTags(repositoryName: string, url: string = `/${repositoryName}/tags/list`): Promise<TagsResponse> {
    const response = await this.client.get<{ name: string; tags: string[] }>(url);
    const nextPageUrl = parseLinkHeader(response.headers['link']);
    return {
      tags: response.data.tags,
      nextPageUrl,
    };
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
    const configBlob = await this.getConfig(repositoryName, response.data.config.digest);
    return { ...response.data, digest, totalSize, configBlob };
  }

  public async getConfig(repositoryName: string, digest: string): Promise<ImageConfig> {
    const response = await this.client.get<ImageConfig>(`/${repositoryName}/blobs/${digest}`);
    return response.data;
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

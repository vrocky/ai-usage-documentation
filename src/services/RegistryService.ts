import axios from 'axios';
import type { IRegistryService } from './IRegistryService';
import { injectable } from 'inversify';

@injectable()
export class RegistryService implements IRegistryService {
  private readonly client = axios.create({
    // The base URL will be proxied by Vite's dev server to the proxy server
    // which then forwards to the actual registry.
    baseURL: '/v2',
  });

  public async getRepositories(): Promise<string[]> {
    const response = await this.client.get<{ repositories: string[] }>('/_catalog');
    return response.data.repositories;
  }
}

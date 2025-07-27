import type { ImageManifest } from "../types/docker";

export interface IRegistryService {
    getRepositories(): Promise<string[]>;
    getTags(repositoryName: string): Promise<string[]>;
    getManifest(repositoryName: string, tag: string): Promise<ImageManifest>;
    deleteManifest(repositoryName: string, digest: string): Promise<void>;
}

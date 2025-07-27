import type { ImageManifest, ImageConfig } from "../types/docker";

export interface TagsResponse {
    tags: string[];
    nextPageUrl?: string;
}

export interface IRegistryService {
    getRepositories(): Promise<string[]>;
    getTags(repositoryName: string, url?: string): Promise<TagsResponse>;
    getManifest(repositoryName: string, tag: string): Promise<ImageManifest>;
    getConfig(repositoryName: string, digest: string): Promise<ImageConfig>;
    deleteManifest(repositoryName: string, digest: string): Promise<void>;
}

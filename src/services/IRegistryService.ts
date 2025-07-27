export interface IRegistryService {
    getRepositories(): Promise<string[]>;
}

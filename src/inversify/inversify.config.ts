import { Container } from 'inversify';
import { TYPES } from './types';
import { RegistryService } from '../services/RegistryService';
import type { IRegistryService } from '../services/IRegistryService';

const container = new Container();

container.bind<IRegistryService>(TYPES.RegistryService).to(RegistryService).inSingletonScope();

export { container };

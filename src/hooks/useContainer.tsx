import React, { createContext, useContext } from 'react';
import { container } from '../inversify/inversify.config';
import type { Container } from 'inversify';

const InversifyContext = createContext<Container | null>(null);

export function ContainerProvider({ children }: { children: React.ReactNode }) {
  return (
    <InversifyContext.Provider value={container}>
      {children}
    </InversifyContext.Provider>
  );
}

export function useContainer() {
  const context = useContext(InversifyContext);
  if (!context) {
    throw new Error('useContainer must be used within a ContainerProvider');
  }
  return context;
}

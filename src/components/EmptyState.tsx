import { PackageSearch } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center p-8 bg-card border border-border rounded-lg shadow-sm">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-muted">
        <PackageSearch className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

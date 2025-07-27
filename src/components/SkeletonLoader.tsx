import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse bg-zinc-700 rounded ${className}`} />
  );
}

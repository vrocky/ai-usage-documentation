export interface ImageManifest {
  schemaVersion: number;
  mediaType: string;
  config: {
    mediaType: string;
    size: number;
    digest: string;
  };
  layers: {
    mediaType: string;
    size: number;
    digest: string;
  }[];
  // This is not part of the standard manifest, but we'll add it for convenience
  digest?: string;
  totalSize?: number;
}

export interface TagDetail extends ImageManifest {
  tag: string;
  // This is from the config blob, which we are not fetching yet.
  // created?: string; 
}

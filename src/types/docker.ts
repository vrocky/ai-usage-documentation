export interface ImageConfig {
  created: string;
  author: string;
  architecture: string;
  os: string;
  config: {
    Env: string[];
    Cmd: string[];
    WorkingDir: string;
  };
  history: {
    created: string;
    created_by: string;
    empty_layer?: boolean;
  }[];
}

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
  configBlob?: ImageConfig;
}

export interface TagDetail extends ImageManifest {
  tag: string;
}

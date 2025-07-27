import { useState, useCallback } from 'react';

type CopyStatus = 'inactive' | 'copied' | 'failed';

export function useCopyToClipboard(): [CopyStatus, (text: string) => void] {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('inactive');

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus('copied'),
      () => setCopyStatus('failed')
    );
  }, []);

  return [copyStatus, copy];
}

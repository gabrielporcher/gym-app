import { useEffect, useState } from 'react';

import { prepareLocalDatabase } from '@/repositories/local-database';

export type LocalDatabaseStatus = 'pending' | 'ready' | 'error';

export function useLocalDatabase(): LocalDatabaseStatus {
  const [status, setStatus] = useState<LocalDatabaseStatus>('pending');

  useEffect(() => {
    let active = true;

    prepareLocalDatabase()
      .then(() => {
        if (active) {
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return status;
}

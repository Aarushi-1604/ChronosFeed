import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface WorldStatus {
  worldId: string;
  status: 'generating' | 'ready' | 'error';
  name: string | null;
  era: string | null;
}

export function useWorldStatus(worldId: string | null, intervalMs: number = 1500) {
  const [status, setStatus] = useState<'generating' | 'ready' | 'error' | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [era, setEra] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!worldId) {
      setStatus(null);
      setName(null);
      setEra(null);
      setError(null);
      return;
    }

    setStatus('generating');

    let isMounted = true;
    let timerId: ReturnType<typeof setInterval> | null = null;

    async function checkStatus() {
      if (!worldId) return;
      try {
        const data = await api.getWorldStatus(worldId);
        if (!isMounted) return;

        setStatus(data.status);
        if (data.name) setName(data.name);
        if (data.era) setEra(data.era);

        if (data.status === 'ready' || data.status === 'error') {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error polling world status:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    // Run first check immediately
    checkStatus();

    // Set interval for subsequent checks
    timerId = setInterval(() => {
      checkStatus();
    }, intervalMs);

    return () => {
      isMounted = false;
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [worldId, intervalMs]);

  return { status, name, era, error };
}

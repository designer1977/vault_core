import { useCallback } from 'react';
import { base44 } from '@/api/base44Client';

export function useTrackEvent() {
  const track = useCallback((eventName) => {
    if (!eventName) return;
    base44.entities.AnalyticsEvent.create({ name: eventName }).catch(() => {});
  }, []);

  return track;
}
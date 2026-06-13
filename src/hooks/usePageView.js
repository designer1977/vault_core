import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function usePageView(slug) {
  useEffect(() => {
    if (!slug) return;
    const referrer = document.referrer ? new URL(document.referrer).hostname : '';
    base44.entities.PageView.create({ slug, referrer }).catch(() => {});
  }, [slug]);
}
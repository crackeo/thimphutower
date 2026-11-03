'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { EnquiryPrefill } from '@/lib/openEnquiry';

const Panel = dynamic(() => import('./EnquiryDrawerPanel'), { ssr: false });

/** Loads the enquiry drawer only the first time someone asks for it. */
export function EnquiryDrawer() {
  const [first, setFirst] = useState<EnquiryPrefill | null>(null);
  useEffect(() => {
    const onFirst = (e: Event) => setFirst((f) => f ?? ((e as CustomEvent<EnquiryPrefill>).detail || {}));
    window.addEventListener('tt:enquire', onFirst);
    return () => window.removeEventListener('tt:enquire', onFirst);
  }, []);
  return first ? <Panel initial={first} /> : null;
}

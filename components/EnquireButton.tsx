'use client';
import type { ReactNode } from 'react';
import { openEnquiry, type EnquiryPrefill } from '@/lib/openEnquiry';

/** A link to the contact form that opens the enquiry drawer instead when JavaScript runs. */
export function EnquireButton({ prefill = {}, className = 'btn btn--gold', children }: { prefill?: EnquiryPrefill; className?: string; children: ReactNode }) {
  const q = prefill.room ? `?room=${prefill.room}` : '';
  return (
    <a
      href={`/contact/${q}#enquire`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openEnquiry(prefill);
      }}
    >
      {children}
    </a>
  );
}

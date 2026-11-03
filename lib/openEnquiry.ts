export type EnquiryPrefill = { room?: string; arrive?: string; depart?: string; adults?: string; nights?: number };

/** Opens the global enquiry drawer (components/EnquiryDrawer.tsx). */
export function openEnquiry(detail: EnquiryPrefill = {}) {
  window.dispatchEvent(new CustomEvent<EnquiryPrefill>('tt:enquire', { detail }));
}

import { hotel, rooms, nu } from '@/content/site';

export type Enquiry = {
  name: string;
  email: string;
  phone?: string;
  room?: string;
  arrive?: string;
  depart?: string;
  adults?: string;
  children?: string;
  message?: string;
};

export function composeEnquiry(e: Enquiry) {
  const room = rooms.find((r) => r.slug === e.room);
  const subject = `Room enquiry${room ? `: ${room.name}` : ''}${e.arrive ? `, ${e.arrive}` : ''}`;
  const lines = [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    e.phone && `Phone: ${e.phone}`,
    room ? `Room: ${room.name} (${nu(room.price)} per night)` : 'Room: no preference',
    e.arrive && `Arrival: ${e.arrive}`,
    e.depart && `Departure: ${e.depart}`,
    `Guests: ${e.adults || '1'} adult(s), ${e.children || '0'} child(ren)`,
    '',
    e.message || '',
  ].filter((l): l is string => typeof l === 'string');
  return { subject, body: lines.join('\n') };
}

/**
 * The one place an enquiry leaves the site. Today it opens the visitor's email app with a
 * pre-filled message to the hotel. To use a form service instead (Netlify Forms, Formspree),
 * replace the body of this function with a fetch() POST and return { ok, error }.
 */
export async function sendEnquiry(e: Enquiry): Promise<{ ok: boolean; mode: 'mailto' | 'service'; href?: string }> {
  const { subject, body } = composeEnquiry(e);
  const href = `mailto:${hotel.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
  return { ok: true, mode: 'mailto', href };
}

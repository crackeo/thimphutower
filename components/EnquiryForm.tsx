'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { hotel, rooms, nu } from '@/content/site';
import { composeEnquiry, sendEnquiry, type Enquiry } from '@/lib/enquiry';
import { IconMail } from './Icons';

type Errors = Partial<Record<keyof Enquiry, string>>;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function EnquiryForm() {
  const [v, setV] = useState<Enquiry>({ name: '', email: '', phone: '', room: '', arrive: '', depart: '', adults: '2', children: '0', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'opened'>('idle');
  const [copied, setCopied] = useState(false);
  const [today, setToday] = useState<string>();
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToday(iso(new Date()));
    const p = new URLSearchParams(window.location.search);
    setV((s) => ({
      ...s,
      room: rooms.some((r) => r.slug === p.get('room')) ? p.get('room')! : s.room,
      arrive: p.get('arrive') ?? s.arrive,
      depart: p.get('depart') ?? s.depart,
      adults: p.get('adults') ?? s.adults,
    }));
  }, []);

  const set = (k: keyof Enquiry) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter an email address we can reply to, like name@example.com.';
    if (v.arrive && v.depart && v.depart <= v.arrive) e.depart = 'Departure needs to be after arrival.';
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    await sendEnquiry(v);
    setStatus('opened');
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const copy = async () => {
    const { subject, body } = composeEnquiry(v);
    try {
      await navigator.clipboard.writeText(`To: ${hotel.email}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const field = (k: keyof Enquiry, label: string, input: React.ReactNode, hint?: string, span2 = false) => (
    <div className={`f${span2 ? ' span-2' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      {hint && <span className="hint" id={`f-${k}-hint`}>{hint}</span>}
      {input}
      {errors[k] && (
        <span className="error" id={`f-${k}-err`} role="alert">
          {errors[k]}
        </span>
      )}
    </div>
  );
  const aria = (k: keyof Enquiry, hint = false) => ({
    id: `f-${k}`,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': [hint && `f-${k}-hint`, errors[k] && `f-${k}-err`].filter(Boolean).join(' ') || undefined,
  });

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby="form-how">
      <p id="form-how" className="note">
        Sending opens your email app with this enquiry ready to go to {hotel.email}. It is a request, not a confirmed booking:
        the front desk replies with availability.
      </p>
      <div className="form-grid">
        {field('name', 'Full name', <input {...aria('name')} value={v.name} onChange={set('name')} autoComplete="name" required />)}
        {field('email', 'Email', <input {...aria('email')} type="email" value={v.email} onChange={set('email')} autoComplete="email" required />)}
        {field('phone', 'Phone (optional)', <input {...aria('phone')} type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" />)}
        {field(
          'room',
          'Room',
          <select {...aria('room')} value={v.room} onChange={set('room')}>
            <option value="">No preference</option>
            {rooms.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} · {nu(r.price)} per night
              </option>
            ))}
          </select>,
        )}
        {field('arrive', 'Arrival', <input {...aria('arrive')} type="date" min={today} value={v.arrive} onChange={set('arrive')} />)}
        {field('depart', 'Departure', <input {...aria('depart')} type="date" min={v.arrive || today} value={v.depart} onChange={set('depart')} />)}
        {field(
          'adults',
          'Adults',
          <select {...aria('adults')} value={v.adults} onChange={set('adults')}>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
          </select>,
        )}
        {field(
          'children',
          'Children',
          <select {...aria('children')} value={v.children} onChange={set('children')}>
            {[0, 1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}
          </select>,
        )}
        {field('message', 'Anything else?', <textarea {...aria('message', true)} value={v.message} onChange={set('message')} />, 'Flight times, group size, special requests.', true)}
      </div>
      <div className="actions">
        <button className="btn btn--gold" type="submit">
          <IconMail /> Write the enquiry email
        </button>
        <a className="link" href={hotel.phone.href}>
          Or call {hotel.phone.display}
        </a>
      </div>
      {status === 'opened' && (
        <div className="form-status" ref={statusRef} tabIndex={-1} role="status">
          <p>
            <strong>Your email app should now be open with the enquiry filled in.</strong> Nothing is sent until you press Send there.
          </p>
          <p style={{ marginTop: 'var(--space-2)' }}>
            Didn’t open?{' '}
            <button type="button" className="link" style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit', color: 'inherit', padding: 0 }} onClick={copy}>
              {copied ? 'Copied: paste it into any email' : 'Copy the enquiry text'}
            </button>{' '}
            and send it to {hotel.email}, or message us on <a href={hotel.mobile.whatsapp}>WhatsApp</a>.
          </p>
        </div>
      )}
    </form>
  );
}

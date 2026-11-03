'use client';
import { useEffect, useRef, useState } from 'react';
import { hotel, nu, rooms } from '@/content/site';
import { composeEnquiry, sendEnquiry, type Enquiry } from '@/lib/enquiry';
import type { EnquiryPrefill } from '@/lib/openEnquiry';
import { Img } from './Img';
import { IconArrow, IconClose, IconMinus, IconPlus } from './Icons';

const STEPS = ['Dates', 'Room', 'Guests', 'Details', 'Review'];
const iso = (d: Date) => d.toISOString().slice(0, 10);
const nightsBetween = (a?: string, b?: string) =>
  a && b ? Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)) : 0;
const fmt = (s?: string) =>
  s ? new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';

const blank: Enquiry = { name: '', email: '', phone: '', room: '', arrive: '', depart: '', adults: '2', children: '0', message: '' };

export default function EnquiryDrawerPanel({ initial }: { initial: EnquiryPrefill }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Enquiry>(blank);
  const [err, setErr] = useState<Partial<Record<keyof Enquiry, string>>>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const today = iso(new Date());

  useEffect(() => {
    const open = (e: Event) => {
      const d = (e as CustomEvent<EnquiryPrefill>).detail || {};
      setV((s) => ({ ...s, room: d.room ?? s.room, arrive: d.arrive || s.arrive, depart: d.depart || s.depart, adults: d.adults || s.adults }));
      setStep(0);
      setSent(false);
      setErr({});
      ref.current?.showModal();
    };
    window.addEventListener('tt:enquire', open);
    open(new CustomEvent('tt:enquire', { detail: initial }));
    return () => window.removeEventListener('tt:enquire', open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof Enquiry, val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    setErr((e) => ({ ...e, [k]: undefined }));
  };
  const nights = nightsBetween(v.arrive, v.depart);
  const room = rooms.find((r) => r.slug === v.room);

  const validate = (s: number) => {
    const e: typeof err = {};
    if (s === 0 && v.arrive && v.depart && v.depart <= v.arrive) e.depart = 'Departure needs to be after arrival.';
    if (s === 3) {
      if (!v.name.trim()) e.name = 'Please tell us your name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter an email address we can reply to, like name@example.com.';
    }
    setErr(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`d-${first}`)?.focus();
    return !first;
  };
  const next = () => validate(step) && setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const send = async () => {
    await sendEnquiry({ ...v, message: [v.message, nights ? `Nights: ${nights}` : ''].filter(Boolean).join('\n') });
    setSent(true);
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
  const count = (k: 'adults' | 'children', min: number, max: number, label: string) => {
    const n = Number(v[k] || 0);
    return (
      <div className="row">
        <span id={`d-${k}-l`}>{label}</span>
        <div className="stepper" role="group" aria-labelledby={`d-${k}-l`}>
          <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={n <= min} onClick={() => set(k, String(n - 1))}>
            <IconMinus width={18} height={18} />
          </button>
          <output aria-live="polite">{n}</output>
          <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={n >= max} onClick={() => set(k, String(n + 1))}>
            <IconPlus width={18} height={18} />
          </button>
        </div>
      </div>
    );
  };
  const field = (k: keyof Enquiry, label: string, input: React.ReactNode) => (
    <div className="f">
      <label htmlFor={`d-${k}`}>{label}</label>
      {input}
      {err[k] && <span className="error" id={`d-${k}-err`} role="alert">{err[k]}</span>}
    </div>
  );
  const a = (k: keyof Enquiry) => ({ id: `d-${k}`, 'aria-invalid': err[k] ? true : undefined, 'aria-describedby': err[k] ? `d-${k}-err` : undefined });

  return (
    <dialog ref={ref} className="drawer" aria-labelledby="drawer-title" onClick={(e) => e.target === e.currentTarget && ref.current?.close()}>
      <div className="drawer__inner">
        <div className="drawer__head">
          <h2 id="drawer-title">Plan your stay</h2>
          <button type="button" className="drawer__close" onClick={() => ref.current?.close()} aria-label="Close">
            <IconClose />
          </button>
        </div>
        <ol className="progress" aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
          {STEPS.map((s, i) => (
            <li key={s} data-state={i < step ? 'done' : i === step ? 'current' : 'todo'} aria-current={i === step ? 'step' : undefined}>
              {s}
            </li>
          ))}
        </ol>
        <div className="drawer__body">
          {sent ? (
            <div className="drawer__step" role="status">
              <h3>Your email is ready to send</h3>
              <p>Your email app should now be open with the enquiry filled in. Nothing is sent until you press Send there.</p>
              <p className="muted small">
                Didn’t open?{' '}
                <button type="button" className="link" style={{ background: 'none', border: 0, cursor: 'pointer', color: 'inherit', borderBottom: '1px solid' }} onClick={copy}>
                  {copied ? 'Copied' : 'Copy the text'}
                </button>{' '}
                and email {hotel.email}, or call <a href={hotel.phone.href}>{hotel.phone.display}</a>.
              </p>
            </div>
          ) : (
            <div className="drawer__step" key={step}>
              {step === 0 && (
                <>
                  <p className="muted">When would you like to stay? You can leave dates open.</p>
                  {field('arrive', 'Arrival', <input {...a('arrive')} type="date" min={today} value={v.arrive} onChange={(e) => set('arrive', e.target.value)} />)}
                  {field('depart', 'Departure', <input {...a('depart')} type="date" min={v.arrive || today} value={v.depart} onChange={(e) => set('depart', e.target.value)} />)}
                  {nights > 0 && <p className="note">{nights} night{nights > 1 ? 's' : ''}</p>}
                </>
              )}
              {step === 1 && (
                <fieldset className="choice" style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend className="muted" style={{ marginBottom: 'var(--s-3)' }}>Choose a room, or leave it to us.</legend>
                  {rooms.map((r) => (
                    <label key={r.slug}>
                      <input type="radio" name="d-room" checked={v.room === r.slug} onChange={() => set('room', r.slug)} />
                      <span className="thumb"><Img k={r.image} sizes="64px" /></span>
                      <span>
                        <strong>{r.name}</strong>
                        <small>{r.category} · {r.occupancy.toLowerCase()} rate</small>
                      </span>
                      <span className="price num">{nu(r.price)}</span>
                    </label>
                  ))}
                  <label>
                    <input type="radio" name="d-room" checked={!v.room} onChange={() => set('room', '')} />
                    <span className="thumb" />
                    <span><strong>No preference</strong><small>We’ll suggest what’s available</small></span>
                    <span />
                  </label>
                </fieldset>
              )}
              {step === 2 && (
                <>
                  <p className="muted">Who’s travelling?</p>
                  <div>
                    {count('adults', 1, 6, 'Adults')}
                    {count('children', 0, 4, 'Children')}
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  {field('name', 'Full name', <input {...a('name')} value={v.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />)}
                  {field('email', 'Email', <input {...a('email')} type="email" value={v.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />)}
                  {field('phone', 'Phone (optional)', <input {...a('phone')} type="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />)}
                  {field('message', 'Anything else? (optional)', <textarea {...a('message')} value={v.message} onChange={(e) => set('message', e.target.value)} placeholder="Flight times, group size, special requests" />)}
                </>
              )}
              {step === 4 && (
                <>
                  <dl className="summary">
                    <div><dt>Arrival</dt><dd>{fmt(v.arrive)}</dd></div>
                    <div><dt>Departure</dt><dd>{fmt(v.depart)}</dd></div>
                    <div><dt>Room</dt><dd>{room ? `${room.name} · ${nu(room.price)}/night` : 'No preference'}</dd></div>
                    <div><dt>Guests</dt><dd>{v.adults} adult(s), {v.children} child(ren)</dd></div>
                    <div><dt>Name</dt><dd>{v.name}</dd></div>
                    <div><dt>Email</dt><dd>{v.email}</dd></div>
                    {room && nights > 0 && (
                      <div><dt>Estimated total</dt><dd className="num">{nu(Math.round(room.price * nights * 1.2))} incl. BST and service</dd></div>
                    )}
                  </dl>
                  <p className="note">This opens your email app with the enquiry ready to send to {hotel.email}. It’s a request: the front desk replies with availability.</p>
                </>
              )}
            </div>
          )}
        </div>
        <div className="drawer__foot">
          {sent ? (
            <button type="button" className="btn btn--line" onClick={() => ref.current?.close()}>Close</button>
          ) : (
            <>
              <button type="button" className="btn btn--line" onClick={back} disabled={step === 0}>Back</button>
              {step < 4 ? (
                <button type="button" className="btn" onClick={next}>Continue <IconArrow /></button>
              ) : (
                <button type="button" className="btn btn--gold" onClick={send}>Write the email <IconArrow /></button>
              )}
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}

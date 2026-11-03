'use client';
import { useState } from 'react';
import { hotel, nu, rooms } from '@/content/site';
import { openEnquiry } from '@/lib/openEnquiry';
import { Img } from './Img';
import { TLink } from './Motion';
import { IconArrow, IconMinus, IconPlus } from './Icons';

type Cat = 'Deluxe' | 'Premium';
type Occ = 'Single' | 'Double';

/** Pick category, rate and nights; shows the estimated total with BST and service charge. */
export function RoomExplorer() {
  const [cat, setCat] = useState<Cat>('Deluxe');
  const [occ, setOcc] = useState<Occ>('Double');
  const [nights, setNights] = useState(3);
  const room = rooms.find((r) => r.category === cat && r.occupancy === occ)!;
  const sub = room.price * nights;
  const bst = Math.round(sub * 0.1);
  const svc = Math.round(sub * 0.1);

  return (
    <div className="rx">
      <div>
        <div className="rx__media reveal-img">
          {rooms.map((r) => (
            <div key={r.slug} className={`rx__img${r.slug === room.slug ? ' is-active' : ''}`} aria-hidden={r.slug !== room.slug}>
              <Img k={r.image} sizes="(max-width: 960px) 100vw, 58vw" />
            </div>
          ))}
        </div>
        <table className="ratecard" style={{ marginTop: 'var(--s-5)' }}>
          <caption>{hotel.taxes}</caption>
          <thead>
            <tr>
              <th scope="col">Room</th>
              <th scope="col">Single rate</th>
              <th scope="col">Double rate</th>
            </tr>
          </thead>
          <tbody>
            {(['Deluxe', 'Premium'] as Cat[]).map((c) => (
              <tr key={c}>
                <th scope="row">{c}</th>
                {(['Single', 'Double'] as Occ[]).map((o) => {
                  const r = rooms.find((x) => x.category === c && x.occupancy === o)!;
                  return (
                    <td key={o}>
                      <button
                        type="button"
                        className="num"
                        aria-pressed={r.slug === room.slug}
                        aria-label={`${r.name}, ${nu(r.price)} per night`}
                        onClick={() => {
                          setCat(c);
                          setOcc(o);
                        }}
                      >
                        {nu(r.price)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rx__panel">
        <div className="rx__controls">
          <div className="seg" role="group" aria-label="Room category">
            {(['Deluxe', 'Premium'] as Cat[]).map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="seg" role="group" aria-label="Rate">
            {(['Single', 'Double'] as Occ[]).map((o) => (
              <button key={o} type="button" aria-pressed={occ === o} onClick={() => setOcc(o)}>{o}</button>
            ))}
          </div>
        </div>
        <h3 className="rx__name" aria-live="polite">{room.name}</h3>
        <p className="muted">{room.description}</p>
        <div className="rx__nights">
          <span id="rx-nights">Nights</span>
          <div className="stepper" role="group" aria-labelledby="rx-nights">
            <button type="button" aria-label="One night fewer" disabled={nights <= 1} onClick={() => setNights((n) => n - 1)}><IconMinus width={18} height={18} /></button>
            <output aria-live="polite">{nights}</output>
            <button type="button" aria-label="One night more" disabled={nights >= 30} onClick={() => setNights((n) => n + 1)}><IconPlus width={18} height={18} /></button>
          </div>
        </div>
        <dl className="rx__calc num">
          <div><dt>{nu(room.price)} × {nights} night{nights > 1 ? 's' : ''}</dt><dd>{nu(sub)}</dd></div>
          <div><dt>BST (10%)</dt><dd>{nu(bst)}</dd></div>
          <div><dt>Service charge (10%)</dt><dd>{nu(svc)}</dd></div>
          <div className="total"><dt>Estimated total</dt><dd>{nu(sub + bst + svc)}</dd></div>
        </dl>
        <p className="muted small">An estimate for planning. The front desk confirms the final price and availability.</p>
        <div className="actions">
          <button type="button" className="btn btn--gold" onClick={() => openEnquiry({ room: room.slug })}>
            Enquire about this room
          </button>
          <TLink className="link" href={`/rooms/${room.slug}/`}>
            View the room <IconArrow />
          </TLink>
        </div>
      </div>
    </div>
  );
}

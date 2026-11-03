'use client';
import { useState } from 'react';
import { hotel, stampStories } from '@/content/site';
import { Img } from './Img';
import { IconMail } from './Icons';

/** Personalised stamps: one photo, plus places in Bhutan to take your stamp portrait. */
export function StampStories() {
  const [sel, setSel] = useState(stampStories.places[0].id);
  const p = stampStories.places.find((x) => x.id === sel)!;
  return (
    <div className="stamps">
      <figure className="stamps__feature">
        <div className="frame frame--contain">
          <Img k={stampStories.image} sizes="(max-width: 960px) 100vw, 46vw" />
        </div>
        <figcaption aria-live="polite" key={p.id} style={{ animation: 'step-in 420ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <b><strong>{p.place}</strong> · {p.region}</b>
          <span>{p.text}</span>
        </figcaption>
      </figure>
      <div className="stamps__side">
        <div>
          <p className="label" style={{ marginBottom: 'var(--s-3)' }}>Where to take your stamp photo</p>
          <ul className="stamps__album" aria-label="Places in Bhutan for your stamp photo">
            {stampStories.places.map((x, i) => (
              <li key={x.id}>
                <button type="button" aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>
                  <span className="stamps__thumb" aria-hidden="true">{i + 1}</span>
                  <span>
                    <strong>{x.place}</strong>
                    <small>{x.region}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <ol className="stamps__steps">
          {stampStories.steps.map((s) => (
            <li key={s.title}>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
        <div className="stamps__share">
          <p>{stampStories.share}</p>
          <a className="link" href={`mailto:${hotel.email}?subject=${encodeURIComponent('Our personalised stamp from Bhutan')}`}>
            <IconMail /> Share your stamp
          </a>
        </div>
      </div>
    </div>
  );
}

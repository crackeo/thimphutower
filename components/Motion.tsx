'use client';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useEffect, type ComponentProps } from 'react';

let pending: (() => void) | null = null;

/** Reveals .reveal / .reveal-img elements as they enter the viewport, and resolves view
 *  transitions once the new route has rendered. Mounted once in the root layout. */
export function MotionRoot() {
  const pathname = usePathname();
  useEffect(() => {
    if (pending) {
      const done = pending;
      pending = null;
      requestAnimationFrame(() => done());
    }
    const els = [...document.querySelectorAll<HTMLElement>('.reveal:not(.in), .reveal-img:not(.in)')];
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

/** next/link that wraps navigation in a View Transition where supported. */
export function TLink(props: ComponentProps<typeof NextLink>) {
  const router = useRouter();
  const { href, onClick, ...rest } = props;
  return (
    <NextLink
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.button !== 0 ||
          !doc.startViewTransition ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
          return;
        e.preventDefault();
        doc.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              pending = resolve;
              router.push(typeof href === 'string' ? href : href.pathname ?? '/');
              setTimeout(() => {
                if (pending === resolve) {
                  pending = null;
                  resolve();
                }
              }, 1200);
            }),
        );
      }}
    />
  );
}

import { useEffect, useState } from 'react';
import { FLOWERS } from './flowerData';

/**
 * Preloads the assets needed for an instant first interaction:
 *   - bouquet base + paper texture + photo frame
 *   - every flower's photo
 *   - the paper-unfold SFX
 *
 * Music files are intentionally NOT preloaded — they're large and start
 * with a built-in 350ms delay + 1s fade-in, so streaming start is fine
 * and dragging the user through ~35MB of audio before showing the page
 * would be cruel.
 *
 * Also enforces a minimum display time so the loading screen doesn't
 * flash awkwardly on cached repeat visits.
 */
const STATIC_IMAGES = [
  '/bouquet/Base.png',
  '/Other/Frame.png',
  '/Other/Paper.png',
];
const SFX = ['/sounds/paper_flip.mp3'];
const MIN_DISPLAY_MS = 1400;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block on a missing asset
    img.src = src;
  });
}

function preloadAudio(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof Audio === 'undefined') return resolve();
    const a = new Audio();
    a.preload = 'auto';
    const finish = () => resolve();
    a.oncanplaythrough = finish;
    a.onerror = finish;
    a.src = src;
    // Some browsers won't actually start fetching until .load() is called.
    a.load();
  });
}

export function useAssetLoader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startTime = performance.now();

    const photos = FLOWERS.map((f) => f.image).filter(
      (s): s is string => Boolean(s)
    );
    const tasks: Promise<void>[] = [
      ...STATIC_IMAGES.map(preloadImage),
      ...photos.map(preloadImage),
      ...SFX.map(preloadAudio),
    ];
    const total = tasks.length;

    if (total === 0) {
      setProgress(1);
      setDone(true);
      return;
    }

    let count = 0;
    tasks.forEach((task) => {
      task.then(() => {
        if (cancelled) return;
        count += 1;
        setProgress(count / total);

        if (count >= total) {
          const elapsed = performance.now() - startTime;
          const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
          window.setTimeout(() => {
            if (!cancelled) setDone(true);
          }, wait);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { progress, done };
}

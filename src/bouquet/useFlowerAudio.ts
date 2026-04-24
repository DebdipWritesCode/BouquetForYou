import { useEffect, useRef } from 'react';

const PLAY_VOLUME = 0.45;
/** Wait this long after a flower opens so the paper SFX gets a head start. */
const MUSIC_START_DELAY_MS = 350;
/** Volume ramp when starting a track — gentle swell rather than abrupt cut-in. */
const FADE_IN_MS = 1000;
/** Duration of the volume ramp when the flower is closed. */
const FADE_OUT_MS = 700;

/**
 * Plays one looping track at a time.
 *
 *   src truthy → after a small delay (so the paper SFX leads), start the
 *                track from the beginning at full volume; loops forever.
 *   src null   → fade volume to 0 over ~700ms then pause.
 *   src change → cancel any in-progress fade and switch to the new track.
 *
 * Audio never autoplays — the first user click on a flower is the gesture
 * that unlocks playback in the browser.
 */
export function useFlowerAudio(src: string | null | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);

  if (audioRef.current === null && typeof Audio !== 'undefined') {
    const a = new Audio();
    a.preload = 'none';
    a.loop = true;
    a.volume = PLAY_VOLUME;
    audioRef.current = a;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Cancel any in-flight fade — either we're starting a fresh track or
    // we're chaining into another close.
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }

    if (!src) {
      // Already silent? Just make sure it's paused.
      if (audio.paused || audio.volume === 0) {
        audio.pause();
        audio.volume = PLAY_VOLUME;
        return;
      }
      const startVol = audio.volume;
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / FADE_OUT_MS);
        // Defensive clamp: RAF's `now` can occasionally be slightly earlier
        // than `startTime` (RAF timestamp is the frame start, not wall time),
        // which can push the computed volume fractionally negative.
        audio.volume = Math.max(0, Math.min(1, startVol * (1 - t)));
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick);
        } else {
          audio.pause();
          audio.volume = PLAY_VOLUME; // restore for next play
          fadeRafRef.current = null;
        }
      };
      fadeRafRef.current = requestAnimationFrame(tick);
      return;
    }

    // Starting a new track — let the paper SFX play first, then swell in.
    audio.src = src;
    audio.currentTime = 0;

    const startTimer = window.setTimeout(() => {
      audio.volume = 0;
      audio.play().catch(() => {
        /* Autoplay blocked — first click hasn't happened yet. Safe to ignore. */
      });

      const fadeStart = performance.now();
      const fadeIn = (now: number) => {
        const t = Math.min(1, (now - fadeStart) / FADE_IN_MS);
        audio.volume = Math.max(0, Math.min(1, PLAY_VOLUME * t));
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(fadeIn);
        } else {
          fadeRafRef.current = null;
        }
      };
      fadeRafRef.current = requestAnimationFrame(fadeIn);
    }, MUSIC_START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
    };
  }, [src]);

  // Tear down on unmount.
  useEffect(() => {
    return () => {
      if (fadeRafRef.current !== null) {
        cancelAnimationFrame(fadeRafRef.current);
      }
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    };
  }, []);
}

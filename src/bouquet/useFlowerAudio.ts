import { useEffect, useRef } from 'react';

/**
 * Plays a single track at a time. Pass `null`/`undefined` to stop.
 *
 * Audio never autoplays — the first user click on a flower is the gesture
 * that unlocks playback, so the .play() promise rejection on initial mount
 * (when src is null) is irrelevant.
 */
export function useFlowerAudio(src: string | null | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
    audioRef.current.preload = 'none';
    audioRef.current.volume = 0.6;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!src) {
      audio.pause();
      return;
    }

    audio.src = src;
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* Browser blocked playback (no gesture yet) — silently ignore. */
    });

    return () => {
      audio.pause();
    };
  }, [src]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    };
  }, []);
}

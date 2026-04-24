import { useEffect, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  /** 0..1 — fraction of assets loaded */
  progress: number;
  /** True once everything is loaded AND the minimum display time has elapsed */
  done: boolean;
}

/**
 * Soft pastel "tying the bouquet" loader. Stays mounted through its
 * fade-out so the underlying bouquet is fully painted before reveal.
 */
export function LoadingScreen({ progress, done }: LoadingScreenProps) {
  const [unmounted, setUnmounted] = useState(false);

  // Wait for the fade-out to finish before fully removing from the tree.
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setUnmounted(true), 800);
    return () => window.clearTimeout(t);
  }, [done]);

  if (unmounted) return null;

  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div
      className={`loading ${done ? 'loading--out' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={!done}
    >
      <div className="loading__halo" aria-hidden="true" />

      <div className="loading__bloom" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M14 16 C9 22 8 32 12 42 C16 50 22 54 27 52 C32 50 32 42 29 32 C26 22 20 14 14 16 Z"
            fill="#FFD2D9" stroke="#E5697D" strokeWidth="3" strokeLinejoin="round"
          />
          <path
            d="M50 16 C55 22 56 32 52 42 C48 50 42 54 37 52 C32 50 32 42 35 32 C38 22 44 14 50 16 Z"
            fill="#FFD2D9" stroke="#E5697D" strokeWidth="3" strokeLinejoin="round"
          />
          <ellipse cx="32" cy="18" rx="12" ry="13" fill="#FFD2D9" stroke="#E5697D" strokeWidth="3" />
          <ellipse cx="32" cy="38" rx="16" ry="20" fill="#FFB6C1" stroke="#E5697D" strokeWidth="3" />
          <ellipse cx="25" cy="32" rx="3" ry="3.5" fill="#FFFFFF" opacity="0.55" />
        </svg>
      </div>

      <p className="loading__caption">tying the bouquet…</p>

      <div className="loading__bar" aria-hidden="true">
        <div className="loading__bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <span className="loading__sr">{pct}% loaded</span>
    </div>
  );
}

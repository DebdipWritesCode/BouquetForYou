import { useEffect } from 'react';
import type { FlowerEntry } from './flowerData';
import { PALETTES } from './flowerData';
import './RevealOverlay.css';

interface RevealOverlayProps {
  flower: FlowerEntry | null;
  onClose: () => void;
}

/**
 * The unfolded paper card. Renders centered above the bouquet whenever a
 * flower is open. Built so it gracefully omits image/music if missing.
 */
export function RevealOverlay({ flower, onClose }: RevealOverlayProps) {
  // Close on Escape for accessibility.
  useEffect(() => {
    if (!flower) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flower, onClose]);

  if (!flower) return null;

  const palette = PALETTES[flower.color];

  return (
    <div
      className="reveal"
      role="dialog"
      aria-modal="true"
      aria-label={flower.title}
      onClick={onClose}
      style={{
        // Tint the soft glow behind the paper to match the flower
        ['--reveal-tint' as string]: palette.glow,
        ['--reveal-stroke' as string]: palette.stroke,
      }}
    >
      <div className="reveal__paper" onClick={(e) => e.stopPropagation()}>
        <div className="reveal__paper-texture" aria-hidden="true" />

        <button
          type="button"
          className="reveal__close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {flower.image && (
          <div className="reveal__frame">
            <img
              className="reveal__photo"
              src={flower.image}
              alt=""
              draggable={false}
            />
          </div>
        )}

        <h2 className="reveal__title">{flower.title}</h2>
        <p className="reveal__message">{flower.message}</p>
      </div>
    </div>
  );
}

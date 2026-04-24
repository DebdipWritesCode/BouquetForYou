import { useCallback, useState } from 'react';
import { BouquetBase } from './BouquetBase';
import { Flower } from './Flower';
import { RevealOverlay } from './RevealOverlay';
import { useFlowerAudio } from './useFlowerAudio';
import { FLOWERS } from './flowerData';
import './Bouquet.css';

export function Bouquet() {
  const [openId, setOpenId] = useState<string | null>(null);

  const openFlower = FLOWERS.find((f) => f.id === openId) ?? null;

  // Audio is driven by which flower is currently open.
  useFlowerAudio(openFlower?.music ?? null);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const close = useCallback(() => setOpenId(null), []);

  return (
    <div className="bouquet-stage">
      <div className="bouquet-stage__halo" aria-hidden="true" />

      <div className="bouquet">
        <BouquetBase />

        {FLOWERS.map((f, i) => (
          <div
            key={f.id}
            className="bouquet__slot"
            style={{
              left: f.position.left,
              top: f.position.top,
              ['--slot-scale' as string]: String(f.position.scale ?? 1),
              ['--slot-rotate' as string]: `${f.position.rotate ?? 0}deg`,
            }}
          >
            <Flower
              color={f.color}
              isOpen={openId === f.id}
              onClick={() => toggle(f.id)}
              ariaLabel={f.title}
              idleDelay={i * 0.4}
            />
          </div>
        ))}
      </div>

      <RevealOverlay flower={openFlower} onClose={close} />
    </div>
  );
}

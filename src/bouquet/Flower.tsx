import { memo } from 'react';
import type { CSSProperties } from 'react';
import { PALETTES, type FlowerColor } from './flowerData';
import './Flower.css';

interface FlowerProps {
  color: FlowerColor;
  isOpen: boolean;
  onClick: () => void;
  ariaLabel: string;
  /** Stagger the idle floating so flowers don't move in sync */
  idleDelay?: number;
}

/**
 * One reusable flower. The SVG is identical across colors, so we render it
 * inline and recolor via props. Each path is given a class so we can rotate
 * petals independently for the unfold animation.
 */
function FlowerImpl({ color, isOpen, onClick, ariaLabel, idleDelay = 0 }: FlowerProps) {
  const palette = PALETTES[color];

  const style = {
    '--petal-fill': palette.fill,
    '--petal-stroke': palette.stroke,
    '--petal-glow': palette.glow,
    '--idle-delay': `${idleDelay}s`,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`flower flower--${color} ${isOpen ? 'flower--open' : ''}`}
      style={style}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isOpen}
    >
      <span className="flower__floater">
      <svg
        className="flower__svg"
        viewBox="0 0 221 170"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* back-top petal */}
        <path
          className="petal petal--top"
          d="M106.948 3C80.6778 3.00002 59.0949 23.1927 59.0949 48.4453C59.0949 73.6979 80.6778 93.8906 106.948 93.8906C133.219 93.8906 154.802 73.6979 154.802 48.4453C154.802 23.1927 133.219 3 106.948 3Z"
        />
        {/* back-left petal */}
        <path
          className="petal petal--left"
          d="M37.6672 15.9586C25.5085 19.9759 18.1668 32.0201 15.4916 47.0721C12.7985 62.2248 14.6584 81.1024 21.5339 100.189C28.4095 119.276 39.0991 135.237 50.975 145.576C62.772 155.847 76.306 160.992 88.4646 156.975C100.623 152.958 107.964 140.915 110.64 125.863C113.333 110.71 111.473 91.8316 104.598 72.7446C97.7223 53.6578 87.032 37.6979 75.1561 27.3588C63.3592 17.0884 49.8258 11.9415 37.6672 15.9586Z"
        />
        {/* back-right petal */}
        <path
          className="petal petal--right"
          d="M178.694 17.4917C191.973 21.8795 200.557 34.1194 204.12 49.5433C207.692 65.0094 206.362 84.112 199.466 103.255C192.571 122.398 181.319 138.223 168.549 148.289C155.814 158.328 141.176 162.896 127.897 158.508C114.617 154.121 106.033 141.88 102.47 126.456C98.8974 110.99 100.227 91.8876 107.123 72.7446C114.019 53.6017 125.27 37.777 138.04 27.7106C150.776 17.6714 165.414 13.1041 178.694 17.4917Z"
        />
        {/* front center petal */}
        <path
          className="petal petal--center"
          d="M111.22 41.8657C79.2472 41.8657 53.7554 70.0142 53.7554 104.187C53.7554 138.36 79.2472 166.508 111.22 166.508C143.193 166.508 168.685 138.36 168.685 104.187C168.685 70.0142 143.193 41.8657 111.22 41.8657Z"
        />
        <ellipse className="petal__shine" opacity="0.6" cx="42.7176" cy="39.2404" rx="8.54352" ry="9.71642" fill="white" />
        <ellipse className="petal__shine" opacity="0.6" cx="91.8428" cy="66.8555" rx="10.6794" ry="9.71642" fill="white" />
      </svg>
      </span>
    </button>
  );
}

export const Flower = memo(FlowerImpl);

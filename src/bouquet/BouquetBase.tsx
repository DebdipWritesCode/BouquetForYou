import './BouquetBase.css';

/**
 * Static leaves + ribbon. Sits behind the flowers in the bouquet stack.
 */
export function BouquetBase() {
  return (
    <img
      src="/bouquet/Base.png"
      alt=""
      className="bouquet-base"
      draggable={false}
    />
  );
}

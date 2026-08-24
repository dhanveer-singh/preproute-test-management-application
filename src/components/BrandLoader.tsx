import logoMark from '@/assets/images/favicon.svg';

interface BrandLoaderProps {
  size?: number;
  className?: string;
}

function BrandLoader({ size = 56, className = '' }: BrandLoaderProps) {
  const logoSize = size * 0.38;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-label="Loading"
      role="status"
    >
      {/* =====================================================
          SPINNING RING
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          animate-spin
          rounded-full
          border-[3px]
          border-[#E4E7EC]
          border-t-[#1B5DEF]
          border-r-[#1B5DEF]
        "
        style={{
          animationDuration: '900ms',
        }}
      />

      {/* =====================================================
          BRAND MARK
      ====================================================== */}

      <img
        src={logoMark}
        alt=""
        aria-hidden="true"
        className="relative z-10 object-contain"
        style={{
          width: logoSize,
          height: logoSize,
        }}
      />
    </div>
  );
}

export default BrandLoader;

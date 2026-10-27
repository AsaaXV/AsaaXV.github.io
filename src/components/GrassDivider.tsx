import React from 'react';

interface GrassDividerProps {
  variant?: 'bottom' | 'tall' | 'spiky' | 'foliage';
  className?: string;
  fillHeight?: boolean;
}

export const GrassDivider: React.FC<GrassDividerProps> = ({
  variant = 'bottom',
  className = '',
  fillHeight = false,
}) => {
  const isHeightSpecified = fillHeight || /h-\[?\d+|h-full/.test(className);
  // Default to a sleek, compact height (shortened grass) if not overridden
  const svgHeightClass = isHeightSpecified ? 'h-full' : 'h-8 sm:h-11 md:h-13';

  if (variant === 'spiky') {
    return (
      <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
        <svg
          viewBox="0 0 1200 50"
          className={`w-full ${svgHeightClass} text-[#283618] block`}
          fill="currentColor"
          preserveAspectRatio="none"
        >
          {/* Layer 1: background spiky grass (shortened) */}
          <path
            d="M0,50 L0,32 L30,16 L45,34 L80,10 L115,36 L150,18 L185,38 L225,12 L260,36 L300,20 L340,38 L380,14 L420,36 L460,18 L500,38 L540,12 L580,36 L620,18 L660,38 L700,14 L740,36 L780,12 L820,38 L860,20 L900,36 L940,14 L980,38 L1020,12 L1060,36 L1100,20 L1140,34 L1175,16 L1200,32 L1200,50 Z"
            opacity="0.35"
          />
          {/* Layer 2: foreground spiky grass (shortened) */}
          <path
            d="M0,50 L0,36 L40,24 L70,40 L105,18 L140,40 L180,22 L215,42 L255,16 L295,40 L335,22 L375,42 L415,18 L455,40 L495,20 L535,42 L575,16 L615,40 L655,20 L695,42 L735,18 L775,40 L815,16 L855,42 L895,22 L935,40 L975,18 L1015,42 L1055,20 L1095,40 L1135,22 L1170,36 L1200,38 L1200,50 Z"
            fill="#283618"
          />
          <rect x="0" y="46" width="1200" height="4" fill="#1c2711" />
        </svg>
      </div>
    );
  }

  // Default organic lush grass — Shortened, compact, and completely fluid across all screen sizes
  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 65"
        className={`w-full ${svgHeightClass} text-[#283618] block`}
        fill="currentColor"
        preserveAspectRatio="none"
      >
        {/* Layer 1: Back blades (shortened, lighter opacity) */}
        <path
          d="M0,65 L0,36 L20,20 L38,38 L60,16 L85,40 L115,14 L145,42 L175,18 L205,40 L238,12 L270,42 L305,20 L340,44 L375,16 L415,42 L455,14 L495,44 L535,18 L575,42 L615,12 L655,44 L695,18 L735,42 L775,14 L815,44 L855,18 L895,40 L935,12 L975,42 L1015,16 L1055,42 L1095,18 L1135,40 L1170,20 L1200,36 L1200,65 Z"
          opacity="0.35"
        />

        {/* Layer 2: Midground blades (shortened, rich angles) */}
        <path
          d="M0,65 L0,40 L30,24 L55,44 L90,20 L125,46 L165,22 L200,48 L245,16 L285,48 L325,24 L365,50 L410,20 L450,48 L500,18 L545,50 L595,22 L640,48 L685,20 L730,50 L780,16 L825,48 L870,22 L915,48 L960,18 L1005,50 L1050,22 L1095,48 L1140,24 L1180,42 L1200,46 L1200,65 Z"
          opacity="0.75"
        />

        {/* Layer 3: Foreground deep rich blades (shortened) */}
        <path
          d="M0,65 L0,46 L40,32 L75,50 L120,28 L160,52 L205,30 L255,54 L300,28 L355,52 L405,30 L460,54 L515,26 L570,52 L625,30 L680,54 L735,28 L790,52 L845,30 L900,54 L955,28 L1010,52 L1065,32 L1120,52 L1170,36 L1200,50 L1200,65 Z"
          fill="#1c2711"
        />

        {/* Layer 4: Solid ground base line covering all the way to bottom edge */}
        <rect x="0" y="60" width="1200" height="5" fill="#1c2711" />
      </svg>
    </div>
  );
};

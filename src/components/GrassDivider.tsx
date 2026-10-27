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
  // Di HP: ukuran kemarin (~40-44px), di desktop: dipendekkan ramping & pendek (24-28px)
  const svgHeightClass = isHeightSpecified ? 'h-full' : 'h-10 sm:h-11 md:h-6 lg:h-7';

  if (variant === 'spiky') {
    return (
      <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          className={`w-full ${svgHeightClass} text-[#283618] block`}
          fill="currentColor"
          preserveAspectRatio="none"
        >
          {/* Layer 1: background spiky grass */}
          <path
            d="M0,60 L0,36 L30,18 L45,40 L80,12 L115,42 L150,22 L185,44 L225,14 L260,42 L300,24 L340,44 L380,16 L420,42 L460,22 L500,44 L540,14 L580,42 L620,22 L660,44 L700,16 L740,42 L780,14 L820,44 L860,24 L900,42 L940,16 L980,44 L1020,14 L1060,42 L1100,24 L1140,40 L1175,18 L1200,36 L1200,60 Z"
            opacity="0.35"
          />
          {/* Layer 2: foreground spiky grass */}
          <path
            d="M0,60 L0,42 L40,28 L70,46 L105,20 L140,46 L180,26 L215,48 L255,18 L295,46 L335,26 L375,48 L415,20 L455,46 L495,24 L535,48 L575,18 L615,46 L655,24 L695,48 L735,20 L775,46 L815,18 L855,48 L895,26 L935,46 L975,20 L1015,48 L1055,24 L1095,46 L1135,26 L1170,42 L1200,44 L1200,60 Z"
            fill="#283618"
          />
          <rect x="0" y="55" width="1200" height="5" fill="#1c2711" />
        </svg>
      </div>
    );
  }

  // Default organic lush grass: Bentuk helai proporsional seperti kemarin di HP, dan pendek di desktop
  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 130"
        className={`w-full ${svgHeightClass} text-[#283618] block`}
        fill="currentColor"
        preserveAspectRatio="none"
      >
        {/* Layer 1: Back tall blades with lighter opacity */}
        <path
          d="M0,130 L0,65 L20,30 L38,70 L60,20 L85,75 L115,15 L145,80 L175,28 L205,75 L238,12 L270,80 L305,35 L340,85 L375,22 L415,80 L455,18 L495,85 L535,28 L575,80 L615,15 L655,85 L695,28 L735,80 L775,18 L815,85 L855,28 L895,75 L935,15 L975,80 L1015,25 L1055,80 L1095,28 L1135,75 L1170,35 L1200,70 L1200,130 Z"
          opacity="0.35"
        />

        {/* Layer 2: Midground blades with rich angles */}
        <path
          d="M0,130 L0,75 L30,42 L55,80 L90,32 L125,85 L165,38 L200,90 L245,22 L285,90 L325,42 L365,95 L410,32 L450,90 L500,28 L545,95 L595,38 L640,90 L685,32 L730,95 L780,22 L825,90 L870,38 L915,90 L960,28 L1005,95 L1050,38 L1095,90 L1140,42 L1180,78 L1200,85 L1200,130 Z"
          opacity="0.75"
        />

        {/* Layer 3: Foreground deep rich blades */}
        <path
          d="M0,130 L0,90 L40,60 L75,95 L120,52 L160,100 L205,58 L255,105 L300,52 L355,100 L405,58 L460,105 L515,48 L570,102 L625,58 L680,105 L735,52 L790,100 L845,58 L900,105 L955,52 L1010,100 L1065,60 L1120,102 L1170,68 L1200,95 L1200,130 Z"
          fill="#1c2711"
        />

        {/* Layer 4: Solid ground base line covering all the way to bottom edge */}
        <rect x="0" y="122" width="1200" height="8" fill="#1c2711" />
      </svg>
    </div>
  );
};

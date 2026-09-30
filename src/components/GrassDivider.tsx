import React from 'react';

interface GrassDividerProps {
  variant?: 'top' | 'bottom' | 'foliage';
  className?: string;
}

export const GrassDivider: React.FC<GrassDividerProps> = ({ variant = 'bottom', className = '' }) => {
  if (variant === 'foliage') {
    return (
      <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
        <svg viewBox="0 0 1200 80" className="w-full h-auto text-[#808847]/40 block" fill="currentColor">
          <path d="M0,45 Q50,15 100,50 T200,40 T300,55 T400,30 T500,60 T600,35 T700,50 T800,25 T900,55 T1000,35 T1100,60 L1200,45 L1200,80 L0,80 Z" />
          <path d="M0,60 Q80,40 160,65 T320,50 T480,70 T640,45 T800,65 T960,50 T1120,65 L1200,60 L1200,80 L0,80 Z" fill="#697135" opacity="0.6" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        className="w-full h-auto text-[#808847] block"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        {/* Layer 1: Back grass blades with lighter earthy green */}
        <path
          d="M0,120 L0,70 L25,40 L40,75 L65,30 L90,80 L120,25 L150,85 L180,35 L210,80 L240,20 L275,85 L310,40 L345,90 L380,30 L420,85 L460,25 L500,90 L540,35 L580,85 L620,20 L660,90 L700,35 L740,85 L780,25 L820,90 L860,35 L900,80 L940,20 L980,85 L1020,30 L1060,85 L1100,35 L1140,80 L1180,45 L1200,75 L1200,120 Z"
          opacity="0.45"
        />
        {/* Layer 2: Main grass silhouettes */}
        <path
          d="M0,120 L0,80 L35,50 L60,85 L95,40 L130,90 L170,45 L205,95 L250,30 L290,95 L330,50 L370,100 L415,40 L455,95 L505,35 L550,100 L600,45 L645,95 L690,40 L735,100 L785,30 L830,95 L875,45 L920,95 L965,35 L1010,100 L1055,45 L1100,95 L1145,50 L1185,85 L1200,90 L1200,120 Z"
          opacity="0.8"
        />
        {/* Layer 3: Foreground deep silhouettes */}
        <path
          d="M0,120 L0,95 L45,70 L80,100 L125,60 L165,105 L210,65 L260,110 L305,60 L360,105 L410,65 L465,110 L520,55 L575,108 L630,65 L685,110 L740,60 L795,105 L850,65 L905,110 L960,60 L1015,105 L1070,68 L1125,108 L1175,75 L1200,100 L1200,120 Z"
          fill="#5E6631"
        />
      </svg>
    </div>
  );
};

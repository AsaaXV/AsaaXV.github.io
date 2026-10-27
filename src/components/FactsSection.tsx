import React, { useState, useEffect, useRef } from 'react';
import { FACTS_DATA } from '../data/content';

interface AnimatedCountUpProps {
  valueString: string;
  startAnimation: boolean;
  duration?: number;
}

const AnimatedCountUp: React.FC<AnimatedCountUpProps> = ({
  valueString,
  startAnimation,
  duration = 3000,
}) => {
  const isPercent = valueString.includes('%');
  const hasCommaDecimal = valueString.includes(',');
  const hasDotThousands = !hasCommaDecimal && valueString.includes('.') && valueString.split('.').length === 2 && valueString.split('.')[1].length === 3;

  let targetNumber = 0;
  let initialFormatted = '0';

  if (isPercent && hasCommaDecimal) {
    const cleanNum = parseFloat(valueString.replace('%', '').replace(',', '.').trim()) || 0;
    targetNumber = cleanNum;
    initialFormatted = '0,00%';
  } else if (hasCommaDecimal) {
    const cleanNum = parseFloat(valueString.replace(',', '.').trim()) || 0;
    targetNumber = cleanNum;
    initialFormatted = '0,00';
  } else if (hasDotThousands) {
    const cleanNum = parseInt(valueString.replace(/\./g, '').trim(), 10) || 0;
    targetNumber = cleanNum;
    initialFormatted = '0';
  } else {
    targetNumber = parseFloat(valueString.replace('%', '').trim()) || 0;
    initialFormatted = isPercent ? '0%' : '0';
  }

  const [displayValue, setDisplayValue] = useState<string>(initialFormatted);

  useEffect(() => {
    if (!startAnimation) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = ease * targetNumber;

      if (progress < 1) {
        if (isPercent && hasCommaDecimal) {
          setDisplayValue(`${currentVal.toFixed(2).replace('.', ',')}%`);
        } else if (hasCommaDecimal) {
          setDisplayValue(currentVal.toFixed(2).replace('.', ','));
        } else if (hasDotThousands) {
          setDisplayValue(Math.floor(currentVal).toLocaleString('id-ID'));
        } else {
          setDisplayValue(Math.floor(currentVal).toString() + (isPercent ? '%' : ''));
        }
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(valueString);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [startAnimation, targetNumber, duration, valueString, isPercent, hasCommaDecimal, hasDotThousands]);

  return <span>{displayValue}</span>;
};

export const FactsSection: React.FC = () => {
  const [hasStartedCount, setHasStartedCount] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      setHasStartedCount(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedCount(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="facts"
      className="pt-4 pb-4 sm:pt-6 sm:pb-6 px-3 sm:px-4 max-w-4xl mx-auto flex flex-col items-center w-full"
    >
      {/* Header — Heading: 32-48px Bold Ellak | Isi: 14-16px Regular Oduda */}
      <div className="text-center mb-6 sm:mb-8 animate-section-title">
        <div className="section-title-interactive group">
          <h2 className="font-display text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] font-bold text-[#283618] group-hover:text-[#5B4436] transition-colors leading-tight tracking-tight uppercase">
            FAKTA YANG HARUS KAMU KETAHUI
          </h2>
        </div>
        <div className="h-0.5 bg-[#283618]/20 rounded-full mx-auto my-3 animate-line-grow w-24" />
        <p className="font-body text-[#283618]/85 text-[14px] sm:text-[15px] md:text-[16px] font-normal mt-0.5 max-w-md mx-auto leading-relaxed">
          Data riil timbulan dan komposisi sampah yang perlu kita cermati bersama.
        </p>
      </div>

      {/* Kartu Fakta Memanjang ke Bawah di HP & 3 Kolom di Layar Lebar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 w-full max-w-sm sm:max-w-none mx-auto items-stretch">
        {FACTS_DATA.map((fact, idx) => {
          const staggerClass =
            idx === 2
              ? 'animate-stagger-right-1'
              : idx === 1
              ? 'animate-stagger-right-2'
              : 'animate-stagger-right-3';

          return (
            <div key={fact.id} className={staggerClass}>
              <div className="rounded-[28px] p-6 bg-[#5B4436] text-[#FEFAE0] shadow-xl flex flex-col justify-between h-full min-h-[270px] w-full select-none transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group border border-[#5B4436]/40">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-black/40 text-white">
                      {fact.badge}
                    </span>
                  </div>

                  {/* Animated Stopwatch Numeric Counter */}
                  <div className="my-3 min-h-[76px] flex flex-col justify-center">
                    <div className="font-display text-4xl sm:text-5xl font-black tracking-tight tabular-nums leading-none transition-colors drop-shadow text-white group-hover:text-amber-200">
                      <AnimatedCountUp
                        valueString={fact.number}
                        startAnimation={hasStartedCount}
                        duration={3000}
                      />
                    </div>
                    <div className="font-display text-[16px] sm:text-[18px] font-bold text-amber-300 uppercase tracking-wider mt-2">
                      {fact.unit}
                    </div>
                  </div>

                  {/* Teks Fakta Lengkap — Isi: 14-16px Regular Oduda */}
                  <div className="mt-4 pt-3.5 border-t border-white/20">
                    <p className="font-body text-[14px] sm:text-[15px] md:text-[16px] font-normal text-white/95 leading-relaxed text-left">
                      {fact.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

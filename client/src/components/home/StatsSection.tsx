import React, { useEffect, useState, useRef } from 'react';
import { STATS_DATA } from '@legacypixels/shared';

export const StatsSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    'stat-exp': 0,
    'stat-awards': 0,
    'stat-projects': 0,
    'stat-clients': 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1800; // ms
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease-out curve
      const factor = 1 - Math.pow(1 - progress, 3);

      const nextCounts: { [key: string]: number } = {};
      STATS_DATA.forEach((s) => {
        nextCounts[s.id] = Math.floor(s.value * factor);
      });

      setCounts(nextCounts);

      if (step >= steps) {
        clearInterval(timer);
        const finalCounts: { [key: string]: number } = {};
        STATS_DATA.forEach((s) => {
          finalCounts[s.id] = s.value;
        });
        setCounts(finalCounts);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [hasAnimated]);

  return (
    <div
      ref={sectionRef}
      className="bg-[#121212] border-y border-[#2A2A2A] py-12 relative overflow-hidden"
    >
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-[#E50914]/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="text-center px-4 pt-4 md:pt-0">
              <div className="flex items-center justify-center font-oswald text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2">
                <span>{counts[stat.id] || 0}</span>
                <span className="text-[#E50914]">{stat.suffix}</span>
              </div>
              <p className="font-poppins text-xs uppercase tracking-widest text-[#B5B5B5]">
                {stat.label.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  const isRight = align === 'right';
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-12 ${
        isRight ? 'text-right flex flex-col items-end' : isCenter ? 'text-center flex flex-col items-center' : 'text-left flex flex-col items-start'
      } ${className}`}
    >
      {/* Tiny red lowercase label with thin white line */}
      <div className="inline-flex flex-col mb-2.5">
        <span className="font-poppins text-xs font-semibold lowercase tracking-wider text-[#E50914]">
          {label}
        </span>
        <div className="h-[1px] w-full bg-white/60 mt-1" />
      </div>

      {/* Big uppercase Oswald heading */}
      <h2 className="font-oswald text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-white leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-xs sm:text-sm text-[#B5B5B5] max-w-2xl font-raleway leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

import React from 'react';

interface LaurelAwardProps {
  title: string;
  year?: string;
  org: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LaurelAward: React.FC<LaurelAwardProps> = ({
  title,
  year,
  org,
  size = 'md',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-3 relative group">
      {/* Laurel Wreath SVGs on left and right */}
      <div className="flex items-center justify-center gap-2">
        {/* Left Laurel Branch */}
        <svg
          className="w-8 h-14 text-[#B48A3C] transition-transform duration-300 group-hover:-translate-x-1"
          viewBox="0 0 40 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M35 75 C25 60 15 40 20 10 C18 16 12 25 15 32 C10 36 6 46 12 52 C8 58 5 66 18 72 Z" fill="#B48A3C" fillOpacity="0.25" />
          <path d="M30 70 C22 55 16 38 22 15" strokeLinecap="round" />
        </svg>

        {/* Laurel Center Text */}
        <div className="flex flex-col items-center px-1">
          <span className="font-poppins text-[10px] uppercase tracking-widest text-[#B48A3C] font-semibold">
            {year ? `WINNER ${year}` : 'WINNER'}
          </span>
          <span className="font-oswald text-xs sm:text-sm uppercase font-bold text-white tracking-wider my-0.5">
            {title}
          </span>
          <span className="font-raleway text-[10px] text-[#B5B5B5] max-w-[120px] line-clamp-1">
            {org}
          </span>
        </div>

        {/* Right Laurel Branch (Mirrored) */}
        <svg
          className="w-8 h-14 text-[#B48A3C] scale-x-[-1] transition-transform duration-300 group-hover:translate-x-1"
          viewBox="0 0 40 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M35 75 C25 60 15 40 20 10 C18 16 12 25 15 32 C10 36 6 46 12 52 C8 58 5 66 18 72 Z" fill="#B48A3C" fillOpacity="0.25" />
          <path d="M30 70 C22 55 16 38 22 15" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

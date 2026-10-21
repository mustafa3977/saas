import React from 'react';
import { Quote, Star } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { TESTIMONIALS_DATA } from '@legacypixels/shared';

export const TestimonialsSection: React.FC = () => {
  if (!TESTIMONIALS_DATA || TESTIMONIALS_DATA.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="testimonials"
          title="WORDS FROM OUR PATRONS"
          subtitle="Real reviews from film commissioners, creative directors, and families who trusted us with their defining moments."
          align="left"
        />

        {/* Two Bordered Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-[#141414] border border-[#2A2A2A] p-8 rounded-sm relative flex flex-col justify-between hover:border-[#E50914] transition-all duration-300"
            >
              {/* Red Quote Icon in Top Right */}
              <div className="absolute top-6 right-6 text-[#E50914] opacity-80">
                <Quote className="w-8 h-8 fill-[#E50914]/20" />
              </div>

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B48A3C] text-[#B48A3C]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-raleway text-sm sm:text-base text-white/90 italic leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#2A2A2A]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E50914]"
                />
                <div>
                  <h4 className="font-oswald text-base uppercase font-bold text-white tracking-wider">
                    {t.name}
                  </h4>
                  <p className="font-poppins text-xs text-[#B5B5B5]">
                    {t.role} {t.company ? `• ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

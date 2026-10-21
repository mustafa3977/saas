import React from 'react';
import { Star } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { LaurelAward } from '../common/LaurelAward';
import { AWARDS_DATA } from '@legacypixels/shared';

export const AwardsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0D0D0D] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Right-aligned section pattern */}
        <SectionHeader
          label="awards"
          title="HONORS & RECOGNITION"
          subtitle="Honoring artistic dedication, narrative excellence, and technical innovation across global film & sound festivals."
          align="right"
        />

        {/* Three Laurel Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 py-6 px-4 bg-[#141414] border border-[#2A2A2A] rounded-sm">
          {AWARDS_DATA.map((award) => (
            <LaurelAward
              key={award.id}
              title={award.laurelTitle}
              year={award.laurelYear}
              org={award.laurelOrg}
              size="lg"
            />
          ))}
        </div>

        {/* Three Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AWARDS_DATA.map((item) => (
            <div
              key={item.id}
              className="cinematic-card rounded-sm overflow-hidden group flex flex-col"
            >
              {/* Cover Image */}
              <div className="aspect-[16/10] overflow-hidden relative bg-black">
                <img
                  src={item.coverImage}
                  alt={item.portfolioCardTitle}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                
                {/* Runtime Badge */}
                <span className="absolute bottom-3 right-3 bg-black/80 border border-[#2A2A2A] text-[11px] font-poppins text-white px-2.5 py-0.5 rounded-sm">
                  {item.runtime}
                </span>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(item.starRating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B48A3C] text-[#B48A3C]" />
                    ))}
                  </div>

                  <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors">
                    {item.portfolioCardTitle}
                  </h3>
                  <p className="font-raleway text-xs text-[#B5B5B5] mt-1">
                    Award of Distinction • {item.laurelOrg}
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

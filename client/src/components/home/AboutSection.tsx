import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { LaurelAward } from '../common/LaurelAward';
import { AWARDS_DATA } from '@legacypixels/shared';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Two Stacked Images + Big Stat Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative pl-6 pb-6">
              {/* Back / Top Image (Director's chair & clapperboard) */}
              <div className="w-[85%] h-64 sm:h-72 rounded-sm overflow-hidden border border-[#2A2A2A] shadow-2xl relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80"
                  alt="Director clapperboard on studio set"
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Front / Bottom Image (Cinema Camera rig) */}
              <div className="w-[80%] h-60 sm:h-64 rounded-sm overflow-hidden border border-[#2A2A2A] shadow-2xl -mt-20 ml-auto relative z-20">
                <img
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
                  alt="High dynamic range cinema camera"
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Stat Badge: 10+ YEARS OF EXPERIENCE */}
              <div className="absolute top-4 left-0 z-30 bg-[#141414] border border-[#E50914] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-sm">
                <span className="block font-oswald text-3xl sm:text-4xl font-bold text-[#E50914] leading-none mb-1">
                  10+
                </span>
                <span className="block font-oswald text-[11px] sm:text-xs uppercase tracking-widest text-white leading-tight">
                  Years of<br />Experience
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy, Awards, Button */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tiny red label + thin white line + Oswald heading */}
            <SectionHeader
              label="about us"
              title="TURNING MOMENTS INTO LEGACIES"
              align="left"
            />

            {/* Real Copy — No Lorem Ipsum */}
            <div className="space-y-4 text-xs sm:text-sm text-[#B5B5B5] font-raleway leading-relaxed mb-8">
              <p>
                Founded in 2024 by an ensemble of veteran directors, composers, and VFX artists with over a decade of industry grit, <strong className="text-white font-medium">Legacy Pixels</strong> is dedicated to one singular doctrine: turning ordinary narratives into enduring cinematic legends.
              </p>
              <p>
                Whether crafting personalized original songs that move generations to tears, engineering invisible photorealistic visual effects, or directing high-concept commercial campaigns, our production pipeline treats every frame and audio frequency with sacred precision.
              </p>
            </div>

            {/* Three Laurel Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 py-4 bg-[#141414]/60 border border-[#2A2A2A] rounded-sm">
              {AWARDS_DATA.map((award) => (
                <LaurelAward
                  key={award.id}
                  title={award.laurelTitle}
                  year={award.laurelYear}
                  org={award.laurelOrg}
                />
              ))}
            </div>

            {/* MORE ABOUT US Button */}
            <div>
              <Link to="/about" className="btn-cinematic">
                MORE ABOUT US
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

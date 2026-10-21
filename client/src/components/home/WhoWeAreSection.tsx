import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from '../common/VideoModal';

export const WhoWeAreSection: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative py-28 sm:py-36 bg-[#0A0A0A] overflow-hidden border-b border-[#2A2A2A]">
      {/* Background Cinematic Visual (Director / Masked Figure in dramatic lighting) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85"
          alt="Cinematic production craftsman in dramatic lighting"
          className="w-full h-full object-cover object-center filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Small Labels: The Visionary / The Storyteller / The Creator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-poppins text-xs uppercase tracking-widest text-[#E50914] font-semibold">
              The Visionary
            </span>
            <span className="text-[#B5B5B5] text-xs">/</span>
            <span className="font-poppins text-xs uppercase tracking-widest text-[#B5B5B5] font-semibold">
              The Storyteller
            </span>
            <span className="text-[#B5B5B5] text-xs">/</span>
            <span className="font-poppins text-xs uppercase tracking-widest text-[#B5B5B5] font-semibold">
              The Creator
            </span>
          </div>

          {/* Heading: WHO WE ARE ? */}
          <h2 className="font-oswald text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-white mb-6">
            WHO WE ARE ?
          </h2>

          {/* Red Quote: "OUR CRAFT IS THAT OF STORYTELLING" */}
          <blockquote className="font-oswald text-xl sm:text-2xl uppercase tracking-wide text-[#E50914] mb-6 font-semibold border-l-2 border-[#E50914] pl-4">
            "OUR CRAFT IS THAT OF STORYTELLING."
          </blockquote>

          {/* Paragraph */}
          <p className="font-raleway text-xs sm:text-sm text-[#B5B5B5] leading-relaxed mb-8">
            We are sound sculptors, film directors, colorists, and VFX architects united under a singular commitment to visual and acoustic mastery. Every project at Legacy Pixels begins with an obsession for emotional resonance—we do not simply generate media; we build cultural artifacts designed to outlive the moment.
          </p>

          {/* VIEW PORTFOLIO Button */}
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="btn-play-portfolio"
          >
            <div className="w-11 h-11 rounded-full border border-[#E50914] bg-[#E50914]/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E50914]">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <span className="font-oswald text-xs tracking-widest text-white group-hover:text-[#E50914]">
              VIEW PORTFOLIO
            </span>
          </button>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
        title="Who We Are — The Legacy Pixels Manifesto"
      />
    </section>
  );
};

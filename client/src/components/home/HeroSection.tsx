import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { VideoModal } from '../common/VideoModal';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background Cinematic Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=2000&q=85"
          alt="Cinematic production studio background"
          className="w-full h-full object-cover object-center opacity-30 filter brightness-75 scale-105"
        />
        {/* Subtle cinematic radial vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0A0A]/70 to-[#0A0A0A]" />
        {/* Vertical gradient to seamlessly blend with sticky header and next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-transparent to-[#0A0A0A]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center">
        {/* Small caps line */}
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-[1px] w-8 sm:w-12 bg-[#E50914]" />
          <span className="font-poppins text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#B5B5B5]">
            {t('hero.studioLine')}
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-[#E50914]" />
        </div>

        {/* Giant LEGACY PIXELS */}
        <h1 className="font-oswald text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-white mb-3 leading-none drop-shadow-2xl">
          LEGACY <span className="text-white hover:text-[#E50914] transition-colors duration-500">PIXELS</span>
        </h1>

        {/* Red letter-spaced tagline */}
        <p className="font-poppins text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] sm:tracking-[0.35em] uppercase text-[#E50914] mb-6">
          {t('hero.tagline')}
        </p>

        {/* Khand sub-labels */}
        <p className="font-khand text-lg sm:text-xl md:text-2xl font-medium tracking-widest text-[#B5B5B5] mb-10 max-w-2xl">
          {t('hero.subServices')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
          <Link to="/services" className="btn-cinematic w-full sm:w-auto">
            {t('hero.exploreWork')}
          </Link>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="btn-play-portfolio w-full sm:w-auto justify-center"
          >
            <div className="w-10 h-10 rounded-full border border-[#E50914] bg-[#E50914]/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E50914]">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <span className="font-oswald text-xs tracking-widest">{t('hero.viewPortfolio')}</span>
          </button>
        </div>
      </div>

      {/* Video Modal Triggered by View Portfolio */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
        title="Legacy Pixels Master Production Reel 2026"
      />
    </section>
  );
};

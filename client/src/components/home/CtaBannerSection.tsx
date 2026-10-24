import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CtaBannerSection: React.FC = () => {
  const { isCustomerAuthenticated } = useAuth();
  return (
    <section className="relative py-20 sm:py-24 bg-[#0d0d0d] overflow-hidden border-b border-[#2A2A2A]">
      <div className="absolute inset-0 bg-radial-gradient from-[#E50914]/15 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#B48A3C]/40 px-4 py-1.5 rounded-full mb-6 text-xs text-[#B48A3C] font-poppins uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Now Booking Q4 2026 & 2027 Production Windows</span>
        </div>

        <h2 className="font-oswald text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-white mb-6 max-w-4xl mx-auto leading-tight">
          READY TO TURN YOUR STORY INTO AN <span className="text-[#E50914]">IMMORTAL LEGEND</span>?
        </h2>

        <p className="font-raleway text-sm sm:text-base text-[#B5B5B5] max-w-2xl mx-auto mb-10 leading-relaxed">
          From custom acoustic love anthems delivered in 48 hours to full-scale cinematic film production and photorealistic VFX, our team is standing by to bring your vision to life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isCustomerAuthenticated ? '/order/music' : '/login'}
            state={!isCustomerAuthenticated ? { from: '/order/music' } : undefined}
            className="btn-cinematic-red w-full sm:w-auto"
          >
            ORDER A CUSTOM SONG ($29+)
          </Link>
          <Link
            to="/contact"
            className="btn-cinematic w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>DISCUSS COMMERCIAL FILM / VFX</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

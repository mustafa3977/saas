import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Music,
  Sparkles,
  Scissors,
  PenTool,
  Layers,
  Radio,
  Camera,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Clock,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { SERVICES_CATALOG } from '@legacypixels/shared';

const ICON_MAP: Record<string, React.ReactNode> = {
  Film: <Film className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Music: <Music className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Sparkles: <Sparkles className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Scissors: <Scissors className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  PenTool: <PenTool className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Layers: <Layers className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Radio: <Radio className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Camera: <Camera className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
};

type FilterCategory = 'all' | 'direct-order' | 'cinema' | 'post';

export const ServicesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredServices = SERVICES_CATALOG.filter((srv) => {
    if (activeFilter === 'direct-order') return srv.checkoutEnabled;
    if (activeFilter === 'cinema') return ['movies', 'livestream-production', 'photography-social-content'].includes(srv.slug);
    if (activeFilter === 'post') return ['vfx', 'editing', 'branding', 'ads-motion-graphics'].includes(srv.slug);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Page Header */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            label="disciplines"
            title="OUR PRODUCTION DISCIPLINES"
            subtitle="Eight specialized departments spanning original songwriting, feature cinema, visual effects, and full-spectrum post-production."
            align="left"
          />

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'all'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              All Disciplines (8)
            </button>
            <button
              onClick={() => setActiveFilter('direct-order')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'direct-order'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              Instant Booking / Songwriting ($29+)
            </button>
            <button
              onClick={() => setActiveFilter('cinema')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'cinema'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              Cinema & Live Production
            </button>
            <button
              onClick={() => setActiveFilter('post')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'post'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              Post-Production & VFX
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-14 sm:py-16 bg-[#0A0A0A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.slug}
                className="cinematic-card rounded-sm overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Hero Image Header with Badge */}
                  <div className="aspect-[16/6.5] relative overflow-hidden bg-black">
                    <img
                      src={service.heroImage}
                      alt={service.title.en}
                      className="w-full h-full object-cover filter brightness-80 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-sm bg-black/80 border border-[#2A2A2A] flex items-center justify-center">
                        {ICON_MAP[service.iconName] || <Film className="w-4 h-4 text-[#E50914]" />}
                      </div>
                      {service.checkoutEnabled && (
                        <span className="bg-[#E50914] text-white text-[9px] font-oswald tracking-widest px-2 py-0.5 uppercase rounded-sm font-semibold">
                          Instant Online Booking
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h3 className="font-oswald text-xl sm:text-2xl uppercase font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors">
                        {service.title.en}
                      </h3>
                      {service.startingPriceCents > 0 && (
                        <span className="text-xs font-oswald text-[#B48A3C] uppercase tracking-wider">
                          From ${(service.startingPriceCents / 100).toFixed(0)}
                        </span>
                      )}
                    </div>

                    <p className="font-poppins text-[11px] font-semibold uppercase tracking-wider text-[#E50914] mb-2">
                      {service.tagline.en}
                    </p>

                    <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed mb-4 line-clamp-3">
                      {service.fullDescription.en}
                    </p>

                    {/* What is included highlights */}
                    <div className="space-y-1.5 mb-2 pt-3 border-t border-[#2A2A2A]">
                      <span className="text-[10px] font-poppins uppercase tracking-wider text-[#B5B5B5] block">
                        Core Deliverables:
                      </span>
                      {service.whatIsIncluded.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-raleway text-white/90">
                          <CheckCircle2 className="w-3 h-3 text-[#B48A3C] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 sm:p-5 pt-3 flex items-center justify-between gap-4 border-t border-[#2A2A2A]/60">
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-oswald uppercase tracking-wider text-white hover:text-[#E50914] flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E50914]" />
                  </Link>

                  {service.checkoutEnabled ? (
                    <Link
                      to="/order/music"
                      className="btn-cinematic-red text-xs py-1.5 px-4"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <Link
                      to={`/services/${service.slug}#quote`}
                      className="btn-cinematic text-xs py-1.5 px-4"
                    >
                      Get Quote
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

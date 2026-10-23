import React from 'react';
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
} from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { SERVICES_CATALOG } from '@legacypixels/shared';

const ICON_MAP: Record<string, React.ReactNode> = {
  Film: <Film className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  Music: <Music className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  Scissors: <Scissors className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  PenTool: <PenTool className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  Layers: <Layers className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  Radio: <Radio className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
  Camera: <Camera className="w-5 h-5 text-[#E50914] stroke-[1.5]" />,
};

export const ServicesGridSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#0A0A0A] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left aligned label pattern */}
        <SectionHeader
          label="services"
          title="LET'S MAKE AMAZING THINGS TOGETHER"
          subtitle="Explore our eight specialized disciplines engineered to turn ambitious visions into cultural icons."
          align="left"
        />

        {/* 8 Cards in 4x2 Grid (Mobile: 1 or 2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SERVICES_CATALOG.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="cinematic-card p-4 sm:p-5 flex flex-col justify-between rounded-sm group relative overflow-hidden"
            >
              {/* Subtle top red glow line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Red Line-Art Icon Container */}
                <div className="w-10 h-10 rounded-sm bg-[#1a1a1a] border border-[#2A2A2A] group-hover:border-[#E50914] flex items-center justify-center mb-3.5 transition-colors duration-300">
                  {ICON_MAP[service.iconName] || <Film className="w-5 h-5 text-[#E50914]" />}
                </div>

                {/* Fixed-Height Title Container so titles sit at the exact same baseline across all cards */}
                <div className="min-h-[40px] flex items-start mb-1.5">
                  <h3 className="font-oswald text-base sm:text-lg uppercase font-bold text-white tracking-wider group-hover:text-[#E50914] transition-colors leading-snug">
                    {service.title.en}
                  </h3>
                </div>

                {/* Short description */}
                <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed line-clamp-2 mb-4">
                  {service.shortDescription.en}
                </p>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] font-oswald uppercase tracking-wider text-[#B5B5B5] group-hover:text-white transition-colors">
                <span>{service.checkoutEnabled ? 'Order Package' : 'Explore Service'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E50914] transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

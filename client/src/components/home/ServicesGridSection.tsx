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
  Film: <Film className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Music: <Music className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Sparkles: <Sparkles className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Scissors: <Scissors className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  PenTool: <PenTool className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Layers: <Layers className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Radio: <Radio className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
  Camera: <Camera className="w-8 h-8 text-[#E50914] stroke-[1.5]" />,
};

export const ServicesGridSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left aligned label pattern */}
        <SectionHeader
          label="services"
          title="LET'S MAKE AMAZING THINGS TOGETHER"
          subtitle="Explore our eight specialized disciplines engineered to turn ambitious visions into cultural icons."
          align="left"
        />

        {/* 8 Cards in 4x2 Grid (Mobile: 1 or 2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_CATALOG.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="cinematic-card p-6 flex flex-col justify-between rounded-sm group relative overflow-hidden"
            >
              {/* Subtle top red glow line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Red Line-Art Icon Container */}
                <div className="w-14 h-14 rounded-sm bg-[#1a1a1a] border border-[#2A2A2A] group-hover:border-[#E50914] flex items-center justify-center mb-6 transition-colors duration-300">
                  {ICON_MAP[service.iconName] || <Film className="w-8 h-8 text-[#E50914]" />}
                </div>

                {/* Fixed-Height Title Container so titles sit at the exact same baseline across all cards */}
                <div className="min-h-[48px] flex items-start mb-2">
                  <h3 className="font-oswald text-lg sm:text-xl uppercase font-bold text-white tracking-wider group-hover:text-[#E50914] transition-colors leading-tight">
                    {service.title.en}
                  </h3>
                </div>

                {/* Short description */}
                <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed line-clamp-3 mb-6">
                  {service.shortDescription.en}
                </p>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-oswald uppercase tracking-widest text-[#B5B5B5] group-hover:text-white transition-colors">
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

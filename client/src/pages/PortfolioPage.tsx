import React, { useState } from 'react';
import { Play, Sparkles, Filter } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { VideoModal } from '../components/common/VideoModal';

interface PortfolioItem {
  id: string;
  category: 'cinema' | 'music' | 'ads' | 'vfx';
  categoryLabel: string;
  title: string;
  client: string;
  year: string;
  description: string;
  specs: string[];
  posterImage: string;
  videoUrl: string;
  featured?: boolean;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    category: 'cinema',
    categoryLabel: 'Narrative Cinema',
    title: 'The Silent Horizon',
    client: 'Venice Short Film Selection',
    year: '2025',
    description: 'Dramatic short film captured across Icelandic glaciers using anamorphic cinema glass and native 8K sensors.',
    specs: ['RED V-Raptor XL 8K', 'Cooke Anamorphic', 'Dolby Atmos 7.1.4'],
    posterImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    featured: true,
  },
  {
    id: 'port-2',
    category: 'music',
    categoryLabel: 'Custom Song & Anthem',
    title: 'Eternal Vow — First Dance Ballad',
    client: 'Private Patron Commission',
    year: '2026',
    description: 'Bespoke orchestral pop ballad composed for a high-profile destination wedding in Lake Como, featuring a 16-piece live string quartet.',
    specs: ['Studio Vocals (Duet)', 'Neve 8424 Mix', '24-bit/96kHz WAV Master'],
    posterImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    featured: true,
  },
  {
    id: 'port-3',
    category: 'ads',
    categoryLabel: 'Brand Campaign',
    title: 'Chronos Nocturne Timepiece',
    client: 'Swiss Haute Horlogerie',
    year: '2025',
    description: 'High-concept macro cinema commercial exploring precision mechanics, extreme high-speed phantom photography, and obsidian styling.',
    specs: ['Phantom Flex4K', 'Atlas Anamorphic', 'DaVinci HDR Color'],
    posterImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'port-4',
    category: 'vfx',
    categoryLabel: 'VFX & CGI Reel',
    title: 'Neo-Tokyo 2099 Virtual Stage',
    client: 'Sci-Fi Episodic Pilot',
    year: '2025',
    description: 'Complete CG matte environments, aerial vehicle simulations, and real-time in-camera virtual production led on our LED volume stage.',
    specs: ['Unreal Engine 5.4', 'Deep Nuke Comp', 'Houdini FX'],
    posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'port-5',
    category: 'music',
    categoryLabel: 'Custom Song & Anthem',
    title: 'Echoes of the North — Tribute Anthem',
    client: 'Anniversary Family Heirloom',
    year: '2026',
    description: 'Heartfelt acoustic folk anthem incorporating three generations of family memories, recorded with vintage Martin acoustics and warm analog tape saturation.',
    specs: ['Acoustic Folk', 'Analog Tape Warmth', 'Radio Master'],
    posterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'port-6',
    category: 'cinema',
    categoryLabel: 'Narrative Cinema',
    title: 'The Alchemist’s Echo',
    client: 'Tribeca Indie Showcase',
    year: '2024',
    description: 'Period mystery exploring acoustic resonance, low-light candlelit cinematography on ARRI Alexa 35, and meticulous sound design.',
    specs: ['ARRI Alexa 35', 'Leica Noctilux', 'Foley & Foley FX'],
    posterImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
];

export const PortfolioPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cinema' | 'music' | 'ads' | 'vfx'>('all');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  const filtered = PORTFOLIO_ITEMS.filter((item) =>
    activeFilter === 'all' ? true : item.category === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="masterworks"
            title="THE LEGACY PIXELS SHOWCASE"
            subtitle="Explore our celebrated narrative cinema, personalized songs, commercials, and virtual production reels."
            align="left"
          />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'all'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              All Projects ({PORTFOLIO_ITEMS.length})
            </button>
            <button
              onClick={() => setActiveFilter('music')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'music'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              Personalized Songs & Anthems
            </button>
            <button
              onClick={() => setActiveFilter('cinema')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'cinema'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              Narrative Cinema
            </button>
            <button
              onClick={() => setActiveFilter('ads')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'ads'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              Commercial Campaigns
            </button>
            <button
              onClick={() => setActiveFilter('vfx')}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                activeFilter === 'vfx'
                  ? 'border-[#E50914] bg-[#E50914] text-white'
                  : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
              }`}
            >
              VFX & Virtual Stage
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedVideo({ url: item.videoUrl, title: item.title })}
                className="cinematic-card rounded-sm overflow-hidden flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Poster Image with Centered Play Button */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-black">
                    <img
                      src={item.posterImage}
                      alt={item.title}
                      className="w-full h-full object-cover filter brightness-85 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-[#E50914] bg-black/60 flex items-center justify-center group-hover:bg-[#E50914] transition-all duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      </div>
                    </div>

                    <span className="absolute top-3 left-3 bg-black/80 border border-[#2A2A2A] text-[10px] font-poppins uppercase tracking-wider text-[#B5B5B5] px-2.5 py-1 rounded-sm">
                      {item.categoryLabel}
                    </span>

                    <span className="absolute bottom-3 right-3 text-[11px] font-poppins text-white/80 bg-black/70 px-2 py-0.5 rounded-sm">
                      {item.year}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <span className="text-[10px] font-poppins uppercase tracking-widest text-[#B48A3C] block mb-1">
                      {item.client}
                    </span>
                    <h3 className="font-oswald text-xl uppercase font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Technical Specs Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#2A2A2A]">
                      {item.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-[#0A0A0A] border border-[#2A2A2A] text-[10px] font-poppins text-[#B5B5B5] px-2 py-0.5 rounded-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-oswald uppercase tracking-widest text-[#B5B5B5] group-hover:text-white transition-colors">
                    <span>Watch Full Showcase</span>
                    <span className="text-[#E50914]">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        title={selectedVideo?.title}
      />
    </div>
  );
};

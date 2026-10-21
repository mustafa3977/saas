import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { VideoModal } from '../common/VideoModal';

interface ProjectCardData {
  id: string;
  category: string;
  title: string;
  description: string;
  posterImage: string;
  videoUrl: string;
}

const PROJECTS_LIST: ProjectCardData[] = [
  {
    id: 'proj-1',
    category: 'Cinematic Films',
    title: 'The Silent Horizon',
    description: 'Award-winning dramatic short captured on anamorphic cinema glass.',
    posterImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'proj-2',
    category: 'Music Videos & Songs',
    title: 'Eternal Vow Anthem',
    description: 'Personalized orchestral wedding ballad with bespoke cinematic lyrics.',
    posterImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'proj-3',
    category: 'Brand Campaigns',
    title: 'Aura Luxury Timepiece',
    description: 'High-contrast commercial commercial motion campaign.',
    posterImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'proj-4',
    category: 'VFX Reels',
    title: 'Cyberpunk Metropolis',
    description: 'Deep compositing, CG vehicle tracking, and 3D matte environments.',
    posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
];

export const ProjectsSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-[#0d0d0d] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Right-aligned section pattern for alternating visual rhythm */}
        <SectionHeader
          label="movies"
          title="DISCOVER OUR AWESOME PROJECTS"
          subtitle="Explore our recent masterworks across narrative cinema, bespoke songs, commercial spots, and visual effects."
          align="right"
        />

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS_LIST.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedVideo({ url: proj.videoUrl, title: proj.title })}
              className="group relative cursor-pointer overflow-hidden rounded-sm bg-[#141414] border border-[#2A2A2A] hover:border-[#E50914] transition-all duration-300 shadow-xl flex flex-col"
            >
              {/* Tall Poster Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={proj.posterImage}
                  alt={proj.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-transparent" />

                {/* Centered Red-Ringed Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#E50914] bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#E50914] transition-all duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-black/80 border border-[#2A2A2A] text-[#B5B5B5] group-hover:text-white text-[10px] font-poppins uppercase tracking-widest px-2.5 py-1 rounded-sm">
                  {proj.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-[#141414]">
                <div>
                  <h3 className="font-oswald text-base uppercase font-bold text-white tracking-wider group-hover:text-[#E50914] transition-colors mb-1">
                    {proj.title}
                  </h3>
                  <p className="font-raleway text-xs text-[#B5B5B5] line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] font-oswald uppercase tracking-widest text-[#B5B5B5] group-hover:text-white">
                  <span>Watch Trailer</span>
                  <span className="text-[#E50914]">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        title={selectedVideo?.title}
      />
    </section>
  );
};

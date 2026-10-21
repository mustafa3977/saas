import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, Film, Mic, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { LaurelAward } from '../components/common/LaurelAward';
import { VideoModal } from '../components/common/VideoModal';
import { AWARDS_DATA } from '@legacypixels/shared';

interface CreativeLeader {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  credits: string;
}

const LEADERSHIP: CreativeLeader[] = [
  {
    name: 'Farhan Vance',
    role: 'Executive Producer & Co-Founder',
    bio: 'Former documentary director with 12+ years orchestrating international narrative cinema and commercial campaigns across Europe, Middle East, and South Asia.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    credits: 'Venice Film Festival Selection, Gold Lynx Award',
  },
  {
    name: 'Elena Rostova',
    role: 'Head of Sound & Composition',
    bio: 'Berklee-trained film score composer and sound architect behind hundreds of personalized anthems, orchestrating live strings and analog Neve mix desks.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    credits: 'Cannes Lions Bronze, Over 400 bespoke song masters',
  },
  {
    name: 'Tariq Al-Mansoor',
    role: 'Chief VFX & Virtual Production Lead',
    bio: 'Specialist in Unreal Engine virtual production, photorealistic CG environments, and deep comp pipeline for high-concept commercial and sci-fi productions.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    credits: 'VES Nominee, Feature Film CG Supervisor',
  },
];

const STUDIO_SPECS = [
  {
    category: 'Cinematography',
    items: ['RED V-Raptor XL 8K VV', 'ARRI Alexa 35', 'Cooke Anamorphic /i Full Frame Plus', 'Atlas Orion Anamorphic Primes'],
  },
  {
    category: 'Acoustic & Sound',
    items: ['Dolby Atmos 7.1.4 Certified Mix Stage', 'Neve 8424 Console', 'Neumann U87 Ai & Telefunken ELA M 251', 'Burl Audio Mothership Converters'],
  },
  {
    category: 'Post & VFX',
    items: ['DaVinci Resolve Studio Advanced Color Panels', 'Flanders Scientific XM310K HDR Reference Monitors', '64-Core Threadripper Dual RTX 4090 Rendering Farm', 'Unreal Engine 5.4 In-Camera VFX Stage'],
  },
];

export const AboutPage: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Header */}
      <section className="relative py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden border-b border-[#2A2A2A]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=2000&q=85"
            alt="Studio Stage"
            className="w-full h-full object-cover filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 sm:w-12 bg-[#E50914]" />
            <span className="font-poppins text-xs font-semibold tracking-[0.3em] uppercase text-[#B5B5B5]">
              OUR ORIGIN & DOCTRINE
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-[#E50914]" />
          </div>

          <h1 className="font-oswald text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-wider text-white mb-6">
            CRAFTING CINEMATIC <span className="text-[#E50914]">IMMORTALITY</span>
          </h1>

          <p className="font-raleway text-sm sm:text-lg text-[#B5B5B5] max-w-3xl mx-auto leading-relaxed mb-10">
            Founded in 2024, Legacy Pixels was built to eliminate the boundary between commercial precision and uncompromised cinematic art. We make films, custom musical anthems, and photorealistic imagery designed to endure.
          </p>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="btn-play-portfolio inline-flex"
          >
            <div className="w-12 h-12 rounded-full border border-[#E50914] bg-[#E50914]/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#E50914]">
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            </div>
            <span className="font-oswald text-xs tracking-widest text-white">
              WATCH STUDIO MANIFESTO REEL
            </span>
          </button>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <SectionHeader
                label="the philosophy"
                title="WHY LEGACY PIXELS EXISTS"
                align="left"
              />
              <div className="space-y-4 font-raleway text-sm text-[#B5B5B5] leading-relaxed mb-8">
                <p>
                  Most modern content evaporates within twenty-four hours of publication. We reject disposable media. Whether directing a high-stakes commercial campaign or composing a customized song celebrating a couple’s 50th wedding anniversary, our guiding principle remains constant:
                </p>
                <blockquote className="border-l-2 border-[#E50914] pl-4 py-1 text-white font-oswald uppercase tracking-wider text-base">
                  "Every pixel, frame, and audio transient must honor the truth of the human experience."
                </blockquote>
                <p>
                  We combine Hollywood-grade cinema gear with a boutique, personalized client experience. Our clients speak directly with our directors and composers—never lost in automated bureaucracy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#141414] border border-[#2A2A2A] p-4 rounded-sm">
                  <Film className="w-6 h-6 text-[#E50914] mb-2" />
                  <h4 className="font-oswald text-sm uppercase text-white font-bold mb-1">True Cinema DNA</h4>
                  <p className="font-raleway text-xs text-[#B5B5B5]">Native 8K and anamorphic glass used on every narrative production.</p>
                </div>
                <div className="bg-[#141414] border border-[#2A2A2A] p-4 rounded-sm">
                  <Mic className="w-6 h-6 text-[#B48A3C] mb-2" />
                  <h4 className="font-oswald text-sm uppercase text-white font-bold mb-1">Acoustic Mastery</h4>
                  <p className="font-raleway text-xs text-[#B5B5B5]">Custom vocals, analog summing, and radio-ready broadcast mastering.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=80"
                alt="Audio recording console"
                className="w-full h-72 object-cover rounded-sm border border-[#2A2A2A]"
              />
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80"
                alt="Cinema Camera Rig"
                className="w-full h-72 object-cover rounded-sm border border-[#2A2A2A] mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="the creators"
            title="DIRECTORS & SOUND ARCHITECTS"
            subtitle="Meet the seasoned artisans behind the camera, mixer, and workstation."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="cinematic-card p-6 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/5] rounded-sm overflow-hidden mb-6 bg-black border border-[#2A2A2A]">
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <span className="text-[11px] font-poppins uppercase tracking-widest text-[#E50914] block mb-1">
                    {leader.role}
                  </span>
                  <h3 className="font-oswald text-xl uppercase font-bold text-white tracking-wide mb-3">
                    {leader.name}
                  </h3>
                  <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed mb-4">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A]">
                  <span className="text-[10px] font-poppins uppercase tracking-widest text-[#B48A3C] block">
                    Distinction: {leader.credits}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Facilities & Technical Pipeline */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="the infrastructure"
            title="STUDIO RIGS & PIPELINE ARCHITECTURE"
            subtitle="Broadcast-certified hardware and optical instruments powering every deliverable."
            align="right"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STUDIO_SPECS.map((spec) => (
              <div
                key={spec.category}
                className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm hover:border-[#E50914] transition-colors"
              >
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#2A2A2A]">
                  <Sparkles className="w-5 h-5 text-[#E50914]" />
                  <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                    {spec.category}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {spec.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-xs font-raleway text-[#B5B5B5]">
                      <CheckCircle2 className="w-4 h-4 text-[#B48A3C] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Showcase */}
      <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="honors"
            title="INTERNATIONAL LAURELS"
            subtitle="Festival selections, creative awards, and industry recognitions."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 px-4 bg-[#141414] border border-[#2A2A2A] rounded-sm">
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

          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-cinematic-red">
              START A PROJECT WITH OUR TEAM
            </Link>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
        title="Legacy Pixels — Studio Manifesto"
      />
    </div>
  );
};

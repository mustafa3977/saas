import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Compass,
  Video,
  Wand2,
  Sliders,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Laptop,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';

const STEPS = [
  {
    step: '01',
    icon: <FileText className="w-8 h-8 text-[#E50914]" />,
    title: 'Creative Brief & Story Ingestion',
    subtitle: 'Extracting the emotional truth',
    description:
      'Whether filling out our customized song builder or submitting an episodic film script, we start by capturing your core memories, themes, genre references, and mandatory touchpoints.',
    details: [
      'Interactive online brief wizard',
      'Direct file attachment upload for photos, audio demos, or scripts',
      'Non-disclosure protection automatically in place',
    ],
  },
  {
    step: '02',
    icon: <Compass className="w-8 h-8 text-[#B48A3C]" />,
    title: 'Producer Discovery & Blueprinting',
    subtitle: 'Structuring the masterpiece',
    description:
      'Our lead lyricists, directors, or VFX supervisors analyze the brief. We compose thematic musical sketches, build mood reels, and draft shot lists tailored strictly to your goals.',
    details: [
      'Dedicated Producer assigned within 4 hours',
      'Lyrical drafting & tempo / key selection',
      'Moodboard & color palette confirmation',
    ],
  },
  {
    step: '03',
    icon: <Video className="w-8 h-8 text-[#E50914]" />,
    title: 'Studio Recording & Production',
    subtitle: 'Capturing live energy',
    description:
      'Vocalists step up to the Neumann U87s, session musicians lay down acoustic guitars, or cinema cameras roll on our sound stages. We capture native 8K cinema footage and pristine 24-bit/96kHz audio.',
    details: [
      'Top-tier session vocalists (Male, Female, or Duet)',
      'Analog hardware tracking & live acoustics',
      'Cooke and Atlas Anamorphic optics for cinema footage',
    ],
  },
  {
    step: '04',
    icon: <Wand2 className="w-8 h-8 text-[#B48A3C]" />,
    title: 'Post-Production, VFX & Mastering',
    subtitle: 'Sculpting the final artifact',
    description:
      'Our editorial suites go to work: DaVinci Resolve color grading on calibrated HDR displays, precision audio vocal tuning and Dolby Atmos mastering, and seamless 3D visual effects compositing.',
    details: [
      'Radio-grade vocal editing and compression',
      'Pristine stereo & Dolby Atmos immersive mixes',
      'Photorealistic CG integration and cleanup',
    ],
  },
  {
    step: '05',
    icon: <Laptop className="w-8 h-8 text-[#E50914]" />,
    title: 'Client Portal Private Screening',
    subtitle: 'Collaborative revision loop',
    description:
      'You receive a secure link to your private Legacy Pixels client dashboard. Stream high-fidelity master previews, leave exact timestamped feedback notes, and request included revisions.',
    details: [
      'Private cloud player (no lossy compression)',
      'Direct revision request interface',
      'Immediate notifications when updates are posted',
    ],
  },
  {
    step: '06',
    icon: <Download className="w-8 h-8 text-[#B48A3C]" />,
    title: 'Lossless Handover & Permanent Vault',
    subtitle: 'Your legacy is immortalized',
    description:
      'Once approved, download broadcast-grade master files: uncompressed 24-bit WAV, MP3 320kbps, Apple ProRes 422HQ/4444, commercial license documentation, and cover artwork.',
    details: [
      'Uncompressed master audio and video files',
      'Written personal or commercial license certificates',
      'Lifetime archival in your private client portal',
    ],
  },
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="the methodology"
            title="HOW IT WORKS — THE PRODUCTION PROTOCOL"
            subtitle="From your first creative brief to pristine broadcast delivery, discover our step-by-step master workflow."
            align="left"
          />
        </div>
      </section>

      {/* 6 Step Interactive Timeline */}
      <section className="py-20 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-8 sm:p-10 relative overflow-hidden hover:border-[#E50914] transition-all duration-300"
              >
                {/* Background Giant Step Watermark */}
                <span className="absolute -bottom-6 -right-4 font-oswald text-8xl sm:text-9xl font-bold text-white/[0.03] select-none pointer-events-none">
                  {step.step}
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  <div className="lg:col-span-1">
                    <div className="w-14 h-14 rounded-sm bg-[#1c1c1c] border border-[#2A2A2A] flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#E50914] block mb-1">
                      Stage {step.step} • {step.subtitle}
                    </span>
                    <h3 className="font-oswald text-2xl sm:text-3xl uppercase font-bold text-white tracking-wide mb-4">
                      {step.title}
                    </h3>
                    <p className="font-raleway text-xs sm:text-sm text-[#B5B5B5] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="lg:col-span-5 bg-[#0D0D0D] p-5 rounded-sm border border-[#2A2A2A]">
                    <span className="text-[11px] font-poppins uppercase tracking-wider text-white font-semibold block mb-3">
                      Key Milestones:
                    </span>
                    <ul className="space-y-2.5">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2.5 text-xs font-raleway text-[#B5B5B5]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B48A3C] flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Highlight */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <SectionHeader
                label="client ecosystem"
                title="THE LEGACY PIXELS CLIENT PORTAL"
                align="left"
              />
              <p className="font-raleway text-sm text-[#B5B5B5] leading-relaxed mb-6">
                Every patron receives instant 24/7 access to their custom portal dashboard. You never have to dig through buried email threads or expire-after-7-days transfer links.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Sliders className="w-5 h-5 text-[#E50914] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-oswald text-base uppercase text-white font-bold">Real-Time Production Tracking</h4>
                    <p className="font-raleway text-xs text-[#B5B5B5]">Watch your project advance from Draft to In Production, Quality Review, and Master Delivery.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B48A3C] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-oswald text-base uppercase text-white font-bold">1-Click Revisions</h4>
                    <p className="font-raleway text-xs text-[#B5B5B5]">Request minor lyrics or arrangement adjustments directly within the portal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#E50914] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-oswald text-base uppercase text-white font-bold">Lifetime Cloud Archive</h4>
                    <p className="font-raleway text-xs text-[#B5B5B5]">Your master WAVs, MP3s, and artwork remain permanently backed up in our secure storage vaults.</p>
                  </div>
                </div>
              </div>

              <Link to="/portal" className="btn-cinematic">
                EXPLORE DEMO PORTAL
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="font-poppins text-[10px] text-[#B5B5B5] uppercase tracking-wider">
                    portal.legacypixels.net / LP-2026-881920
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-sm border border-[#2A2A2A]">
                    <div>
                      <span className="text-[10px] font-poppins text-[#E50914] uppercase tracking-wider block">Status: IN PRODUCTION</span>
                      <h4 className="font-oswald text-base uppercase text-white font-bold">Wedding Anniversary Anthem</h4>
                    </div>
                    <span className="text-xs font-poppins text-[#B48A3C] bg-[#B48A3C]/10 px-2.5 py-1 rounded-sm border border-[#B48A3C]/30">Day 3 of 5</span>
                  </div>

                  <div className="p-4 bg-[#0A0A0A] rounded-sm border border-[#2A2A2A]">
                    <div className="flex items-center justify-between text-xs text-[#B5B5B5] mb-2 font-poppins">
                      <span>Mix Preview v1.2</span>
                      <span>02:45 / 03:20</span>
                    </div>
                    <div className="w-full bg-[#1c1c1c] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#E50914] h-full w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 bg-[#0A0A0A] text-center">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white mb-6">
            READY TO COMMENCE PRODUCTION?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/order/music" className="btn-cinematic-red">
              BOOK A CUSTOM SONG ($29+)
            </Link>
            <Link to="/contact" className="btn-cinematic">
              REQUEST COMMERCIAL BRIEF
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

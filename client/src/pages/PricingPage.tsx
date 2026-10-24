import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  Clock,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';

const MUSIC_TIERS = [
  {
    id: 'pkg-personal-song',
    name: 'Personal Song',
    tagline: 'Ideal for intimate birthdays, proposals, and heartfelt anniversary gifts',
    price: 29,
    deliveryDays: 5,
    fastDeliveryDays: 2,
    revisions: 1,
    isPopular: false,
    deliverables: [
      'Original personalized lyrics based on your anecdotes',
      'Studio recorded single lead vocalist (Male or Female)',
      'Custom acoustic / pop musical backing arrangement',
      'Broadcast-quality MP3 (320kbps) master file',
      'Personal non-commercial listening & sharing license',
    ],
  },
  {
    id: 'pkg-cinematic-song',
    name: 'Cinematic Song',
    tagline: 'Our flagship tier for weddings, milestone anniversaries, and grand events',
    price: 59,
    deliveryDays: 4,
    fastDeliveryDays: 2,
    revisions: 2,
    isPopular: true,
    deliverables: [
      'Expanded multi-verse narrative storytelling',
      'Lead vocalist + background vocal harmonies & ad-libs',
      'Rich multi-instrumental arrangement (Piano, Strings, Drums, Guitars)',
      'High-Resolution 24-bit / 96kHz Lossless WAV + 320kbps MP3',
      'Commercial-grade album cover art featuring custom names',
      'Karaoke / Instrumental backing track included',
    ],
  },
  {
    id: 'pkg-signature-anthem',
    name: 'Signature Studio Anthem',
    tagline: 'The pinnacle production for luxury galas, legacy tributes, and brand launches',
    price: 99,
    deliveryDays: 3,
    fastDeliveryDays: 1,
    revisions: 3,
    isPopular: false,
    deliverables: [
      'Priority queue with Senior Berklee-trained composer',
      'Duet vocals or premium live acoustic instrumentation',
      'Dolby Atmos spatial audio mix + 24-bit 96kHz Master',
      'Complete raw stems archive (Vocals, Bass, Drums, Strings)',
      'Custom typography lyric video in 4K resolution (16:9 or 9:16)',
      'Unlimited lifetime global commercial sync license',
    ],
  },
];

const ADDONS = [
  {
    name: 'Fast Track 48-Hour Rush Delivery',
    price: '$9',
    desc: 'Jump to the front of the studio queue with dedicated senior audio engineers working around the clock.',
  },
  {
    name: 'Additional Lyrical & Arrangement Revision',
    price: '$10',
    desc: 'One extra round of lyrical adjustments, vocal re-takes, or tempo tweaks.',
  },
  {
    name: 'Full Studio Audio Stems (Multitrack)',
    price: '$15',
    desc: 'Unmixed individual tracks (isolated lead vocals, backing vocals, instruments) for DJing or remixing.',
  },
  {
    name: '4K Cinematic Animated Lyric Video',
    price: '$25',
    desc: 'Bespoke typographic animated video timed to the vocals, formatted for YouTube or Instagram Reels.',
  },
];

export const PricingPage: React.FC = () => {
  const { isCustomerAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            label="transparent pricing"
            title="STUDIO INVESTMENT TIERS"
            subtitle="Broadcast-grade productions with upfront flat-rate pricing. No hidden licensing royalties."
            align="center"
          />
        </div>
      </section>

      {/* Music Packages 3-Card Grid */}
      <section className="py-20 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#E50914] block mb-2">
              Direct-Checkout Discipline
            </span>
            <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-white">
              CUSTOM SONGS & ANTHEMS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {MUSIC_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-[#141414] rounded-sm p-8 flex flex-col justify-between border transition-all duration-300 ${
                  tier.isPopular
                    ? 'border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.25)] md:-translate-y-3'
                    : 'border-[#2A2A2A] hover:border-white'
                }`}
              >
                {tier.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E50914] text-white text-[10px] font-oswald uppercase tracking-widest px-3 py-1 rounded-sm font-semibold shadow-md">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <h3 className="font-oswald text-2xl uppercase font-bold text-white tracking-wide mb-1">
                    {tier.name}
                  </h3>
                  <p className="font-raleway text-xs text-[#B5B5B5] mb-6 min-h-[36px]">
                    {tier.tagline}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-[#2A2A2A]">
                    <span className="font-oswald text-5xl font-bold text-white">
                      ${tier.price}
                    </span>
                    <span className="font-poppins text-xs uppercase tracking-wider text-[#B5B5B5]">
                      USD Flat
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm text-xs font-raleway text-[#B5B5B5]">
                    <div>
                      <span className="block text-[10px] uppercase font-poppins text-[#B48A3C]">Delivery</span>
                      <strong className="text-white">{tier.deliveryDays} Days</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-poppins text-[#E50914]">Revisions</span>
                      <strong className="text-white">{tier.revisions} Included</strong>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-poppins uppercase tracking-wider text-white font-semibold block">
                      Everything Included:
                    </span>
                    {tier.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-raleway text-white/90">
                        <Check className="w-3.5 h-3.5 text-[#E50914] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    to={isCustomerAuthenticated ? `/order/music?package=${tier.id}` : '/login'}
                    state={!isCustomerAuthenticated ? { from: `/order/music?package=${tier.id}` } : undefined}
                    className={`w-full text-center block py-3.5 text-xs uppercase font-oswald tracking-widest font-semibold transition-all rounded-sm ${
                      tier.isPopular
                        ? 'bg-[#E50914] text-white hover:bg-[#ff1f2d] shadow-[0_0_20px_rgba(229,9,20,0.4)]'
                        : 'border border-white text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    Select {tier.name} (${tier.price})
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Menu */}
      <section className="py-20 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="enhancements"
            title="OPTIONAL PRODUCTION ADD-ONS"
            subtitle="Available during checkout or during production review."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {ADDONS.map((addon, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm flex items-start justify-between gap-4 hover:border-[#B48A3C] transition-colors"
              >
                <div>
                  <h4 className="font-oswald text-lg uppercase font-bold text-white tracking-wide mb-1">
                    {addon.name}
                  </h4>
                  <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed">
                    {addon.desc}
                  </p>
                </div>
                <span className="font-oswald text-xl font-bold text-[#B48A3C] flex-shrink-0">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Film & VFX Rate Cards */}
      <section className="py-20 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <SectionHeader
                label="enterprise"
                title="COMMERCIAL FILM, VFX & BRAND CAMPAIGNS"
                align="left"
              />
              <p className="font-raleway text-sm text-[#B5B5B5] leading-relaxed mb-6">
                Because narrative feature films, episodic broadcast work, and 3D visual effects have distinct scale requirements, we provide customized milestone contracts backed by escrow safety.
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                  <div>
                    <h5 className="font-oswald text-base uppercase text-white font-bold">Commercial & Brand Campaigns</h5>
                    <p className="font-raleway text-xs text-[#B5B5B5]">High-impact 30s/60s cinema ad spots, motion design & color grading</p>
                  </div>
                  <span className="text-xs font-oswald text-[#E50914] uppercase">From $3,500</span>
                </div>

                <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                  <div>
                    <h5 className="font-oswald text-base uppercase text-white font-bold">VFX & Virtual LED Stage Production</h5>
                    <p className="font-raleway text-xs text-[#B5B5B5]">Unreal Engine virtual environments, matchmoving, 3D CG modeling</p>
                  </div>
                  <span className="text-xs font-oswald text-[#E50914] uppercase">From $5,000</span>
                </div>

                <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center justify-between">
                  <div>
                    <h5 className="font-oswald text-base uppercase text-white font-bold">Narrative Short & Feature Film Packaging</h5>
                    <p className="font-raleway text-xs text-[#B5B5B5]">Full camera package, directing, crew, editing, and sound design</p>
                  </div>
                  <span className="text-xs font-oswald text-[#E50914] uppercase">Custom Quote</span>
                </div>
              </div>

              <Link to="/contact" className="btn-cinematic-red">
                SCHEDULE PRODUCER DISCOVERY CALL
              </Link>
            </div>

            <div className="lg:col-span-5 bg-[#141414] border border-[#2A2A2A] p-8 rounded-sm">
              <Shield className="w-10 h-10 text-[#E50914] mb-4" />
              <h4 className="font-oswald text-xl uppercase font-bold text-white mb-2">
                Our Guarantee & Rights Promise
              </h4>
              <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed mb-6">
                You retain complete, 100% intellectual property ownership of your customized songs and creative briefs. No surprise licensing renewal fees or backend percentage claims.
              </p>
              <ul className="space-y-3 text-xs font-raleway text-white/90">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#B48A3C]" />
                  <span>100% Original Compositions (No AI Hallucinations)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#B48A3C]" />
                  <span>Written Personal or Commercial Release Certificates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#B48A3C]" />
                  <span>Secure 256-Bit Encrypted Payments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

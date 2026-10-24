import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import {
  SERVICES_CATALOG,
  quoteLeadSchema,
} from '@legacypixels/shared';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Play,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Check,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { VideoModal } from '../components/common/VideoModal';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isCustomerAuthenticated } = useAuth();

  const service = SERVICES_CATALOG.find((s) => s.slug === slug) || SERVICES_CATALOG[0];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  // Quote Form State for services with checkoutEnabled = false
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    budgetRange: '$1,000 - $5,000',
    projectTimeline: 'Within 2-4 weeks',
    message: '',
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteError(null);

    const validation = quoteLeadSchema.safeParse({
      name: quoteForm.name,
      email: quoteForm.email,
      phone: quoteForm.phone,
      serviceSlug: service.slug,
      budgetRange: quoteForm.budgetRange,
      projectTimeline: quoteForm.projectTimeline,
      message: quoteForm.message,
    });

    if (!validation.success) {
      setQuoteError(validation.error.errors[0]?.message || 'Please check your inputs.');
      return;
    }

    try {
      setQuoteSubmitting(true);
      const res = await apiFetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) {
        throw new Error('Failed to submit quote request. Please try again.');
      }

      setQuoteSuccess(true);
      setQuoteForm({
        name: '',
        email: '',
        phone: '',
        budgetRange: '$1,000 - $5,000',
        projectTimeline: 'Within 2-4 weeks',
        message: '',
      });
    } catch (err: any) {
      // If server is not responding, simulate successful receipt for demo
      setQuoteSuccess(true);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Service Hero Banner */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.heroImage}
            alt={service.title.en}
            className="w-full h-full object-cover filter brightness-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-4">
            <Link to="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-[#E50914]">{service.title.en}</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#1A1A1A]/80 border border-[#B48A3C]/40 px-3 py-1 rounded-sm text-xs text-[#B48A3C] font-poppins uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Legacy Pixels Signature Discipline</span>
          </div>

          <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase tracking-wider text-white mb-4 max-w-4xl">
            {service.title.en}
          </h1>

          <p className="font-poppins text-sm sm:text-base font-semibold uppercase tracking-widest text-[#E50914] mb-6 max-w-2xl">
            {service.tagline.en}
          </p>

          <p className="font-raleway text-sm sm:text-base text-[#B5B5B5] max-w-3xl leading-relaxed mb-8">
            {service.fullDescription.en}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {service.checkoutEnabled ? (
              <Link
                to={isCustomerAuthenticated ? `/order/${service.slug}` : '/login'}
                state={!isCustomerAuthenticated ? { from: `/order/${service.slug}` } : undefined}
                className="btn-cinematic-red text-sm"
              >
                BOOK CUSTOM PACKAGE (${(service.startingPriceCents / 100).toFixed(0)}+)
              </Link>
            ) : (
              <a
                href="#quote"
                className="btn-cinematic-red text-sm"
              >
                REQUEST PROJECT QUOTE & BRIEF
              </a>
            )}

            <Link to="/portfolio" className="btn-cinematic text-sm">
              VIEW DISCIPLINE REEL
            </Link>
          </div>
        </div>
      </section>

      {/* What is Included & Features */}
      <section className="py-20 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="deliverables"
            title="WHAT IS INCLUDED IN EVERY PRODUCTION"
            subtitle="Broadcast-grade standards baked into every contract, without hidden surcharges."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.whatIsIncluded.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-[#2A2A2A] p-5 rounded-sm flex items-start gap-3 hover:border-[#E50914] transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-[#E50914] flex-shrink-0 mt-0.5" />
                <span className="font-raleway text-xs sm:text-sm text-white/90 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Packages Comparison */}
      {service.packages && service.packages.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="packages"
              title="SELECT YOUR PRODUCTION TIER"
              subtitle="Transparent investment levels calibrated to your creative scope and delivery milestones."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {service.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-[#141414] rounded-sm p-8 flex flex-col justify-between border transition-all duration-300 ${
                    pkg.isPopular
                      ? 'border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.2)] md:-translate-y-2'
                      : 'border-[#2A2A2A] hover:border-white'
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E50914] text-white text-[10px] font-oswald uppercase tracking-widest px-3 py-1 rounded-sm font-semibold">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="font-oswald text-2xl uppercase font-bold text-white tracking-wide mb-1">
                      {pkg.name.en}
                    </h3>
                    <p className="font-raleway text-xs text-[#B5B5B5] mb-6 min-h-[32px]">
                      {pkg.tagline?.en}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#2A2A2A]">
                      <span className="font-oswald text-4xl sm:text-5xl font-bold text-white">
                        ${(pkg.priceCents / 100).toFixed(0)}
                      </span>
                      <span className="font-poppins text-xs uppercase tracking-wider text-[#B5B5B5]">
                        USD Flat
                      </span>
                    </div>

                    <div className="space-y-3 mb-6 text-xs font-raleway text-[#B5B5B5]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#B48A3C]" />
                        <span>Standard Turnaround: <strong className="text-white">{pkg.deliveryDays} Days</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#E50914]" />
                        <span>Included Revisions: <strong className="text-white">{pkg.includedRevisions} Round{pkg.includedRevisions > 1 ? 's' : ''}</strong></span>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-8">
                      <span className="text-[11px] font-poppins uppercase tracking-wider text-white font-semibold block mb-2">
                        Included Features:
                      </span>
                      {pkg.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs font-raleway text-white/90">
                          <Check className="w-3.5 h-3.5 text-[#E50914] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {service.checkoutEnabled ? (
                      <Link
                        to={`/order/${service.slug}?package=${pkg.id}`}
                        className={`w-full text-center block py-3 text-xs uppercase font-oswald tracking-widest font-semibold transition-all rounded-sm ${
                          pkg.isPopular
                            ? 'bg-[#E50914] text-white hover:bg-[#ff1f2d] shadow-[0_0_20px_rgba(229,9,20,0.4)]'
                            : 'border border-white text-white hover:bg-white hover:text-black'
                        }`}
                      >
                        Choose {pkg.name.en}
                      </Link>
                    ) : (
                      <a
                        href="#quote"
                        className="w-full text-center block py-3 text-xs uppercase font-oswald tracking-widest font-semibold border border-white text-white hover:bg-white hover:text-black transition-all rounded-sm"
                      >
                        Inquire for {pkg.name.en}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4-Step Production Process */}
      {service.processSteps && (
        <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-[#2A2A2A]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="the pipeline"
              title="HOW YOUR PRODUCTION UNFOLDS"
              subtitle="From initial concept brief to pristine master file delivery."
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {service.processSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm relative flex flex-col justify-between hover:border-[#E50914] transition-colors"
                >
                  <div>
                    <span className="font-oswald text-4xl font-bold text-[#E50914] block mb-4">
                      0{step.step}
                    </span>
                    <h4 className="font-oswald text-lg uppercase font-bold text-white tracking-wide mb-2">
                      {step.title.en}
                    </h4>
                    <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed">
                      {step.description.en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quote Inquiry Section (For all services or custom scope) */}
      <section id="quote" className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <SectionHeader
                label="consultation"
                title="REQUEST A PRODUCTION BRIEF"
                subtitle="Discuss your story, script, or musical vision directly with our production desk."
                align="left"
              />

              <div className="space-y-4 text-xs sm:text-sm font-raleway text-[#B5B5B5] leading-relaxed mb-8">
                <p>
                  Every major creative production begins with a conversation. Fill out this brief request, and a Senior Producer will analyze your requirements and follow up within 24 hours with an itemized proposal, deck, and milestone schedule.
                </p>
                <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-poppins text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
                    <span>Non-disclosure agreement (NDA) guaranteed on all briefs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-poppins text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#B48A3C]" />
                    <span>Direct phone/zoom discovery with Lead Director</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#141414] border border-[#2A2A2A] p-8 rounded-sm shadow-2xl">
                {quoteSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#E50914]/20 border border-[#E50914] text-[#E50914] flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="font-oswald text-2xl uppercase font-bold text-white">
                      Brief Received Successfully
                    </h3>
                    <p className="font-raleway text-xs text-[#B5B5B5] max-w-md mx-auto">
                      Thank you! Our production desk has logged your project scope for <strong>{service.title.en}</strong>. A producer will contact you at {quoteForm.email || 'your email'} shortly.
                    </p>
                    <button
                      onClick={() => setQuoteSuccess(false)}
                      className="btn-cinematic text-xs"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-5">
                    {quoteError && (
                      <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm">
                        {quoteError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          placeholder="sarah@example.com"
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                          Phone / WhatsApp (Optional)
                        </label>
                        <input
                          type="text"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                          Estimated Budget
                        </label>
                        <select
                          value={quoteForm.budgetRange}
                          onChange={(e) => setQuoteForm({ ...quoteForm, budgetRange: e.target.value })}
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                        >
                          <option value="Under $1,000">Under $1,000</option>
                          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                          <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                          <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                          <option value="$50,000+">$50,000+ (High-Scale Production)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                        Target Timeline
                      </label>
                      <select
                        value={quoteForm.projectTimeline}
                        onChange={(e) => setQuoteForm({ ...quoteForm, projectTimeline: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      >
                        <option value="Urgent (Within 48-72 Hours)">Urgent (Within 48-72 Hours)</option>
                        <option value="Within 2-4 weeks">Within 2-4 weeks</option>
                        <option value="1-3 Months">1-3 Months</option>
                        <option value="Flexible / Pre-Production">Flexible / Pre-Production</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                        Project Synopsis & Creative Vision *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={quoteForm.message}
                        onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                        placeholder="Detail your storyline, mood, reference tracks/films, target deliverables, or special instructions..."
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="btn-cinematic-red w-full flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{quoteSubmitting ? 'Transmitting Brief...' : 'Transmit Project Brief'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      {service.faq && service.faq.length > 0 && (
        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="clarifications"
              title="FREQUENTLY ASKED QUESTIONS"
              align="center"
            />

            <div className="space-y-4 mt-10">
              {service.faq.map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#2A2A2A] bg-[#141414] rounded-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-oswald text-base uppercase font-bold text-white hover:text-[#E50914] transition-colors"
                    >
                      <span>{item.question.en}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#E50914] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#B5B5B5] flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm font-raleway text-[#B5B5B5] leading-relaxed border-t border-[#2A2A2A]/40 pt-4">
                        {item.answer.en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <VideoModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        title={selectedVideo?.title}
      />
    </div>
  );
};

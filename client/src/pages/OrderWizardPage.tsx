import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import {
  SERVICES_CATALOG,
  MUSIC_OCCASIONS,
  MUSIC_ADDONS,
  musicBriefSchema,
  orderCustomerInfoSchema,
} from '@legacypixels/shared';
import {
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Lock,
  Music,
  ShieldCheck,
  FileCheck,
  Heart,
  Volume2,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';

const MUSIC_GENRES = [
  'Cinematic Pop',
  'Acoustic Folk Ballad',
  'Orchestral Cinematic',
  'Modern R&B / Soul',
  'Indie Acoustic',
  'Epic Rock Ballad',
  'Classical Piano & Strings',
  'Traditional / Cultural Fusion',
];

const MOODS = [
  'Heartwarming & Emotional',
  'Romantic & Intimate',
  'Uplifting & Celebratory',
  'Nostalgic & Reflective',
  'Epic & Dramatic',
  'Playful & Joyous',
];

const POPULAR_LANGUAGES = [
  'English',
  'Urdu',
  'Hindi',
  'Spanish',
  'Arabic',
  'French',
  'Punjabi',
  'German',
  'Italian',
  'Portuguese',
  'Mandarin Chinese',
  'Russian',
  'Japanese',
  'Korean',
  'Turkish',
  'Bilingual (English + Urdu)',
  'Bilingual (English + Spanish)',
  'Bilingual (English + Hindi)',
  'Bilingual (English + French)',
  'Bilingual (English + Arabic)',
];

const ALL_WORLD_LANGUAGES = [
  'Afrikaans',
  'Albanian',
  'Amharic',
  'Arabic',
  'Armenian',
  'Assamese',
  'Azerbaijani',
  'Basque',
  'Belarusian',
  'Bengali',
  'Bosnian',
  'Bulgarian',
  'Burmese',
  'Catalan',
  'Cebuano',
  'Chichewa',
  'Chinese (Cantonese)',
  'Chinese (Mandarin)',
  'Corsican',
  'Croatian',
  'Czech',
  'Danish',
  'Dari',
  'Dutch',
  'English',
  'Esperanto',
  'Estonian',
  'Filipino / Tagalog',
  'Finnish',
  'French',
  'Galician',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Haitian Creole',
  'Hausa',
  'Hawaiian',
  'Hebrew',
  'Hindi',
  'Hmong',
  'Hungarian',
  'Icelandic',
  'Igbo',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Javanese',
  'Kannada',
  'Kazakh',
  'Khmer',
  'Kinyarwanda',
  'Korean',
  'Kurdish (Kurmanji / Sorani)',
  'Kyrgyz',
  'Lao',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Luxembourgish',
  'Macedonian',
  'Malagasy',
  'Malay',
  'Malayalam',
  'Maltese',
  'Maori',
  'Marathi',
  'Mongolian',
  'Nepali',
  'Norwegian',
  'Odia (Oriya)',
  'Pashto',
  'Persian / Farsi',
  'Polish',
  'Portuguese',
  'Punjabi (Gurmukhi / Shahmukhi)',
  'Romanian',
  'Russian',
  'Samoan',
  'Scots Gaelic',
  'Serbian',
  'Sesotho',
  'Shona',
  'Sindhi',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Somali',
  'Spanish',
  'Sundanese',
  'Swahili',
  'Swedish',
  'Tajik',
  'Tamil',
  'Tatar',
  'Telugu',
  'Thai',
  'Tigrinya',
  'Turkish',
  'Turkmen',
  'Ukrainian',
  'Urdu',
  'Uyghur',
  'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
  'Yiddish',
  'Yoruba',
  'Zulu',
  'Other / Custom Language',
];

export const OrderWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCustomerAuthenticated } = useAuth();

  if (!isCustomerAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  const musicService = SERVICES_CATALOG.find((s) => s.slug === 'music') || SERVICES_CATALOG[0];
  const initialPackageId = searchParams.get('package') || 'pkg-cinematic-song';

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Package & Add-ons
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
  const [fastDeliverySelected, setFastDeliverySelected] = useState(false);
  const [extraRevisionsCount, setExtraRevisionsCount] = useState(0);
  const [stemsSelected, setStemsSelected] = useState(false);

  // Step 2 State: Song Brief
  const [brief, setBrief] = useState({
    occasion: 'wedding',
    customOccasion: '',
    recipientName: '',
    pronunciationNotes: '',
    relationship: 'Spouse / Partner',
    storyDetails: '',
    mustIncludeWords: '',
    avoidWords: '',
    genre: 'Cinematic Pop',
    mood: 'Romantic & Intimate',
    vocalPreference: 'duet' as 'male' | 'female' | 'duet' | 'no_preference',
    songLanguage: 'English',
    eventDate: '',
  });

  // Step 3 State: Customer & Checkout
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    agreedToTerms: true,
    agreedToRights: true,
    optInMarketing: true,
  });

  // Step 3 Payment State
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    exp: '12/28',
    cvc: '888',
    zip: '90210',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Step 4 State: Final Order confirmation
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    totalCents: number;
    packageName: string;
    deliveryDate: string;
  } | null>(null);

  // Pre-fill customer details from profile if available
  useEffect(() => {
    apiFetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setCustomer((prev) => ({
            ...prev,
            name: prev.name || data.user.name || '',
            email: prev.email || data.user.email || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  const selectedPackage =
    musicService.packages.find((p) => p.id === selectedPackageId) || musicService.packages[1];

  // Pricing Calculation
  const basePriceCents = selectedPackage.priceCents;
  const fastDeliveryPriceCents = fastDeliverySelected ? 900 : 0;
  const extraRevisionsPriceCents = extraRevisionsCount * 1000;
  const stemsPriceCents = stemsSelected ? 1500 : 0;
  const subtotalCents =
    basePriceCents + fastDeliveryPriceCents + extraRevisionsPriceCents + stemsPriceCents;
  const taxCents = 0; // Tax included
  const totalCents = subtotalCents + taxCents;

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 2 Validation -> Proceed to Step 3 (Review & Checkout)
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = musicBriefSchema.safeParse({
      occasion: brief.occasion,
      customOccasion: brief.customOccasion || undefined,
      recipientName: brief.recipientName,
      pronunciationNotes: brief.pronunciationNotes || undefined,
      relationship: brief.relationship || undefined,
      storyDetails: brief.storyDetails,
      mustIncludeWords: brief.mustIncludeWords || undefined,
      avoidWords: brief.avoidWords || undefined,
      genre: brief.genre,
      mood: brief.mood,
      vocalPreference: brief.vocalPreference,
      songLanguage: brief.songLanguage,
      eventDate: brief.eventDate || undefined,
    });

    if (!validation.success) {
      setErrorMessage(validation.error.errors[0]?.message || 'Please complete required brief fields.');
      return;
    }

    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 3: Submit Order and Process Payment in One Click
  const handleFinalCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    // Validate patron details
    const customerValidation = orderCustomerInfoSchema.safeParse({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || undefined,
      agreedToTerms: customer.agreedToTerms,
      agreedToRights: customer.agreedToRights,
      optInMarketing: customer.optInMarketing,
    });

    if (!customerValidation.success) {
      setErrorMessage(customerValidation.error.errors[0]?.message || 'Please provide your name and a valid email for song delivery.');
      setIsProcessing(false);
      return;
    }

    const addonsList: { addonId: string; name: string; priceCents: number }[] = [];
    if (fastDeliverySelected) {
      addonsList.push({ addonId: 'fast_delivery', name: 'Fast Track 48-Hour Delivery', priceCents: 900 });
    }
    if (stemsSelected) {
      addonsList.push({ addonId: 'stems', name: 'Multitrack Audio Stems', priceCents: 1500 });
    }

    const payload = {
      serviceSlug: 'music',
      packageId: selectedPackage.id,
      item: {
        packageId: selectedPackage.id,
        packageName: selectedPackage.name.en,
        priceCents: selectedPackage.priceCents,
        fastDelivery: fastDeliverySelected,
        fastDeliveryPriceCents,
        additionalRevisionsCount: extraRevisionsCount,
        additionalRevisionUnitPriceCents: 1000,
        addons: addonsList,
      },
      brief: {
        ...brief,
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        agreedToTerms: customer.agreedToTerms,
        agreedToRights: customer.agreedToRights,
      },
    };

    try {
      // 1. Create order draft
      const response = await apiFetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.orderNumber) {
        throw new Error(data.error || 'Failed to create order draft on the server');
      }

      const realOrderNumber = data.orderNumber;

      // 2. Submit the order to move status from 'draft' to 'submitted'
      const submitResponse = await apiFetch(`/api/orders/${realOrderNumber}/submit`, {
        method: 'POST',
      });

      const submitData = await submitResponse.json();
      if (!submitResponse.ok || !submitData.success) {
        throw new Error(submitData.error || 'Failed to submit order');
      }

      // Calculate estimated delivery date
      const days = fastDeliverySelected ? selectedPackage.fastDeliveryDays : selectedPackage.deliveryDays;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      const deliveryDateStr = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Save to localStorage for demo Client Portal reflection!
      const existingOrders = JSON.parse(localStorage.getItem('lp_orders') || '[]');
      const newOrderRecord = {
        publicNumber: realOrderNumber,
        packageName: selectedPackage.name.en,
        recipientName: brief.recipientName,
        genre: brief.genre,
        mood: brief.mood,
        story: brief.storyDetails,
        totalCents,
        paymentStatus: 'paid',
        fulfillmentStatus: 'SUBMITTED',
        createdAt: new Date().toISOString(),
        estimatedDeliveryDate: deliveryDateStr,
      };
      existingOrders.unshift(newOrderRecord);
      localStorage.setItem('lp_orders', JSON.stringify(existingOrders));

      setConfirmedOrder({
        orderNumber: realOrderNumber,
        totalCents,
        packageName: selectedPackage.name.en,
        deliveryDate: deliveryDateStr,
      });

      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Step Header */}
      <section className="bg-[#0D0D0D] border-b border-[#2A2A2A] py-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-poppins text-[#B5B5B5] uppercase tracking-wider mb-2">
                <Music className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Custom Music Studio Production Desk</span>
              </div>
              <h1 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                COMMISSION YOUR PERSONAL SONG
              </h1>
            </div>

            {/* Stepper Dots (Streamlined 3-step flow to minimize clicks) */}
            {currentStep < 4 && (
              <div className="flex items-center gap-2 sm:gap-4">
                {[
                  { step: 1, label: '1. Package' },
                  { step: 2, label: '2. Story Brief' },
                  { step: 3, label: '3. Instant Checkout' },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-oswald text-xs font-bold transition-all ${
                        currentStep === s.step
                          ? 'bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                          : currentStep > s.step
                          ? 'bg-white text-black'
                          : 'bg-[#1c1c1c] text-[#777] border border-[#2A2A2A]'
                      }`}
                    >
                      {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </div>
                    <span
                      className={`hidden md:inline font-poppins text-xs uppercase tracking-wider ${
                        currentStep === s.step ? 'text-white font-semibold' : 'text-[#777]'
                      }`}
                    >
                      {s.label}
                    </span>
                    {s.step < 3 && <div className="hidden sm:block w-4 h-[1px] bg-[#2A2A2A]" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Step Form Body (8 cols) */}
          <div className={`${currentStep === 4 ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
            {/* STEP 1: PACKAGE & ADD-ONS */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-oswald text-xl uppercase font-bold text-white tracking-wider mb-2">
                    1. Select Your Production Tier
                  </h2>
                  <p className="font-raleway text-xs text-[#B5B5B5]">
                    All tiers include original composition, broadcast-grade vocals, and personal rights.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {musicService.packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-5 rounded-sm border cursor-pointer transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-[#181818] border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.2)]'
                            : 'bg-[#141414] border-[#2A2A2A] hover:border-white/60'
                        }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute -top-2.5 right-3 bg-[#E50914] text-white text-[9px] font-oswald uppercase tracking-wider px-2 py-0.5 rounded-sm">
                            Popular
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-oswald text-lg uppercase font-bold text-white">
                              {pkg.name.en}
                            </h3>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#E50914] bg-[#E50914]' : 'border-[#444]'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </div>

                          <div className="font-oswald text-3xl font-bold text-white mb-2">
                            ${(pkg.priceCents / 100).toFixed(0)}
                          </div>

                          <p className="font-raleway text-[11px] text-[#B5B5B5] leading-relaxed mb-4 min-h-[30px]">
                            {pkg.tagline?.en}
                          </p>

                          <div className="space-y-1.5 text-[11px] font-raleway text-white/80 border-t border-[#2A2A2A] pt-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#B48A3C]" />
                              <span>{pkg.deliveryDays} Days Standard Delivery</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-[#E50914]" />
                              <span>{pkg.includedRevisions} Revision Round Included</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add-ons selection */}
                <div className="pt-6 border-t border-[#2A2A2A]">
                  <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider mb-4">
                    Optional Enhancements
                  </h3>

                  <div className="space-y-3">
                    {/* Fast delivery */}
                    <div
                      onClick={() => setFastDeliverySelected(!fastDeliverySelected)}
                      className={`p-4 rounded-sm border cursor-pointer flex items-center justify-between transition-all ${
                        fastDeliverySelected
                          ? 'bg-[#181818] border-[#E50914]'
                          : 'bg-[#141414] border-[#2A2A2A] hover:border-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                            fastDeliverySelected ? 'bg-[#E50914] border-[#E50914]' : 'border-[#444]'
                          }`}
                        >
                          {fastDeliverySelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-oswald text-sm uppercase font-bold text-white">
                            Fast Track 48-Hour Priority Delivery (+ $9)
                          </h4>
                          <p className="font-raleway text-xs text-[#B5B5B5]">
                            Accelerated studio queue with audio engineers working overtime.
                          </p>
                        </div>
                      </div>
                      <span className="font-oswald text-base font-bold text-[#E50914]">$9</span>
                    </div>

                    {/* Extra revision with clear Price Display */}
                    <div className={`p-4 rounded-sm border transition-all flex items-center justify-between ${
                      extraRevisionsCount > 0
                        ? 'bg-[#181818] border-[#E50914]'
                        : 'bg-[#141414] border-[#2A2A2A] hover:border-white/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-sm border flex items-center justify-center text-xs ${
                          extraRevisionsCount > 0
                            ? 'bg-[#E50914] border-[#E50914] text-white'
                            : 'border-[#444] bg-[#1c1c1c] text-[#B5B5B5]'
                        }`}>
                          {extraRevisionsCount > 0 ? <Check className="w-3 h-3 text-white" /> : '+'}
                        </div>
                        <div>
                          <h4 className="font-oswald text-sm uppercase font-bold text-white">
                            Additional Song Revisions ($10 / each)
                          </h4>
                          <p className="font-raleway text-xs text-[#B5B5B5]">
                            Extra safety buffer for lyrical or musical adjustments.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-[#0D0D0D] p-1 rounded-sm border border-[#2A2A2A]">
                          <button
                            type="button"
                            onClick={() => setExtraRevisionsCount(Math.max(0, extraRevisionsCount - 1))}
                            className="w-6 h-6 bg-[#222] hover:bg-[#333] text-white rounded-sm flex items-center justify-center font-bold text-xs transition-colors"
                            aria-label="Decrease revisions"
                          >
                            -
                          </button>
                          <span className="font-oswald text-xs px-2 text-white min-w-[20px] text-center">
                            {extraRevisionsCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setExtraRevisionsCount(extraRevisionsCount + 1)}
                            className="w-6 h-6 bg-[#222] hover:bg-[#333] text-white rounded-sm flex items-center justify-center font-bold text-xs transition-colors"
                            aria-label="Increase revisions"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right min-w-[55px]">
                          <span className="font-oswald text-base font-bold text-[#E50914] block">
                            {extraRevisionsCount > 0 ? `+$${extraRevisionsCount * 10}` : '$10'}
                          </span>
                          <span className="text-[10px] font-poppins text-[#777] block">
                            {extraRevisionsCount > 0 ? `($10 ea)` : 'each'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stems */}
                    <div
                      onClick={() => setStemsSelected(!stemsSelected)}
                      className={`p-4 rounded-sm border cursor-pointer flex items-center justify-between transition-all ${
                        stemsSelected
                          ? 'bg-[#181818] border-[#E50914]'
                          : 'bg-[#141414] border-[#2A2A2A] hover:border-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                            stemsSelected ? 'bg-[#E50914] border-[#E50914]' : 'border-[#444]'
                          }`}
                        >
                          {stemsSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-oswald text-sm uppercase font-bold text-white">
                            Multitrack Audio Stems Pack (+ $15)
                          </h4>
                          <p className="font-raleway text-xs text-[#B5B5B5]">
                            Individual raw audio tracks (Vocals, Piano, Strings, Drums) for remixing.
                          </p>
                        </div>
                      </div>
                      <span className="font-oswald text-base font-bold text-[#E50914]">$15</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToStep2}
                  className="btn-cinematic-red w-full flex items-center justify-center gap-2 text-sm"
                >
                  <span>Continue to Step 2: Story Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: CREATIVE STORY BRIEF */}
            {currentStep === 2 && (
              <form onSubmit={handleProceedToStep3} className="space-y-6">
                <div>
                  <h2 className="font-oswald text-xl uppercase font-bold text-white tracking-wider mb-2">
                    2. Story & Emotional Brief
                  </h2>
                  <p className="font-raleway text-xs text-[#B5B5B5]">
                    Tell us who this song is for and the real memories, inside jokes, and emotions to weave into the melody.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Celebration Occasion *
                    </label>
                    <select
                      value={brief.occasion}
                      onChange={(e) => setBrief({ ...brief, occasion: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    >
                      {MUSIC_OCCASIONS.map((occ) => (
                        <option key={occ.id} value={occ.slug}>
                          {occ.name.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Recipient / Protagonist Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brief.recipientName}
                      onChange={(e) => setBrief({ ...brief, recipientName: e.target.value })}
                      placeholder="e.g. Layla & Zayd / Sarah Vance"
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Musical Style / Genre *
                    </label>
                    <select
                      value={brief.genre}
                      onChange={(e) => setBrief({ ...brief, genre: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    >
                      {MUSIC_GENRES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Song Mood & Energy *
                    </label>
                    <select
                      value={brief.mood}
                      onChange={(e) => setBrief({ ...brief, mood: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    >
                      {MOODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Vocalist Preference *
                    </label>
                    <select
                      value={brief.vocalPreference}
                      onChange={(e: any) => setBrief({ ...brief, vocalPreference: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    >
                      <option value="male">Male Lead Vocalist</option>
                      <option value="female">Female Lead Vocalist</option>
                      <option value="duet">Duet (Male & Female Harmony)</option>
                      <option value="no_preference">Producers Choice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Song Language (All World Languages) *
                    </label>
                    <select
                      value={brief.songLanguage}
                      onChange={(e) => setBrief({ ...brief, songLanguage: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    >
                      <optgroup label="Popular Languages">
                        {POPULAR_LANGUAGES.map((l) => (
                          <option key={`pop-${l}`} value={l}>
                            {l}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="All World Languages (A - Z)">
                        {ALL_WORLD_LANGUAGES.map((l) => (
                          <option key={`all-${l}`} value={l}>
                            {l}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                    Your Memories, Anecdotes & Key Story Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={brief.storyDetails}
                    onChange={(e) => setBrief({ ...brief, storyDetails: e.target.value })}
                    placeholder="Where did you meet? Favorite memories, quirky nicknames, milestones, struggles overcome, and the feelings you want to leave them with..."
                    className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                  />
                  <span className="text-[10px] text-[#777] font-poppins mt-1 block">
                    Minimum 15 characters. The more specific and personal, the more unforgettable your song will be.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Must-Include Words or Phrases
                    </label>
                    <input
                      type="text"
                      value={brief.mustIncludeWords}
                      onChange={(e) => setBrief({ ...brief, mustIncludeWords: e.target.value })}
                      placeholder="e.g. Always & Forever, Lake Como, 2018"
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Words or Topics to Avoid
                    </label>
                    <input
                      type="text"
                      value={brief.avoidWords}
                      onChange={(e) => setBrief({ ...brief, avoidWords: e.target.value })}
                      placeholder="e.g. Exes, overly cliché phrases"
                      className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-cinematic w-1/3 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="btn-cinematic-red w-2/3 flex items-center justify-center gap-2 py-3"
                  >
                    <span>Proceed to Final Step: Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: UNIFIED CONTACT & INSTANT CHECKOUT (Single-Step to minimize clicks) */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalCheckout} className="space-y-6">
                <div>
                  <h2 className="font-oswald text-xl uppercase font-bold text-white tracking-wider mb-2">
                    3. Contact & Instant Checkout
                  </h2>
                  <p className="font-raleway text-xs text-[#B5B5B5]">
                    Enter your delivery contact details and authorize production in a single secure step.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Brief Summary Excerpt */}
                <div className="bg-[#141414] border border-[#2A2A2A] p-4 rounded-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                    <span className="font-oswald text-sm uppercase text-white font-bold">
                      Song Concept Blueprint
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-poppins text-[#E50914] hover:underline"
                    >
                      Edit Brief
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-raleway">
                    <div>
                      <span className="block text-[10px] uppercase font-poppins text-[#777]">Recipient</span>
                      <strong className="text-white truncate block">{brief.recipientName}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-poppins text-[#777]">Genre</span>
                      <strong className="text-white truncate block">{brief.genre}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-poppins text-[#777]">Language</span>
                      <strong className="text-white truncate block">{brief.songLanguage}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-poppins text-[#777]">Vocals</span>
                      <strong className="text-white capitalize truncate block">{brief.vocalPreference}</strong>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-[#141414] border border-[#2A2A2A] p-5 rounded-sm space-y-4">
                  <h3 className="font-oswald text-sm uppercase font-bold text-white tracking-wider border-b border-[#2A2A2A] pb-2">
                    Patron Delivery Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                        Your Email (For Song Master Delivery) *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="elena@example.com"
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-poppins uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                      Phone / WhatsApp Number (For Production Notifications)
                    </label>
                    <input
                      type="text"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                {/* Encrypted Payment Card Details */}
                <div className="bg-[#141414] border border-[#2A2A2A] p-5 rounded-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#E50914]" />
                      <span className="font-oswald text-sm uppercase text-white font-bold">
                        Encrypted Card Payment (Stripe Protected)
                      </span>
                    </div>
                    <span className="text-[10px] font-poppins text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 256-Bit SSL
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-poppins uppercase text-[#B5B5B5] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-poppins uppercase text-[#B5B5B5] mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.exp}
                        onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-poppins uppercase text-[#B5B5B5] mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-poppins uppercase text-[#B5B5B5] mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={cardData.zip}
                        onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>
                </div>

                {/* Single Combined Agreement Checkbox (Pre-checked to eliminate unnecessary clicks) */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={customer.agreedToTerms && customer.agreedToRights}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCustomer({ ...customer, agreedToTerms: checked, agreedToRights: checked });
                      }}
                      className="mt-0.5 w-4 h-4 rounded bg-[#141414] border-[#2A2A2A] text-[#E50914] focus:ring-[#E50914]"
                    />
                    <span className="text-xs font-raleway text-[#CCCCCC] leading-relaxed">
                      I agree to the <strong className="text-white">Terms of Production & Delivery</strong> ({selectedPackage.includedRevisions} included revisions) and confirm rights to the stories provided for custom creation.
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-cinematic w-1/3 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-cinematic-red w-2/3 flex items-center justify-center gap-2 py-3"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? 'Authorizing & Queuing Song...'
                        : `Pay $${(totalCents / 100).toFixed(0)} USD & Start Production`}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: ORDER SUCCESS CONFIRMATION */}
            {currentStep === 4 && confirmedOrder && (
              <div className="bg-[#141414] border border-[#2A2A2A] p-8 sm:p-12 rounded-sm shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-[#E50914]/20 border-2 border-[#E50914] text-[#E50914] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(229,9,20,0.4)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#E50914] block mb-2">
                    Production Commission Confirmed
                  </span>
                  <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-white tracking-wide">
                    YOUR SONG IS ENTERING THE STUDIO
                  </h2>
                </div>

                <div className="p-6 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm text-left space-y-3">
                  <div className="flex justify-between items-center text-xs font-poppins">
                    <span className="text-[#B5B5B5]">Tracking Order Number:</span>
                    <strong className="text-white font-oswald text-sm tracking-wider text-[#E50914]">
                      {confirmedOrder.orderNumber}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs font-poppins">
                    <span className="text-[#B5B5B5]">Production Tier:</span>
                    <strong className="text-white">{confirmedOrder.packageName}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs font-poppins">
                    <span className="text-[#B5B5B5]">Total Paid:</span>
                    <strong className="text-white">${(confirmedOrder.totalCents / 100).toFixed(0)} USD</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs font-poppins">
                    <span className="text-[#B5B5B5]">Estimated Delivery Date:</span>
                    <strong className="text-[#B48A3C]">{confirmedOrder.deliveryDate}</strong>
                  </div>
                </div>

                <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed max-w-lg mx-auto">
                  A confirmation dispatch and your private Client Portal credentials have been transmitted to <strong>{customer.email}</strong>. Our senior lyricists and composers are currently reviewing your brief.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link
                    to="/portal"
                    className="btn-cinematic-red w-full sm:w-auto"
                  >
                    ACCESS CLIENT PORTAL & TRACK PRODUCTION
                  </Link>
                  <Link
                    to="/"
                    className="btn-cinematic w-full sm:w-auto"
                  >
                    RETURN TO HOME
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Order Summary Sidebar (4 cols) */}
          {currentStep < 4 && (
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm space-y-6">
                <div>
                  <span className="text-[10px] font-poppins uppercase tracking-widest text-[#E50914] block mb-1">
                    Order Summary
                  </span>
                  <h3 className="font-oswald text-xl uppercase font-bold text-white">
                    {selectedPackage.name.en}
                  </h3>
                </div>

                {/* Line items */}
                <div className="space-y-3 text-xs font-raleway border-t border-[#2A2A2A] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#B5B5B5]">Base Package:</span>
                    <span className="text-white font-medium">${(basePriceCents / 100).toFixed(0)}</span>
                  </div>

                  {fastDeliverySelected && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>48-Hour Rush Delivery:</span>
                      <span>+$9</span>
                    </div>
                  )}

                  {extraRevisionsCount > 0 && (
                    <div className="flex items-center justify-between text-[#B48A3C]">
                      <span>{extraRevisionsCount} Extra Revision{extraRevisionsCount > 1 ? 's' : ''}:</span>
                      <span>+${extraRevisionsCount * 10}</span>
                    </div>
                  )}

                  {stemsSelected && (
                    <div className="flex items-center justify-between text-[#B48A3C]">
                      <span>Multitrack Audio Stems:</span>
                      <span>+$15</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#777]">
                    <span>Studio Tax / VAT:</span>
                    <span>$0 (Included)</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#2A2A2A] pt-4 flex items-baseline justify-between">
                  <div>
                    <span className="font-oswald text-xs uppercase tracking-wider text-[#B5B5B5] block">
                      Total Investment
                    </span>
                    <span className="text-[10px] text-[#777] font-poppins">All Inclusive Flat Rate</span>
                  </div>
                  <span className="font-oswald text-3xl font-bold text-white">
                    ${(totalCents / 100).toFixed(0)}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="bg-[#0D0D0D] p-4 rounded-sm border border-[#2A2A2A] space-y-2 text-[11px] font-raleway text-[#B5B5B5]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>100% Satisfaction & Revision Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#B48A3C]" />
                    <span>256-Bit SSL Encrypted Transaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-white" />
                    <span>Written Personal / Sharing License Included</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

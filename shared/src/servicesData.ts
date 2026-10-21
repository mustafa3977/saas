import {
  ServiceDefinition,
  StatItem,
  AwardItem,
  TestimonialItem,
  BlogPost,
} from './types.js';

export const MUSIC_OCCASIONS = [
  { id: 'custom', slug: 'custom', name: { en: 'Custom / Unique Occasion' }, isPopular: true },
  { id: 'birthday', slug: 'birthday', name: { en: 'Birthday Celebration' }, isPopular: true },
  { id: 'wedding', slug: 'wedding', name: { en: 'Wedding & First Dance' }, isPopular: true },
  { id: 'anniversary', slug: 'anniversary', name: { en: 'Anniversary & Milestone' }, isPopular: true },
  { id: 'promotional', slug: 'promotional', name: { en: 'Promotional / Brand Theme' } },
  { id: 'tribute', slug: 'tribute', name: { en: 'Tribute & In Memoriam' } },
  { id: 'romantic-gift', slug: 'romantic-gift', name: { en: 'Romantic Gift / Proposal' }, isPopular: true },
  { id: 'other', slug: 'other', name: { en: 'Other Special Moment' } },
];

export const MUSIC_ADDONS = [
  {
    id: 'fast_delivery',
    name: { en: 'Fast Track Delivery' },
    description: { en: 'Expedited production queue with prioritized senior audio engineers' },
    priceCents: 900, // $9
    type: 'fast_delivery' as const,
    enabled: true,
  },
  {
    id: 'extra_revision',
    name: { en: 'Additional Minor Revision' },
    description: { en: 'One extra round of lyrical or instrumental fine-tuning' },
    priceCents: 1000, // $10
    type: 'extra_revision' as const,
    enabled: true,
  },
];

export const SERVICES_CATALOG: ServiceDefinition[] = [
  {
    id: 'srv-music',
    slug: 'music',
    title: { en: 'Music & Personalized Songs' },
    tagline: { en: 'Turn Your Story Into an Unforgettable Masterpiece' },
    shortDescription: {
      en: 'Custom studio-produced songs crafted around your memories, stories, and emotions.',
    },
    fullDescription: {
      en: 'Every legend deserves a soundtrack. Legacy Pixels composes, records, and masters original, broadcast-grade songs tailored to your personal moments or brand ethos. From heartfelt acoustic ballads to modern pop anthems and cinematic orchestral suites, our producers turn your real memories into timeless musical legacies.',
    },
    iconName: 'Music',
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: true,
    startingPriceCents: 2900,
    occasions: MUSIC_OCCASIONS,
    addons: MUSIC_ADDONS,
    whatIsIncluded: [
      '100% custom melody, arrangement & studio mix',
      'Original lyrics tailored strictly to your brief and anecdotes',
      'Studio vocals (Male, Female, or Duet options)',
      'Radio-ready MP3 & WAV master files (package dependent)',
      'Commercial-grade cover artwork included on signature tiers',
      'Full personal listening and sharing rights',
    ],
    processSteps: [
      {
        step: 1,
        title: { en: 'Share Your Story' },
        description: {
          en: 'Select your package and tell us your memories, inside jokes, musical genre, and vocal preference.',
        },
      },
      {
        step: 2,
        title: { en: 'Composition & Lyrics' },
        description: {
          en: 'Our lyricists and composers draft the song structure, ensuring your emotional touchpoints shine.',
        },
      },
      {
        step: 3,
        title: { en: 'Studio Recording & Mastering' },
        description: {
          en: 'Lead vocalists and instrumentalists perform, followed by professional mixing and mastering.',
        },
      },
      {
        step: 4,
        title: { en: 'Delivery & Revisions' },
        description: {
          en: 'Download your pristine audio files directly from your secure client portal, with revisions included.',
        },
      },
    ],
    packages: [
      {
        id: 'pkg-personal-song',
        slug: 'personal-song',
        name: { en: 'Personal Song' },
        tagline: { en: 'Ideal for intimate gifts and personal celebrations' },
        priceCents: 2900, // $29
        deliveryDays: 3,
        fastDeliveryDays: 2,
        includedRevisions: 1,
        isPopular: false,
        checkoutEnabled: true,
        deliverables: [
          'One 2–3 minute custom song',
          'High-resolution MP3 audio file',
          'Full printed lyrics sheet (PDF)',
          '1 minor revision included',
          '3 business days delivery',
        ],
        features: [
          'Custom melody & instrumentation',
          'Single vocal track',
          'Standard stereo master',
        ],
      },
      {
        id: 'pkg-signature-song',
        slug: 'signature-song',
        name: { en: 'Signature Song' },
        tagline: { en: 'Our most popular tier: complete studio polish & WAV' },
        priceCents: 5000, // $50
        deliveryDays: 3,
        fastDeliveryDays: 2,
        includedRevisions: 2,
        isPopular: true,
        checkoutEnabled: true,
        deliverables: [
          'One 3–4 minute custom song',
          'Prior lyrics approval draft',
          'Studio Master WAV (24-bit) + MP3',
          'Custom digital cover artwork',
          '2 minor revisions included',
          '3 business days delivery',
        ],
        features: [
          'Multi-layered vocal harmonies',
          'Full instrumental arrangement',
          'Radio broadcast mastering',
          'Personalized digital album sleeve',
        ],
      },
      {
        id: 'pkg-song-memory-video',
        slug: 'song-memory-video',
        name: { en: 'Song + Memory Video' },
        tagline: { en: 'Signature song synchronized with a cinematic photo montage' },
        priceCents: 10000, // $100
        deliveryDays: 5,
        fastDeliveryDays: 3,
        includedRevisions: 2,
        isPopular: false,
        checkoutEnabled: true,
        deliverables: [
          'Everything in Signature Song package',
          'Synchronized 1080p photo slideshow montage',
          'Up to 20 curated personal photos',
          'Choice of 16:9 widescreen or 9:16 vertical reel',
          '2 minor revisions included',
          '5 business days delivery',
        ],
        features: [
          'Dynamic cinematic transitions',
          'Subtle Ken Burns camera motion',
          'Rendered in crisp 1080p MP4',
        ],
      },
      {
        id: 'pkg-video-song',
        slug: 'video-song',
        name: { en: 'Video Song' },
        tagline: { en: 'Fully edited music video with dynamic visual footage' },
        priceCents: 12000, // $120
        deliveryDays: 5,
        fastDeliveryDays: 3,
        includedRevisions: 2,
        isPopular: false,
        checkoutEnabled: true,
        deliverables: [
          'Signature Song audio production included',
          'Edited cinematic music video (up to 3 min)',
          'Color graded narrative visual sequence',
          'Synchronized stylized lyrics overlay option',
          '2 minor revisions included',
          '5 business days delivery',
        ],
        features: [
          'Curated cinematic stock & submitted clips',
          'Professional color grading in DaVinci',
          'Exported in 1080p 30fps MP4',
        ],
      },
      {
        id: 'pkg-complete-album',
        slug: 'complete-album',
        name: { en: 'Complete Album' },
        tagline: { en: '5 original tracks telling your complete life story or concept' },
        priceCents: 20000, // $200
        deliveryDays: 10,
        fastDeliveryDays: 7,
        includedRevisions: 1,
        isPopular: false,
        checkoutEnabled: true,
        deliverables: [
          '5 full original songs (2–4 minutes each)',
          'MP3 + Studio Master WAV for all 5 tracks',
          'Lyrics approval stage for every track',
          'Comprehensive album cover & concept design',
          '1 album-wide revision round included',
          '10 business days delivery',
        ],
        features: [
          'Unified thematic musical motifs',
          'Dedicated senior music director',
          'Complete cohesive digital packaging',
        ],
      },
    ],
    samples: [
      {
        title: 'Eternal Vow (Wedding Anthem)',
        category: 'Acoustic / Romantic',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '3:24',
      },
      {
        title: 'Golden Jubilee (Family Tribute)',
        category: 'Cinematic Orchestral',
        thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '3:10',
      },
      {
        title: 'Neon Horizon (Brand Sonic Anthem)',
        category: 'Modern Indie Pop',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '2:45',
      },
    ],
    faq: [
      {
        question: { en: 'How do you turn my personal story into a song?' },
        answer: {
          en: 'You tell us the key memories, emotions, names, and milestones in your brief. Our songwriters structure these into rhyming verses, a soaring chorus, and an emotional bridge, capturing your voice authentically.',
        },
      },
      {
        question: { en: 'What languages can the song be composed in?' },
        answer: {
          en: 'We currently support English, Urdu, Punjabi, Arabic, and Spanish natively. Vocalists and lyricists fluent in your chosen tongue will be assigned.',
        },
      },
      {
        question: { en: 'How do revisions work?' },
        answer: {
          en: 'Depending on your package, you receive 1 or 2 minor revisions free of charge (e.g. lyric pronunciation adjustment, volume balance, or vocal eq). Additional revision rounds can be added for $10.',
        },
      },
      {
        question: { en: 'What rights do I have to the delivered music?' },
        answer: {
          en: 'You receive full non-exclusive rights for personal listening, gifting, wedding playback, social media sharing, and family archiving.',
        },
      },
    ],
    briefFields: [
      {
        id: 'recipientName',
        label: { en: 'Who is this song for?' },
        type: 'text',
        placeholder: { en: 'e.g. My spouse Sarah, my father Robert, our founders' },
        required: true,
      },
      {
        id: 'storyDetails',
        label: { en: 'Tell us your story & memories' },
        type: 'textarea',
        placeholder: { en: 'Describe how you met, favorite memories, funny quirks, milestones, and the core message you want conveyed...' },
        required: true,
      },
      {
        id: 'genre',
        label: { en: 'Musical Genre / Style' },
        type: 'select',
        required: true,
        options: [
          { value: 'acoustic_ballad', label: { en: 'Acoustic / Warm Guitar Ballad' } },
          { value: 'cinematic_piano', label: { en: 'Cinematic Piano & Strings' } },
          { value: 'modern_pop', label: { en: 'Modern Upbeat Pop' } },
          { value: 'lofi_rnb', label: { en: 'Smooth R&B / Soul' } },
          { value: 'rock_anthemic', label: { en: 'Anthemic Indie Rock' } },
          { value: 'traditional_fusion', label: { en: 'Eastern Classical / Fusion' } },
        ],
      },
      {
        id: 'mood',
        label: { en: 'Overall Mood & Emotion' },
        type: 'select',
        required: true,
        options: [
          { value: 'heartfelt_emotional', label: { en: 'Heartfelt, Tearjerker & Emotional' } },
          { value: 'joyful_celebratory', label: { en: 'Joyful, Uplifting & Celebratory' } },
          { value: 'romantic_tender', label: { en: 'Romantic, Passionate & Tender' } },
          { value: 'inspiring_triumphant', label: { en: 'Inspiring, Grand & Triumphant' } },
        ],
      },
    ],
  },
  {
    id: 'srv-movies',
    slug: 'movies',
    title: { en: 'Movies & Cinema Production' },
    tagline: { en: 'Narrative Motion Pictures That Command the Screen' },
    shortDescription: {
      en: 'Feature films, short narratives, documentaries, and cinematic episodic productions.',
    },
    fullDescription: {
      en: 'From script development and pre-visualization to on-set principal photography and post-production, Legacy Pixels delivers filmic grandeur with high dynamic range cinematography, disciplined lighting, and compelling dramatic pacing.',
    },
    iconName: 'Film',
    heroImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 150000,
    addons: [],
    whatIsIncluded: [
      'Pre-production: Script breakdown, storyboard & location scouting',
      'Cinema camera package (Arri / RED sensor pipeline in 4K/6K)',
      'Direction, production crew & lighting technicians',
      'High-fidelity sound recording & audio design',
      'Full assembly cut, color grading, and DCI export',
    ],
    processSteps: [
      { step: 1, title: { en: 'Creative Discovery' }, description: { en: 'Reviewing screenplay, treatment, mood boards, and casting requirements.' } },
      { step: 2, title: { en: 'Pre-Production' }, description: { en: 'Securing locations, permits, shot lists, and camera rigs.' } },
      { step: 3, title: { en: 'Principal Photography' }, description: { en: 'Executing on-set shooting with cinematic lighting and sound recording.' } },
      { step: 4, title: { en: 'Finishing & Mastering' }, description: { en: 'Editing, color grading, sound design, and festival/theatrical deliverable packages.' } },
    ],
    packages: [
      {
        id: 'pkg-indie-short',
        slug: 'indie-short',
        name: { en: 'Cinematic Short Film' },
        tagline: { en: 'Complete production for 5–15 minute narrative festival pieces' },
        priceCents: 250000,
        deliveryDays: 30,
        fastDeliveryDays: 20,
        includedRevisions: 2,
        checkoutEnabled: false,
        deliverables: ['Full Short Film Master 1080p/4K', 'Trailer (60 sec)', 'Soundtrack & Foley mix', 'Color Master'],
        features: ['Up to 3 shooting days', 'Cinema camera rig', 'Full sound design'],
      },
      {
        id: 'pkg-documentary-feature',
        slug: 'documentary-feature',
        name: { en: 'Documentary Feature' },
        tagline: { en: 'Long-form journalistic & cinematic documentary storytelling' },
        priceCents: 500000,
        deliveryDays: 60,
        fastDeliveryDays: 45,
        includedRevisions: 3,
        checkoutEnabled: false,
        deliverables: ['Feature cut (45-90 min)', 'Festival trailer', 'International clean feed', 'Subtitles'],
        features: ['Multi-camera interviews', 'B-roll cinematography', 'Archival restoration'],
      },
    ],
    samples: [
      {
        title: 'The Silent Horizon',
        category: 'Feature Drama',
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '14:20',
      },
    ],
    faq: [
      {
        question: { en: 'Can Legacy Pixels work with existing screenplays?' },
        answer: { en: 'Yes. We accept completed scripts, screen treatments, or provide script doctoring services.' },
      },
    ],
    briefFields: [
      { id: 'filmType', label: { en: 'Project Type' }, type: 'text', placeholder: { en: 'e.g. Short Film, Documentary, Narrative Series' }, required: true },
      { id: 'projectScope', label: { en: 'Brief overview and timeline' }, type: 'textarea', placeholder: { en: 'Describe the plot, desired locations, and release targets' }, required: true },
    ],
  },
  {
    id: 'srv-vfx',
    slug: 'vfx',
    title: { en: 'Visual Effects (VFX)' },
    tagline: { en: 'Invisible Artistry & Immersive Virtual Realities' },
    shortDescription: {
      en: '3D environment design, photoreal CGI, creature animation, simulation & compositing.',
    },
    fullDescription: {
      en: 'Legacy Pixels pushes technical boundaries in photorealistic visual effects. Whether seamless paint & roto, complex pyrotechnics and liquid simulations, or full Unreal Engine virtual production sets, our VFX supervisors breathe life into the impossible.',
    },
    iconName: 'Sparkles',
    heroImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 50000,
    addons: [],
    whatIsIncluded: [
      '3D matchmove and camera tracking',
      'High-detail digital asset modeling, texturing, and rigging',
      'Procedural particle & dynamic simulations (Houdini)',
      'Deep multi-channel Nuke compositing',
      'Clean plate generation, wire removal & rotoscoping',
    ],
    processSteps: [
      { step: 1, title: { en: 'Shot Breakdown' }, description: { en: 'Analyzing live-action plates, camera logs, and VFX shot sheets.' } },
      { step: 2, title: { en: '3D Tracking & Previz' }, description: { en: 'Solving 3D cameras and blocking cg element placement.' } },
      { step: 3, title: { en: 'Asset Creation & FX' }, description: { en: 'Texturing, shading, lighting, and rendering procedural effects.' } },
      { step: 4, title: { en: 'Final Composite' }, description: { en: 'Harmonizing grain, lens distortion, light wraps, and photoreal integration.' } },
    ],
    packages: [
      {
        id: 'pkg-vfx-shot-pack',
        slug: 'vfx-shot-pack',
        name: { en: 'VFX Shot Suite' },
        tagline: { en: 'Photoreal compositing and environmental enhancements' },
        priceCents: 150000,
        deliveryDays: 14,
        fastDeliveryDays: 10,
        includedRevisions: 2,
        checkoutEnabled: false,
        deliverables: ['10-15 complex composited shots', 'EXR/ProRes 4444 delivery', 'Clean plates'],
        features: ['Multi-pass integration', 'Set extension', 'Simulation effects'],
      },
    ],
    samples: [
      {
        title: 'Cyberpunk Metropolis 2090',
        category: '3D Environment & Matte Painting',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '1:45',
      },
    ],
    faq: [
      {
        question: { en: 'What plate formats do you accept for VFX work?' },
        answer: { en: 'We accept ProRes 4444, Apple ProRes RAW, RED R3D, ARRI ARRIRAW, and image sequences in EXR or DPX.' },
      },
    ],
    briefFields: [
      { id: 'shotCount', label: { en: 'Number of VFX shots' }, type: 'text', placeholder: { en: 'e.g. 8 shots, total 45 seconds of footage' }, required: true },
      { id: 'vfxDescription', label: { en: 'Required VFX elements' }, type: 'textarea', placeholder: { en: 'e.g. Green screen keying, 3D explosion, futuristic building extension...' }, required: true },
    ],
  },
  {
    id: 'srv-editing',
    slug: 'editing',
    title: { en: 'Post-Production & Video Editing' },
    tagline: { en: 'Rhythmic Precision, Narrative Pacing & Master Color' },
    shortDescription: {
      en: 'World-class editorial cuts, pacing, DaVinci Resolve color grading & sound finishing.',
    },
    fullDescription: {
      en: 'The edit is where the story is truly born. Our offline and online editors craft captivating flow, comedic timing, or dramatic suspense. Paired with certified DaVinci Resolve colorists, we grade footage to film-grade luminance and tonal beauty.',
    },
    iconName: 'Scissors',
    heroImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 35000,
    addons: [],
    whatIsIncluded: [
      'Multi-cam synchronization and proxy ingestion',
      'Narrative pacing, sound bites & assembly edit',
      'Professional color grading & shot-to-shot matching',
      'Audio leveling, denoising, and stereo/5.1 mixdown',
      'Multiple aspect ratio renders (16:9, 9:16, 1:1, 4:5)',
    ],
    processSteps: [
      { step: 1, title: { en: 'Footage Ingest' }, description: { en: 'Receiving raw rushes, organizing bins, and creating editing proxies.' } },
      { step: 2, title: { en: 'Rough Cut' }, description: { en: 'Assembly of core story beats, dialogue, and pacing structure.' } },
      { step: 3, title: { en: 'Fine Cut & Color' }, description: { en: 'Color timing, look development, and visual fine-tuning.' } },
      { step: 4, title: { en: 'Audio Polish & Master' }, description: { en: 'Foley, score mixing, dialogue normalization, and final exports.' } },
    ],
    packages: [
      {
        id: 'pkg-commercial-edit',
        slug: 'commercial-edit',
        name: { en: 'Commercial Post Suite' },
        tagline: { en: 'High-energy commercial cut with color grade and audio mix' },
        priceCents: 75000,
        deliveryDays: 7,
        fastDeliveryDays: 4,
        includedRevisions: 2,
        checkoutEnabled: false,
        deliverables: ['Main 60s cut', '30s & 15s cutdowns', 'Social vertical exports', 'Color graded ProRes master'],
        features: ['Sound design & mixing', 'DaVinci color pass', 'Title graphics'],
      },
    ],
    samples: [
      {
        title: 'Velocity Motors Commercial',
        category: 'Commercial Editorial & Color',
        thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '1:00',
      },
    ],
    faq: [
      {
        question: { en: 'What NLE software do you edit in?' },
        answer: { en: 'We primarily edit in Premiere Pro and DaVinci Resolve Studio, with round-tripping for color and sound.' },
      },
    ],
    briefFields: [
      { id: 'footageVolume', label: { en: 'Raw footage volume / duration' }, type: 'text', placeholder: { en: 'e.g. 150GB of 4K drone and Sony FX3 footage' }, required: true },
      { id: 'editBrief', label: { en: 'Style, target duration, and references' }, type: 'textarea', placeholder: { en: 'Describe desired energy, pacing, music vibe, and target platforms...' }, required: true },
    ],
  },
  {
    id: 'srv-branding',
    slug: 'branding',
    title: { en: 'Branding & Identity Design' },
    tagline: { en: 'Visual Identities That Define Industry Leaders' },
    shortDescription: {
      en: 'Complete corporate identity, brand books, typography, icon systems, and motion guidelines.',
    },
    fullDescription: {
      en: 'We craft timeless brand identities that evoke prestige and authority. From minimalist luxury monograms to comprehensive multi-platform design systems, Legacy Pixels ensures your brand leaves an enduring impression in every medium.',
    },
    iconName: 'PenTool',
    heroImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 45000,
    addons: [],
    whatIsIncluded: [
      'Comprehensive brand positioning and visual research',
      'Primary, secondary, and monogram logo variations',
      'Curated typography hierarchy and custom color palettes',
      'Comprehensive brand guidelines manual (PDF)',
      'Vector asset pack (SVG, EPS, AI, PNG, PDF)',
    ],
    processSteps: [
      { step: 1, title: { en: 'Strategic Audit' }, description: { en: 'Analyzing market positioning, competitors, and target demographics.' } },
      { step: 2, title: { en: 'Concept Directions' }, description: { en: 'Presenting 3 distinct visual metaphors and mood boards.' } },
      { step: 3, title: { en: 'Design Refinement' }, description: { en: 'Perfecting geometry, typography pairing, and color harmony.' } },
      { step: 4, title: { en: 'Brand Guidelines & Handoff' }, description: { en: 'Delivering full asset packages, vector formats, and usage manual.' } },
    ],
    packages: [
      {
        id: 'pkg-brand-flagship',
        slug: 'brand-flagship',
        name: { en: 'Complete Brand Identity' },
        tagline: { en: 'End-to-end visual language for emerging and established enterprises' },
        priceCents: 120000,
        deliveryDays: 14,
        fastDeliveryDays: 9,
        includedRevisions: 3,
        checkoutEnabled: false,
        deliverables: ['Vector Logo Suite', '40+ Page Brand Book', 'Typography Licensing Guide', 'Social Kit'],
        features: ['3 Initial concepts', 'Stationery mockups', 'Iconography set'],
      },
    ],
    samples: [
      {
        title: 'Aethelgard Royal Spirits',
        category: 'Luxury Brand Identity',
        thumbnail: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: 'Case Study',
      },
    ],
    faq: [
      {
        question: { en: 'Do you provide full vector files?' },
        answer: { en: 'Yes, all deliverables include print-ready CMYK and screen-ready RGB vector files (AI, EPS, SVG, PDF).' },
      },
    ],
    briefFields: [
      { id: 'brandName', label: { en: 'Brand / Company Name' }, type: 'text', placeholder: { en: 'e.g. Apex Horizon Technologies' }, required: true },
      { id: 'brandValues', label: { en: 'Core brand ethos and market competitors' }, type: 'textarea', placeholder: { en: 'Describe what makes your brand legendary...' }, required: true },
    ],
  },
  {
    id: 'srv-ads-motion-graphics',
    slug: 'ads-motion-graphics',
    title: { en: 'Ads & Motion Graphics' },
    tagline: { en: 'Kinetic Visuals That Stop the Scroll and Drive Action' },
    shortDescription: {
      en: '2D/3D kinetic typography, animated commercial ads, logo reveals & UI interactions.',
    },
    fullDescription: {
      en: 'In an attention-deficit world, motion graphics communicate complex ideas in seconds. We blend design flair, 3D physics, and kinetic pacing to build advertisements that convert viewers into loyal customers.',
    },
    iconName: 'Layers',
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 40000,
    addons: [],
    whatIsIncluded: [
      'Storyboarding and visual style frame development',
      'Custom 2D/3D motion design in After Effects & Cinema 4D',
      'Kinetic typography, logo stingers & animated lower thirds',
      'Dynamic sound design, swooshes, and audio synthesis',
      'Optimized multi-ratio exports for Instagram, YouTube, TikTok, and TV',
    ],
    processSteps: [
      { step: 1, title: { en: 'Script & Style Frames' }, description: { en: 'Drafting kinetic copy and illustrated style boards.' } },
      { step: 2, title: { en: 'Animatic' }, description: { en: 'Timing the animation against voiceover and musical beats.' } },
      { step: 3, title: { en: 'High-Res Animation' }, description: { en: 'Fleshing out easing curves, 3D lighting, and texture dynamics.' } },
      { step: 4, title: { en: 'Sound & Multi-Platform Export' }, description: { en: 'Embedding foley sound design and exporting all social resolutions.' } },
    ],
    packages: [
      {
        id: 'pkg-promo-motion',
        slug: 'promo-motion',
        name: { en: 'Commercial Motion Ad' },
        tagline: { en: '30-second high-conversion kinetic motion ad' },
        priceCents: 85000,
        deliveryDays: 10,
        fastDeliveryDays: 6,
        includedRevisions: 2,
        checkoutEnabled: false,
        deliverables: ['30s Motion Video', '15s Cutdown', '9:16 Vertical Version', 'Custom sound design'],
        features: ['Kinetic typography', '3D product integration', 'Dynamic sound FX'],
      },
    ],
    samples: [
      {
        title: 'Spectra Cloud OS Launch',
        category: '3D Product Motion Graphics',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: '0:45',
      },
    ],
    faq: [
      {
        question: { en: 'Can you provide voiceovers for our motion ads?' },
        answer: { en: 'Yes, we source professional male or female voice talent in English, Spanish, Arabic, or Urdu.' },
      },
    ],
    briefFields: [
      { id: 'adGoal', label: { en: 'Objective of the Ad' }, type: 'text', placeholder: { en: 'e.g. App download, brand awareness, product launch' }, required: true },
      { id: 'adDetails', label: { en: 'Key features, copy, and call to action' }, type: 'textarea', placeholder: { en: 'Detail the message and platforms you will advertise on...' }, required: true },
    ],
  },
  {
    id: 'srv-livestream-production',
    slug: 'livestream-production',
    title: { en: 'Livestream Production' },
    tagline: { en: 'Broadcast-Grade Multi-Camera Real-Time Streaming' },
    shortDescription: {
      en: 'Hybrid summits, concert streams, esports events, and corporate global broadcasts.',
    },
    fullDescription: {
      en: 'Deliver rock-solid zero-downtime broadcasts across the globe. Our broadcast engineers handle multi-camera live switching, real-time lower thirds, SRT remote callers, and redundant multi-CDN encoding.',
    },
    iconName: 'Radio',
    heroImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 80000,
    addons: [],
    whatIsIncluded: [
      'Multi-camera 4K/1080p switching (vMix / Blackmagic ATEM)',
      'Custom broadcast graphics, animated scoreboards & lower thirds',
      'Multi-destination restreaming (YouTube, LinkedIn, Twitter, Twitch, RTMP)',
      'Ultra-low-latency remote speaker feeds with intercom tally',
      'Full ProRes archive recording and instant live clip editing',
    ],
    processSteps: [
      { step: 1, title: { en: 'Tech Scoping' }, description: { en: 'Auditing internet bandwidth, run of show, and hardware requirements.' } },
      { step: 2, title: { en: 'Graphic Packaging' }, description: { en: 'Designing animated overlays, title slates, and stinger transitions.' } },
      { step: 3, title: { en: 'Dry Run Rehearsal' }, description: { en: 'Testing remote guests, audio calibration, and failover fallbacks.' } },
      { step: 4, title: { en: 'Live Broadcast' }, description: { en: 'Switching cameras, moderating Q&A feeds, and monitoring ingest metrics.' } },
    ],
    packages: [
      {
        id: 'pkg-corporate-broadcast',
        slug: 'corporate-broadcast',
        name: { en: 'Corporate Multi-Camera Stream' },
        tagline: { en: 'Broadcast-tier live production for conferences and keynotes' },
        priceCents: 180000,
        deliveryDays: 5,
        fastDeliveryDays: 3,
        includedRevisions: 1,
        checkoutEnabled: false,
        deliverables: ['Live Multi-stream', 'Raw ISO Camera Recordings', 'Edited highlight reel', 'Audience metrics'],
        features: ['3 Camera angles', 'Dedicated audio engineer', 'Live graphics package'],
      },
    ],
    samples: [
      {
        title: 'Global Tech Summit Keynote',
        category: 'Live Multi-Camera Broadcast',
        thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: 'Live Stream',
      },
    ],
    faq: [
      {
        question: { en: 'Can you handle virtual speakers from different continents?' },
        answer: { en: 'Yes, we ingest callers via SRT, Zoom ISO, or WebRTC with dedicated audio-mix-minus feeds.' },
      },
    ],
    briefFields: [
      { id: 'eventDateLocation', label: { en: 'Event Date & Location' }, type: 'text', placeholder: { en: 'e.g. Nov 25, 2026 - Hybrid event in London / Virtual' }, required: true },
      { id: 'broadcastScope', label: { en: 'Run of show and speaker details' }, type: 'textarea', placeholder: { en: 'Describe audience size, platforms, and special interactive needs...' }, required: true },
    ],
  },
  {
    id: 'srv-photography-social-content',
    slug: 'photography-social-content',
    title: { en: 'Photography & Social Content' },
    tagline: { en: 'High-Impact Visual Assets Tailored for Modern Feeds' },
    shortDescription: {
      en: 'Editorial studio photography, product stills, lifestyle shoots & short-form video reels.',
    },
    fullDescription: {
      en: 'Great brands live where culture moves. We shoot editorial lookbooks, commercial product photography, and high-frequency short-form video content designed for viral traction on TikTok, Instagram Reels, and YouTube Shorts.',
    },
    iconName: 'Camera',
    heroImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=80',
    checkoutEnabled: false,
    startingPriceCents: 30000,
    addons: [],
    whatIsIncluded: [
      'Medium-format and full-frame studio camera systems',
      'Advanced beauty, product, and commercial lighting rigs',
      'High-end skin retouching and color grading',
      'Native vertical video clips captured alongside stills',
      'Full licensing for digital, print, and billboard advertising',
    ],
    processSteps: [
      { step: 1, title: { en: 'Creative Moodboard' }, description: { en: 'Aligning on lighting styles, models, backdrops, and props.' } },
      { step: 2, title: { en: 'Studio / Location Shoot' }, description: { en: 'Capturing tethered imagery with live monitor review.' } },
      { step: 3, title: { en: 'Retouching & Color' }, description: { en: 'Precision frequency separation, dodging & burning, and color grading.' } },
      { step: 4, title: { en: 'Asset Delivery' }, description: { en: 'Providing high-res print files and web-optimized social crops.' } },
    ],
    packages: [
      {
        id: 'pkg-social-bundle',
        slug: 'social-bundle',
        name: { en: 'Social Content Package' },
        tagline: { en: 'A month of social media visual fuel in one shoot' },
        priceCents: 65000,
        deliveryDays: 7,
        fastDeliveryDays: 4,
        includedRevisions: 2,
        checkoutEnabled: false,
        deliverables: ['30 Retouched Photographs', '5 Edited Vertical Video Reels', 'Color-matched style presets'],
        features: ['Studio lighting setup', 'Product styling', 'Social licensing'],
      },
    ],
    samples: [
      {
        title: 'Aura Luxury Timepiece Campaign',
        category: 'Macro Product Photography',
        thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration: 'Stills & Video',
      },
    ],
    faq: [
      {
        question: { en: 'Do you provide props and set styling?' },
        answer: { en: 'Yes, our studio team provides prop sourcing, background styling, and wardrobe consultation.' },
      },
    ],
    briefFields: [
      { id: 'productType', label: { en: 'What are we shooting?' }, type: 'text', placeholder: { en: 'e.g. Luxury cosmetics line, founder portraits' }, required: true },
      { id: 'shootDetails', label: { en: 'Creative vision and deliverables needed' }, type: 'textarea', placeholder: { en: 'Describe number of assets, visual style, and deadlines...' }, required: true },
    ],
  },
];

export const STATS_DATA: StatItem[] = [
  { id: 'stat-exp', value: 10, suffix: '+', label: { en: 'Years of Experience' } },
  { id: 'stat-awards', value: 15, suffix: '+', label: { en: 'Awards & Recognitions' } },
  { id: 'stat-projects', value: 250, suffix: '+', label: { en: 'Projects Delivered' } },
  { id: 'stat-clients', value: 180, suffix: '+', label: { en: 'Happy Clients' } },
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: 'award-1',
    laurelTitle: 'Creative Excellence',
    laurelYear: '2024',
    laurelOrg: 'Global Cinema & Sound Awards',
    portfolioCardTitle: 'The Echoes Within',
    starRating: 5,
    runtime: '18 min',
    coverImage: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'award-2',
    laurelTitle: 'Visual Mastery',
    laurelYear: '2024',
    laurelOrg: 'International Visual Guild',
    portfolioCardTitle: 'Neon Odyssey VFX',
    starRating: 5,
    runtime: '3 min',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'award-3',
    laurelTitle: 'Studio Recognition',
    laurelYear: '2025',
    laurelOrg: 'Apex Media Excellence',
    portfolioCardTitle: 'Symphony of Legends',
    starRating: 5,
    runtime: 'Full Album',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Julian Vance',
    role: 'Creative Director',
    company: 'Vanguard Media Group',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'Legacy Pixels delivered a soundtrack that gave our entire cinema piece its emotional spine. The production fidelity and turnaround were unmatched. They turned our concept into a true legend.',
    rating: 5,
    verified: true,
  },
  {
    id: 'test-2',
    name: 'Sarah Lindqvist',
    role: 'Bride & Private Patron',
    company: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'The personalized song for our 10th anniversary moved our whole family to tears. The lyrics captured intimate memories only we knew. The 3-day delivery was flawless!',
    rating: 5,
    verified: true,
  },
];

export const CLIENT_LOGOS = [
  { name: 'Apex Cinematic Group', logo: 'APEX CINEMA' },
  { name: 'Vanguard Soundworks', logo: 'VANGUARD' },
  { name: 'Velvet Horizon Studios', logo: 'VELVET HORIZON' },
  { name: 'Elysium Entertainment', logo: 'ELYSIUM' },
  { name: 'Monolith Global Records', logo: 'MONOLITH' },
  { name: 'Aura Interactive', logo: 'AURA INTERACTIVE' },
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    slug: 'the-art-of-cinematic-soundtracks',
    title: { en: 'The Art of Cinematic Soundtracks: Transforming Real Memories into Melody' },
    excerpt: { en: 'Discover how Legacy Pixels structures musical motifs and vocal storytelling to capture deeply personal human milestones.' },
    content: {
      en: `Behind every great emotional moment is a soundtrack that amplifies its resonance. When we set out to compose a personalized song at Legacy Pixels, our producers treat every brief with the same seriousness as a feature film score.

### 1. Identifying the Emotional Anchor
Every story has a pivotal turning point—the first time two people met, an obstacle overcome together, or a lifelong commitment. We unearth this anchor and translate it into a musical hook.

### 2. Crafting Authentic Instrumentation
From warm acoustic guitars that evoke intimacy to soaring orchestral crescendos that inspire awe, the instrumentation must serve the narrative.

### 3. Broadcast-Grade Studio Polish
A great song deserves radio-level mastering. Every vocal syllable is EQ-treated and placed into a pristine spatial soundstage.`,
    },
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    publishedAt: 'March 14, 2026',
    readTime: '4 min read',
    author: 'Lead Producer, Legacy Pixels',
    category: 'Music Production',
  },
  {
    slug: 'photoreal-vfx-in-indie-cinema',
    title: { en: 'Photoreal VFX in Modern Cinema: Invisible World-Building' },
    excerpt: { en: 'How advances in photoreal compositing and dynamic simulation empower independent filmmakers to create expansive cinematic universes.' },
    content: {
      en: `The best visual effects are the ones audiences never realize are there. In modern storytelling, visual effects are no longer restricted to mega-budget blockbusters.

### Invisible Enhancements
Removing modern power lines, adding subtle atmospheric haze, or altering the time of day with matte painting allows directors to transport viewers to another era seamlessly.

### Unreal Engine Pre-Visualization
Virtual production bridges the gap between imagination and on-set reality, allowing directors to frame shots with virtual backgrounds in real time.`,
    },
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    publishedAt: 'February 28, 2026',
    readTime: '5 min read',
    author: 'VFX Supervisor, Legacy Pixels',
    category: 'VFX & CGI',
  },
  {
    slug: 'mastering-color-davinci-resolve',
    title: { en: 'Color Grading Secrets: Why Color is 50% of the Cinematic Look' },
    excerpt: { en: 'An insider look into our color grading pipeline: balancing skin tones, film emulation, and chromatic depth.' },
    content: {
      en: `Color communicates emotion before a single line of dialogue is spoken. At Legacy Pixels, our colorists utilize 32-bit floating-point color science in DaVinci Resolve Studio to bring out deep cinematic depth.

### Emulating Film Emulsion
Digital sensors capture immense sharpness, but often lack the organic roll-off and highlight bloom of classic Kodak and Fujifilm cinema stock. We introduce subtle halation and grain to soften digital harshness.`,
    },
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    publishedAt: 'January 18, 2026',
    readTime: '6 min read',
    author: 'Senior Colorist, Legacy Pixels',
    category: 'Post-Production',
  },
];

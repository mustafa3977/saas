import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ur', name: 'اردو', dir: 'rtl' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'es', name: 'Español', dir: 'ltr' },
];

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About Us',
        services: 'Services',
        howItWorks: 'How It Works',
        portfolio: 'Portfolio',
        pricing: 'Pricing',
        blog: 'Journal',
        contact: 'Contact',
        bookNow: 'Book Now',
        signIn: 'Sign In',
        portal: 'Client Portal',
      },
      hero: {
        studioLine: 'AN ADVANCE PRODUCTION HOUSE STUDIO',
        title: 'LEGACY PIXELS',
        tagline: 'TURNING NAMES INTO LEGENDS',
        subServices: 'Movies | Music | VFX | Editing | Branding',
        exploreWork: 'EXPLORE OUR WORK',
        viewPortfolio: 'VIEW PORTFOLIO',
      },
      sections: {
        aboutUs: 'about us',
        movies: 'movies',
        services: 'services',
        whoWeAre: 'who we are',
        awards: 'awards',
        testimonials: 'testimonials',
        blog: 'legacy journal',
      },
      buttons: {
        contactUs: 'CONTACT US',
        moreAboutUs: 'MORE ABOUT US',
        viewPortfolio: 'VIEW PORTFOLIO',
        startProject: 'START YOUR PROJECT',
        requestQuote: 'REQUEST A QUOTE',
        explorePackages: 'EXPLORE PACKAGES',
        bookAProject: 'Book a Project →',
      },
    },
  },
  ur: {
    translation: {
      nav: {
        home: 'ہوم',
        about: 'ہمارے بارے میں',
        services: 'خدمات',
        howItWorks: 'طریقہ کار',
        portfolio: 'پورٹ فولیو',
        pricing: 'قیمتیں',
        blog: 'جرنل',
        contact: 'رابطہ',
        bookNow: 'ابھی بک کریں',
        signIn: 'لاگ ان',
        portal: 'کلائنٹ پورٹل',
      },
      hero: {
        studioLine: 'ایک جدید پروڈکشن ہاؤس اسٹوڈیو',
        title: 'لیگیسی پکسلز',
        tagline: 'ناموں کو داستان بنانے کا فن',
        subServices: 'فلمیں | موسیقی | وی ایف ایکس | ایڈیٹنگ | برانڈنگ',
        exploreWork: 'ہمارا کام دیکھیں',
        viewPortfolio: 'پورٹ فولیو ملاحظہ کریں',
      },
      sections: {
        aboutUs: 'ہمارے بارے میں',
        movies: 'فلمیں',
        services: 'ہماری خدمات',
        whoWeAre: 'ہم کون ہیں؟',
        awards: 'اعزازات',
        testimonials: 'کلائنٹ کے تاثرات',
        blog: 'لیگیسی جرنل',
      },
      buttons: {
        contactUs: 'رابطہ کریں',
        moreAboutUs: 'مزید جانیے',
        viewPortfolio: 'پورٹ فولیو دیکھیں',
        startProject: 'اپنا پروجیکٹ شروع کریں',
        requestQuote: 'کوٹیشن حاصل کریں',
        explorePackages: 'پیکیجز دیکھیں',
        bookAProject: 'پروجیکٹ بک کریں ←',
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        about: 'من نحن',
        services: 'خدماتنا',
        howItWorks: 'كيف نعمل',
        portfolio: 'أعمالنا',
        pricing: 'الأسعار',
        blog: 'المدونة',
        contact: 'تواصل معنا',
        bookNow: 'احجز الآن',
        signIn: 'تسجيل الدخول',
        portal: 'بوابة العملاء',
      },
      hero: {
        studioLine: 'استوديو إنتاج سينمائي متقدم',
        title: 'ليجاسي بيكسلز',
        tagline: 'نحول الأسماء إلى أساطير',
        subServices: 'أفلام | موسيقى | مؤثرات بصرية | مونتاج | هوية بصرية',
        exploreWork: 'استكشف أعمالنا',
        viewPortfolio: 'مشاهدة المعرض',
      },
      sections: {
        aboutUs: 'من نحن',
        movies: 'الأفلام',
        services: 'خدماتنا',
        whoWeAre: 'من نكون ؟',
        awards: 'الجوائز والتكريم',
        testimonials: 'آراء العملاء',
        blog: 'مجلة ليجاسي',
      },
      buttons: {
        contactUs: 'تواصل معنا',
        moreAboutUs: 'المزيد عنا',
        viewPortfolio: 'مشاهدة المعرض',
        startProject: 'ابدأ مشروعك',
        requestQuote: 'طلب عرض سعر',
        explorePackages: 'استعراض الباقات',
        bookAProject: 'احجز مشروعاً ←',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        about: 'Nosotros',
        services: 'Servicios',
        howItWorks: 'Cómo Funciona',
        portfolio: 'Portafolio',
        pricing: 'Precios',
        blog: 'Diario',
        contact: 'Contacto',
        bookNow: 'Reservar',
        signIn: 'Acceso',
        portal: 'Portal de Clientes',
      },
      hero: {
        studioLine: 'ESTUDIO DE PRODUCCIÓN CINEMATOGRÁFICA AVANZADA',
        title: 'LEGACY PIXELS',
        tagline: 'CONVIRTIENDO NOMBRES EN LEYENDAS',
        subServices: 'Películas | Música | VFX | Edición | Branding',
        exploreWork: 'EXPLORA NUESTRO TRABAJO',
        viewPortfolio: 'VER PORTAFOLIO',
      },
      sections: {
        aboutUs: 'sobre nosotros',
        movies: 'películas',
        services: 'servicios',
        whoWeAre: '¿quiénes somos?',
        awards: 'premios',
        testimonials: 'testimonios',
        blog: 'diario legacy',
      },
      buttons: {
        contactUs: 'CONTÁCTANOS',
        moreAboutUs: 'MÁS SOBRE NOSOTROS',
        viewPortfolio: 'VER PORTAFOLIO',
        startProject: 'INICIAR PROYECTO',
        requestQuote: 'SOLICITAR COTIZACIÓN',
        explorePackages: 'VER PAQUETES',
        bookAProject: 'Reservar Proyecto →',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const setAppLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  const selected = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  const dir = selected?.dir || 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

export default i18n;

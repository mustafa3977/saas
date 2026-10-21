import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, Play, User, Shield } from 'lucide-react';
import { SUPPORTED_LANGUAGES, setAppLanguage } from '../../i18n';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.howItWorks'), path: '/how-it-works' },
    { label: t('nav.portfolio'), path: '/portfolio' },
    { label: t('nav.pricing'), path: '/pricing' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo with Gold Crown LP Monogram */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center rounded-sm bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-[#B48A3C]/40 group-hover:border-[#B48A3C] transition-all shadow-[0_0_15px_rgba(180,138,60,0.15)]">
            {/* Crown Motif + LP */}
            <svg
              className="w-7 h-7 text-[#B48A3C] transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Crown Top */}
              <path d="M4 8l3 3 5-5 5 5 3-3v10H4z" fill="#B48A3C" fillOpacity="0.2" />
              {/* Monogram LP text */}
              <text
                x="7"
                y="16"
                fill="#B48A3C"
                fontSize="6"
                fontWeight="bold"
                fontFamily="Oswald, sans-serif"
              >
                LP
              </text>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-oswald text-lg font-bold tracking-widest text-white leading-tight">
              LEGACY <span className="text-[#E50914]">PIXELS</span>
            </span>
            <span className="font-poppins text-[9px] uppercase tracking-[0.2em] text-[#B5B5B5]">
              Advance Production House
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-oswald text-xs uppercase tracking-widest transition-colors duration-200 ${
                  isActive
                    ? 'text-[#E50914] font-semibold border-b-2 border-[#E50914] pb-1'
                    : 'text-[#B5B5B5] hover:text-[#E50914]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Lang Switcher, Portal, Contact Button */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-[#B5B5B5] hover:text-white transition-colors py-1.5 px-2 border border-transparent hover:border-[#2A2A2A] rounded"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#B48A3C]" />
              <span className="font-poppins text-[11px] font-medium">{currentLang.name}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#141414] border border-[#2A2A2A] shadow-xl rounded py-1 z-50">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setAppLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-poppins transition-colors ${
                      i18n.language === lang.code
                        ? 'text-[#E50914] bg-[#1a1a1a] font-bold'
                        : 'text-[#B5B5B5] hover:text-white hover:bg-[#1f1f1f]'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Book Now Quick Link */}
          <Link
            to="/order/music"
            className="flex items-center gap-1.5 text-xs uppercase font-oswald tracking-widest text-[#E50914] hover:text-[#FF1F2D] transition-colors font-semibold"
          >
            <Play className="w-3 h-3 fill-[#E50914]" />
            {t('nav.bookNow')}
          </Link>

          {/* Portal / Sign In */}
          <Link
            to="/portal"
            className="flex items-center gap-1.5 text-xs uppercase font-oswald tracking-widest text-[#B5B5B5] hover:text-white transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            {t('nav.signIn')}
          </Link>

          {/* Admin Console */}
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs uppercase font-oswald tracking-widest text-[#B48A3C] hover:text-[#E50914] transition-colors"
            title="Studio Command Console"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>

          {/* Outlined Contact Us Button */}
          <Link to="/contact" className="btn-cinematic">
            {t('buttons.contactUs')}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/order/music"
            className="bg-[#E50914] text-white text-[11px] font-oswald tracking-widest px-3 py-1.5 uppercase font-medium rounded-sm"
          >
            Book
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white border border-[#2A2A2A] rounded hover:border-[#E50914]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-[#2A2A2A] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-oswald text-sm uppercase tracking-widest ${
                  location.pathname === link.path ? 'text-[#E50914] font-bold' : 'text-[#B5B5B5]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#2A2A2A] flex flex-col gap-3">
            {/* Mobile Lang Selection */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#B48A3C]" />
              <div className="flex gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setAppLanguage(lang.code);
                    }}
                    className={`text-xs px-2 py-1 rounded border ${
                      i18n.language === lang.code
                        ? 'border-[#E50914] text-[#E50914]'
                        : 'border-[#2A2A2A] text-[#B5B5B5]'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-cinematic w-full text-center"
            >
              {t('buttons.contactUs')}
            </Link>

            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-oswald text-xs uppercase tracking-widest text-[#B5B5B5] py-2"
            >
              {t('nav.portal')} / {t('nav.signIn')}
            </Link>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-oswald text-xs uppercase tracking-widest text-[#B48A3C] py-2 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Studio Admin Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

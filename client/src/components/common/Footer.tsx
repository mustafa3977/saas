import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { SERVICES_CATALOG } from '@legacypixels/shared';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { isCustomerAuthenticated } = useAuth();
  return (
    <footer className="bg-[#070707] border-t border-[#2A2A2A] text-white pt-16 pb-24 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-column main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-[#B48A3C]/50">
                <svg className="w-6 h-6 text-[#B48A3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 8l3 3 5-5 5 5 3-3v10H4z" fill="#B48A3C" fillOpacity="0.2" />
                  <text x="7" y="16" fill="#B48A3C" fontSize="6" fontWeight="bold" fontFamily="Oswald">
                    LP
                  </text>
                </svg>
              </div>
              <span className="font-oswald text-xl font-bold tracking-widest text-white">
                LEGACY <span className="text-[#E50914]">PIXELS</span>
              </span>
            </Link>

            <p className="text-[#B5B5B5] text-xs font-raleway leading-relaxed">
              An advance production house — Movies, Music, VFX, Editing, Branding, Ads & Motion Graphics. Legacy Pixels, Since 2024.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-poppins uppercase tracking-widest text-[#B5B5B5] block mb-3">
                Follow The Craft
              </span>
              <div className="flex items-center gap-3">
                {/* Instagram SVG */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#E50914] hover:border-[#E50914] transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* YouTube SVG */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#E50914] hover:border-[#E50914] transition-all"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* Facebook SVG */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#E50914] hover:border-[#E50914] transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.456 5 15.78 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                  </svg>
                </a>
                {/* WhatsApp SVG */}
                <a
                  href="https://wa.me/447405593913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#E50914] hover:border-[#E50914] transition-all"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-oswald text-sm uppercase tracking-widest text-white mb-5 border-b border-[#2A2A2A] pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-raleway text-[#B5B5B5]">
              <li>
                <Link to="/" className="hover:text-[#E50914] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E50914] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#E50914] transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#E50914] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-[#E50914] transition-colors">
                  Portfolio & Showreel
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#E50914] transition-colors">
                  Pricing & Packages
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#E50914] transition-colors">
                  Legacy Journal
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#E50914] transition-colors">
                  FAQs & Knowledge
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The 8 Services */}
          <div>
            <h4 className="font-oswald text-sm uppercase tracking-widest text-white mb-5 border-b border-[#2A2A2A] pb-2 inline-block">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs font-raleway text-[#B5B5B5]">
              {SERVICES_CATALOG.map((srv) => (
                <li key={srv.slug}>
                  <Link
                    to={`/services/${srv.slug}`}
                    className="hover:text-[#E50914] transition-colors flex items-center justify-between group"
                  >
                    <span>{srv.title.en}</span>
                    <span className="text-[10px] text-[#2A2A2A] group-hover:text-[#E50914] transition-colors">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="space-y-5">
            <h4 className="font-oswald text-sm uppercase tracking-widest text-white mb-2 border-b border-[#2A2A2A] pb-2 inline-block">
              Get In Touch
            </h4>
            <p className="text-xs text-[#B5B5B5] leading-relaxed">
              Have a cinema production, personalized song, or commercial vision? Connect with our executive producers.
            </p>

            <div className="space-y-3 text-xs text-[#B5B5B5]">
              <a
                href="tel:+447405593913"
                className="flex items-center gap-2.5 hover:text-[#E50914] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E50914]" />
                <span>+44 7405 593913</span>
              </a>

              <a
                href="mailto:hello@legacypixels.net"
                className="flex items-center gap-2.5 hover:text-[#E50914] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#E50914]" />
                <span>hello@legacypixels.net</span>
              </a>
            </div>

            <div className="pt-2">
              <Link
                to={isCustomerAuthenticated ? '/order/music' : '/login'}
                state={!isCustomerAuthenticated ? { from: '/order/music' } : undefined}
                className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#FF1F2D] text-white text-xs font-oswald uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all"
              >
                <span>Book a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-raleway text-[#B5B5B5]">
          <div>
            <span>© 2026 Legacy Pixels. All Rights Reserved. </span>
            <span className="text-[#E50914] font-medium">"Turning Names into Legends."</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Refund & Revision Policy
            </Link>
            <span>•</span>
            <Link to="/delivery-policy" className="hover:text-white transition-colors">
              Delivery Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

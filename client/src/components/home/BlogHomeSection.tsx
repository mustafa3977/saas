import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { BLOG_POSTS_DATA } from '@legacypixels/shared';

export const BlogHomeSection: React.FC = () => {
  const latestPosts = BLOG_POSTS_DATA.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 bg-[#0a0a0a] relative border-b border-[#2A2A2A]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            label="legacy journal"
            title="INSIGHTS FROM THE SOUNDSTAGE"
            subtitle="Dispatches on cinematic craft, songwriting secrets, visual effects breakdowns, and industry masterclasses."
            align="left"
          />
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-widest text-[#E50914] hover:text-[#ff2b38] transition-colors mb-4"
          >
            <span>Explore All Journal Entries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="cinematic-card rounded-sm overflow-hidden flex flex-col group"
            >
              <div className="aspect-[16/10] overflow-hidden relative bg-black">
                <img
                  src={post.coverImage}
                  alt={post.title.en}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-black/80 border border-[#2A2A2A] text-[10px] font-poppins uppercase tracking-wider text-[#B5B5B5] px-2.5 py-1 rounded-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-[11px] font-poppins text-[#B5B5B5] mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B48A3C]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-oswald text-lg sm:text-xl uppercase font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors leading-snug mb-3">
                    {post.title.en}
                  </h3>

                  <p className="font-raleway text-xs text-[#B5B5B5] line-clamp-2 leading-relaxed">
                    {post.excerpt.en}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-oswald uppercase tracking-widest text-[#B5B5B5] group-hover:text-white transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E50914] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/blog"
            className="btn-cinematic w-full"
          >
            Explore All Journal Entries
          </Link>
        </div>
      </div>
    </section>
  );
};

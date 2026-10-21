import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { BLOG_POSTS_DATA } from '@legacypixels/shared';

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(BLOG_POSTS_DATA.map((p) => p.category))];

  const filteredPosts = BLOG_POSTS_DATA.filter((post) =>
    selectedCategory === 'All' ? true : post.category === selectedCategory
  );

  const featuredPost = BLOG_POSTS_DATA[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="legacy journal"
            title="CINEMATIC INTELLIGENCE & CRAFT NOTES"
            subtitle="Deep dives into original songwriting, analog sound engineering, anamorphic cinematography, and visual effects artistry."
            align="left"
          />

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-oswald uppercase tracking-widest rounded-sm border transition-all ${
                  selectedCategory === cat
                    ? 'border-[#E50914] bg-[#E50914] text-white'
                    : 'border-[#2A2A2A] bg-[#141414] text-[#B5B5B5] hover:border-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner Post */}
      {selectedCategory === 'All' && featuredPost && (
        <section className="py-12 bg-[#0A0A0A] border-b border-[#2A2A2A]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="cinematic-card rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 group"
            >
              <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-black relative">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title.en}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-[#E50914] text-white text-[10px] font-oswald uppercase tracking-widest px-3 py-1 rounded-sm font-semibold">
                  Featured Dispatch
                </span>
              </div>

              <div className="lg:col-span-5 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs font-poppins text-[#B5B5B5] mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                      {featuredPost.publishedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B48A3C]" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="font-oswald text-2xl sm:text-3xl uppercase font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors mb-4">
                    {featuredPost.title.en}
                  </h2>

                  <p className="font-raleway text-xs sm:text-sm text-[#B5B5B5] leading-relaxed mb-6">
                    {featuredPost.excerpt.en}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-oswald uppercase tracking-widest text-[#B5B5B5] group-hover:text-white">
                  <span>Read Full Dispatch</span>
                  <ArrowRight className="w-4 h-4 text-[#E50914] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid of Articles */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="cinematic-card rounded-sm overflow-hidden flex flex-col justify-between group"
              >
                <div>
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

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] font-poppins text-[#B5B5B5] mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                        {post.publishedAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B48A3C]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-oswald text-lg sm:text-xl uppercase font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors mb-3">
                      {post.title.en}
                    </h3>

                    <p className="font-raleway text-xs text-[#B5B5B5] line-clamp-3 leading-relaxed">
                      {post.excerpt.en}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-oswald uppercase tracking-widest text-[#B5B5B5] group-hover:text-white transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E50914] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

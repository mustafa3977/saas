import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, User, Share2, Sparkles } from 'lucide-react';
import { BLOG_POSTS_DATA } from '@legacypixels/shared';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug) || BLOG_POSTS_DATA[0];

  const relatedPosts = BLOG_POSTS_DATA.filter((p) => p.slug !== post.slug).slice(0, 2);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title.en,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <section className="relative py-20 sm:py-28 bg-[#0D0D0D] border-b border-[#2A2A2A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={post.coverImage}
            alt={post.title.en}
            className="w-full h-full object-cover filter brightness-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-oswald uppercase tracking-widest text-[#B5B5B5] hover:text-[#E50914] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Legacy Journal</span>
          </Link>

          <span className="bg-[#E50914] text-white text-[10px] font-oswald uppercase tracking-widest px-3 py-1 rounded-sm font-semibold inline-block mb-4">
            {post.category}
          </span>

          <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase tracking-wide text-white mb-6 leading-tight">
            {post.title.en}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#2A2A2A] text-xs font-poppins text-[#B5B5B5]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-white">
                <User className="w-4 h-4 text-[#E50914]" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B48A3C]" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B5B5B5]" />
                {post.readTime}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-white hover:text-[#E50914] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none text-sm sm:text-base font-raleway text-[#CCCCCC] leading-relaxed space-y-6">
            <p className="text-base sm:text-lg font-medium text-white/95 leading-relaxed border-l-2 border-[#E50914] pl-5 italic">
              {post.excerpt.en}
            </p>

            <div className="my-8 rounded-sm overflow-hidden border border-[#2A2A2A]">
              <img
                src={post.coverImage}
                alt={post.title.en}
                className="w-full h-auto object-cover"
              />
            </div>

            <p>{post.content.en}</p>

            <h3 className="font-oswald text-2xl uppercase font-bold text-white tracking-wide pt-4">
              The Architecture of Lasting Impact
            </h3>
            <p>
              In cinematic storytelling and original songwriting alike, emotion cannot be faked with synthetic shortcuts or generic templates. It demands authentic vocal phrasing, acoustic room reflections, dynamic range preservation, and color palettes calibrated to physiological human empathy.
            </p>

            <div className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm my-8">
              <h4 className="font-oswald text-base uppercase font-bold text-[#E50914] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Key Studio Takeaway
              </h4>
              <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed">
                When you commission an original piece of music or cinema with Legacy Pixels, you are retaining a work crafted by world-class humans dedicated to immortality. Every transient is reviewed by certified engineers before reaching your portal.
              </p>
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="mt-16 p-6 sm:p-8 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#1c1c1c] border border-[#E50914] flex items-center justify-center font-oswald text-xl text-white font-bold flex-shrink-0">
              LP
            </div>
            <div>
              <span className="text-[10px] font-poppins uppercase tracking-widest text-[#E50914] block">
                Written by
              </span>
              <h4 className="font-oswald text-lg uppercase font-bold text-white mb-1">
                {post.author}
              </h4>
              <p className="font-raleway text-xs text-[#B5B5B5]">
                Senior creative artisan at Legacy Pixels Advance Production House. Specializing in broadcast post-production and emotional storytelling.
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#2A2A2A]">
              <h3 className="font-oswald text-xl uppercase font-bold text-white mb-6">
                Related Journal Entries
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}`}
                    className="cinematic-card p-5 rounded-sm block group"
                  >
                    <span className="text-[10px] font-poppins uppercase tracking-widest text-[#E50914] block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-oswald text-base uppercase font-bold text-white group-hover:text-[#E50914] transition-colors mb-2">
                      {rel.title.en}
                    </h4>
                    <p className="font-raleway text-xs text-[#B5B5B5] line-clamp-2">
                      {rel.excerpt.en}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
};

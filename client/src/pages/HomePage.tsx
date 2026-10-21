import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesGridSection } from '../components/home/ServicesGridSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { WhoWeAreSection } from '../components/home/WhoWeAreSection';
import { StatsSection } from '../components/home/StatsSection';
import { AwardsSection } from '../components/home/AwardsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { BlogHomeSection } from '../components/home/BlogHomeSection';
import { CtaBannerSection } from '../components/home/CtaBannerSection';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HeroSection />
      <AboutSection />
      <ServicesGridSection />
      <ProjectsSection />
      <WhoWeAreSection />
      <StatsSection />
      <AwardsSection />
      <TestimonialsSection />
      <BlogHomeSection />
      <CtaBannerSection />
    </main>
  );
};

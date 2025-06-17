import React from 'react';
import Hero from '../components/homepage/Hero';
import Features from '../components/homepage/Features';
import Stats from '../components/homepage/Stats';
import Portfolio from '../components/homepage/Portfolio';
import Process from '../components/homepage/Process';
import CTA from '../components/homepage/CTA';

const Homepage: React.FC = () => {
  return (
    <div className="pt-16">
      <Hero />
      <Features />
      <Stats />
      <Portfolio />
      <Process />
      <CTA />
    </div>
  );
};

export default Homepage;
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import BikeShowcase from '../components/home/BikeShowcase';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FeaturedProducts from '../components/home/FeaturedProducts';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <BikeShowcase />
      <CategoryShowcase />
    </div>
  );
}
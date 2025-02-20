import Image from 'next/image';
import { Metadata } from 'next';
import PropertyList from '@/components/PropertyList';
import SearchFilters from '@/components/SearchFilters';
import styles from './test.module.css';

export const metadata: Metadata = {
  title: 'Affordable Housing | Find Your Dream Home',
  description: 'Find affordable housing properties for sale and rent, plus real estate job opportunities.',
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="hero-background min-h-[70vh] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        
        <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Find Your Perfect</span>
              <span className="gradient-text">Affordable Home</span>
            </h1>
            <p className="mx-auto max-w-lg text-xl text-gray-200 leading-relaxed sm:max-w-xl">
              Discover carefully curated affordable housing options and real estate opportunities tailored to your needs and preferences.
            </p>
            
            {/* Search Section */}
            <div className="mt-12 glass-effect rounded-xl p-8 mx-auto max-w-3xl">
              <h2 className="text-xl font-semibold text-white mb-6">Find Your Dream Property</h2>
              <SearchFilters />
            </div>
          </div>
        </main>
      </div>

      {/* Property Listings Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Available Properties</h2>
          <PropertyList />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Boma-Link. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

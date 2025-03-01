import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import PropertyList from '@/components/PropertyList';
import SearchFilters from '@/components/SearchFilters';
import styles from './home.module.css';
import { FaHome, FaHandshake, FaChartLine } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

export const metadata: Metadata = {
  title: 'Affordable Housing | Find Your Dream Home',
  description: 'Find affordable housing properties for sale and rent, plus real estate job opportunities.',
};

const features = [
  {
    icon: <FaHome className="w-8 h-8 text-blue-400" />,
    title: 'Quality Homes',
    description: 'Carefully vetted properties that meet our high standards for quality and affordability.'
  },
  {
    icon: <FaHandshake className="w-8 h-8 text-green-400" />,
    title: 'Fair Deals',
    description: 'Transparent pricing and fair negotiations to ensure the best value for your money.'
  },
  {
    icon: <MdSecurity className="w-8 h-8 text-purple-400" />,
    title: 'Secure Process',
    description: 'Safe and secure transaction process with verified property listings and sellers.'
  },
  {
    icon: <FaChartLine className="w-8 h-8 text-yellow-400" />,
    title: 'Market Insights',
    description: 'Up-to-date market analysis and trends to help you make informed decisions.'
  }
];

const stats = [
  { number: '1000+', label: 'Properties Listed' },
  { number: '500+', label: 'Happy Families' },
  { number: '50+', label: 'Cities Covered' },
  { number: '98%', label: 'Client Satisfaction' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className={`${styles.heroBackground} min-h-[80vh] relative flex items-center justify-center`}>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              <span className="block">Find Your Perfect</span>
              <span className={styles.gradientText}>Affordable Home</span>
            </h1>
            <p className="mx-auto max-w-xl text-xl text-gray-200 leading-relaxed">
              Discover carefully curated affordable housing options tailored to your needs and dreams.
            </p>
            
            {/* Search Section */}
            <div className={`${styles.glassEffect} rounded-xl p-8 mx-auto max-w-4xl`}>
              <h2 className="text-2xl font-semibold text-white mb-6">Start Your Home Search</h2>
              <SearchFilters />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose <span className={styles.gradientText}>Boma-Link</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`${styles.featureCard} p-6 rounded-xl text-center`}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${styles.statsSection} py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`${styles.statCard} p-6 rounded-xl text-center`}>
                <div className={`${styles.gradientText} text-4xl font-bold mb-2`}>{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Listings Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Properties</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our handpicked selection of affordable properties in prime locations.
            </p>
          </div>
          <PropertyList />
          <div className="text-center mt-12">
            <Link 
              href="/properties"
              className={`${styles.ctaButton} inline-block px-8 py-3 text-white rounded-full font-semibold`}
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className={`${styles.glassEffect} max-w-5xl mx-auto rounded-2xl p-12 text-center`}>
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of happy families who found their perfect home through Boma-Link.
            Start your journey today!
          </p>
          <Link 
            href="/auth/signup"
            className={`${styles.ctaButton} inline-block px-8 py-4 text-white rounded-full font-semibold text-lg`}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${styles.footer} py-12`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About Us</h3>
            <p className="text-gray-400">
              Boma-Link is dedicated to making affordable housing accessible to everyone through 
              our innovative platform and commitment to transparency.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/properties" className="text-gray-400 hover:text-white">Properties</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/jobs" className="text-gray-400 hover:text-white">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="/guides" className="text-gray-400 hover:text-white">Buying Guide</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@boma-link.com</li>
              <li>Phone: (254) 123-4567</li>
              <li>Address: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Boma-Link. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

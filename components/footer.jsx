'use client';

import Link from 'next/link';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  GithubIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ArrowUpIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Courses', href: '/courses' },
      { name: 'AI Tutor', href: '/ai-tutor' },
    ],
  },
];

const socialLinks = [
  { icon: <FacebookIcon size={20} />, href: 'https://facebook.com/zlearn', label: 'Facebook' },
  { icon: <TwitterIcon size={20} />, href: 'https://twitter.com/zlearn', label: 'Twitter' },
  { icon: <LinkedinIcon size={20} />, href: 'https://linkedin.com/company/zlearn', label: 'LinkedIn' },
  { icon: <GithubIcon size={20} />, href: 'https://github.com/zlearn', label: 'GitHub' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-100 text-gray-70 0">


      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-gray-600">Z-Learn</span>
              </Link>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Transforming education through AI-powered learning solutions. 
              Empowering students, educators, and organizations worldwide 
              with intelligent, personalized learning experiences.
            </p>
            
    
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10  rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold text-lg mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-gray-600 transition-colors duration-200 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 transition-colors duration-200 text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-600 transition-colors duration-200 text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-tutor"
                  className="text-gray-600 transition-colors duration-200 text-sm"
                >
                  AI Tutor
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Z-Learn Technologies, Inc. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-gray-600     text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-gray-600  hover:bg-gray-800"
            >
              <ArrowUpIcon size={16} className="mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
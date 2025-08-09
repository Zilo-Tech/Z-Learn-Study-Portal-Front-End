'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, Shield, Award, TrendingUp, CheckCircle } from 'lucide-react';

const certificationStats = [
  { label: 'Employers recognize Z-Learn certificates', percentage: '87%' },
  { label: 'Salary increase after certification', percentage: '23%' },
  { label: 'Job placement rate within 6 months', percentage: '94%' },
  { label: 'HR professionals trust digital certificates', percentage: '76%' }
];

const industryPartners = [
  { name: 'Microsoft', logo: '/images/partners/microsoft.png' },
  { name: 'Google', logo: '/images/partners/google.png' },
  { name: 'Amazon', logo: '/images/partners/amazon.png' },
  { name: 'IBM', logo: '/images/partners/ibm.png' },
  { name: 'Salesforce', logo: '/images/partners/salesforce.png' },
  { name: 'Adobe', logo: '/images/partners/adobe.png' }
];

export default function VerifiedCertificatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-brand hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 md:h-96">
            <Image
              src="/images/features/verified-certificates.jpg"
              alt="Digital certificate verification process"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-brand text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                Career Development
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your Skills, Verified: The Value of Digital Certificates in Today's Job Market
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Emma Thompson</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>January 10, 2024</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>7 min read</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-600 hover:text-brand">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
                <button className="flex items-center text-gray-600 hover:text-brand">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                In today's rapidly evolving job market, traditional degrees are no longer the only path to career success. Digital certificates from reputable online learning platforms are gaining recognition as valuable credentials that demonstrate practical skills and commitment to continuous learning.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Rise of Digital Credentials</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                The digital transformation has changed not just how we work, but how we prove our capabilities. Employers increasingly value demonstrable skills over traditional qualifications, leading to the rise of competency-based hiring and the acceptance of alternative credentials.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {certificationStats.map((stat, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-brand mb-2">{stat.percentage}</div>
                    <div className="text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Makes Z-Learn Certificates Different?</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Not all online certificates are created equal. Z-Learn certificates stand out because they represent verified mastery of practical skills through rigorous assessment and real-world application.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-brand mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Verification</h3>
                    <p className="text-gray-700">Each certificate is secured on the blockchain, making it tamper-proof and instantly verifiable by employers worldwide.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="h-6 w-6 text-brand mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Competency-Based Assessment</h3>
                    <p className="text-gray-700">Our certificates require demonstration of practical skills through projects, not just multiple-choice tests.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <TrendingUp className="h-6 w-6 text-brand mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Alignment</h3>
                    <p className="text-gray-700">Curriculum developed with leading companies ensures certificates reflect current industry needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-brand mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuous Validation</h3>
                    <p className="text-gray-700">Skills are validated through ongoing projects and peer assessments, not just final exams.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Employers View Digital Certificates</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                The hiring landscape has shifted dramatically. Progressive employers now recognize that skills matter more than pedigree, and they're adapting their recruitment processes accordingly.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What HR Directors Are Saying</h3>
                <blockquote className="text-gray-700 italic mb-4">
                  "We've found that candidates with verified digital certificates often outperform those with traditional degrees alone. They come with practical, up-to-date skills and demonstrate a commitment to continuous learning."
                </blockquote>
                <cite className="text-sm font-medium text-gray-900">— Jennifer Walsh, HR Director at TechCorp</cite>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Industry Recognition and Partnerships</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Z-Learn certificates are recognized by leading companies across various industries. Our partnerships ensure that our curriculum stays current and our certificates carry weight in the job market.
              </p>

              {/* Industry Partners */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Trusted by Industry Leaders</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                  {industryPartners.map((partner, index) => (
                    <div key={index} className="text-center">
                      <div className="h-12 bg-gray-200 rounded mb-2 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{partner.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Success Stories: Certificates That Changed Careers</h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">From Marketing to Data Science</h3>
                  <p className="text-gray-700 mb-4">
                    "I was stuck in a marketing role with no clear path forward. Z-Learn's Data Science certificate not only taught me practical skills but gave me the credibility to land my dream job at a fintech startup. My salary increased by 40%."
                  </p>
                  <cite className="text-sm font-medium text-gray-900">— David Park, Data Scientist at FinanceFlow</cite>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Breaking into Cybersecurity</h3>
                  <p className="text-gray-700 mb-4">
                    "Without a computer science degree, I thought cybersecurity was out of reach. Z-Learn's verified certificate program proved to employers that I had the skills to protect their systems. I'm now leading a security team at a Fortune 500 company."
                  </p>
                  <cite className="text-sm font-medium text-gray-900">— Maria Rodriguez, Cybersecurity Manager at GlobalTech</cite>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Making Your Certificate Work for You</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Earning the certificate is just the beginning. Here's how to maximize its impact on your career:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">LinkedIn Optimization</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Add certificate to your credentials section</li>
                    <li>• Update your headline to reflect new skills</li>
                    <li>• Share projects from your coursework</li>
                    <li>• Connect with fellow certificate holders</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume Integration</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Create a dedicated "Certifications" section</li>
                    <li>• Include verification links</li>
                    <li>• Highlight relevant projects</li>
                    <li>• Quantify your achievements</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Building</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Showcase capstone projects</li>
                    <li>• Document your learning journey</li>
                    <li>• Include before/after skills assessment</li>
                    <li>• Add peer recommendations</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Network Leverage</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Join alumni networks</li>
                    <li>• Attend industry meetups</li>
                    <li>• Participate in online communities</li>
                    <li>• Mentor new learners</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Future of Professional Credentials</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                As technology continues to evolve at breakneck speed, the need for continuous skill development becomes more critical. Digital certificates represent the future of professional development—flexible, current, and focused on practical application.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Companies like Google, Amazon, and IBM have already launched their own certificate programs, recognizing that skills-based hiring is more effective than degree-based screening. This trend will only accelerate as the job market becomes increasingly dynamic.
              </p>

              <div className="bg-brand/10 border border-brand/20 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Earn Your Verified Certificate?</h3>
                <p className="text-gray-700 mb-4">
                  Join thousands of professionals who have transformed their careers with Z-Learn verified certificates. Start building the skills that employers are looking for today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/courses"
                    className="inline-flex items-center justify-center bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse Certificate Programs
                  </Link>
                  <Link 
                    href="/level-selection"
                    className="inline-flex items-center justify-center border border-brand text-brand px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Take Skill Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/personalized-learning-paths" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-32">
                <Image
                  src="/images/features/personalized-learning.jpg"
                  alt="Personalized learning"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">The Future of Education: How AI Creates Personalized Learning Paths</h3>
                <p className="text-sm text-gray-600">Discover how artificial intelligence revolutionizes education by creating customized learning experiences.</p>
              </div>
            </Link>
            
            <Link href="/blog/expert-instructors" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-32">
                <Image
                  src="/images/features/expert-instructors.jpg"
                  alt="Expert instructors"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Learning from the Best: Meet Our World-Class Expert Instructors</h3>
                <p className="text-sm text-gray-600">Get to know the industry leaders who bring real-world expertise to Z-Learn courses.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
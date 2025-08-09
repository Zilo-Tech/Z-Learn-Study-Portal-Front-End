'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, Star, Award, Users } from 'lucide-react';

const instructors = [
  {
    name: 'Dr. Elena Rodriguez',
    title: 'Former Google AI Research Scientist',
    specialty: 'Machine Learning & AI',
    experience: '15+ years',
    students: '50,000+',
    rating: 4.9,
    image: '/images/instructors/elena.jpg',
    achievements: ['Published 30+ research papers', 'Led AI team at Google', 'TEDx speaker'],
    quote: 'My passion is making complex AI concepts accessible to everyone. Every student deserves to understand the technology shaping our future.'
  },
  {
    name: 'Prof. Michael Chen',
    title: 'MIT Computer Science Professor',
    specialty: 'Cybersecurity & Blockchain',
    experience: '20+ years',
    students: '75,000+',
    rating: 4.8,
    image: '/images/instructors/michael.jpg',
    achievements: ['MIT Excellence in Teaching Award', 'Cybersecurity consultant for Fortune 500', 'Author of 3 bestselling books'],
    quote: 'Security isn\'t just about technology—it\'s about thinking like both a defender and an attacker. I teach students to see both sides.'
  },
  {
    name: 'Sarah Johnson',
    title: 'Former Netflix Data Science Director',
    specialty: 'Data Science & Analytics',
    experience: '12+ years',
    students: '40,000+',
    rating: 4.9,
    image: '/images/instructors/sarah.jpg',
    achievements: ['Built recommendation algorithms used by 200M+ users', 'Featured in Forbes "Top Data Scientists"', 'Keynote speaker at 50+ conferences'],
    quote: 'Data tells stories, but only if you know how to listen. I help students become fluent in the language of data.'
  }
];

export default function ExpertInstructorsPage() {
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
              src="/images/features/expert-instructors.jpg"
              alt="Expert instructors teaching online"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-brand text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                Community
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Learning from the Best: Meet Our World-Class Expert Instructors
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Michael Rodriguez</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>January 12, 2024</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>6 min read</span>
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
                At Z-Learn, we believe that exceptional learning comes from exceptional teaching. That's why we've assembled a faculty of world-renowned experts, industry leaders, and passionate educators who bring real-world experience directly to your screen.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Makes Our Instructors Different?</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our instructors aren't just academics—they're practitioners who have shaped the industries they teach about. They've built the systems you'll learn to design, solved the problems you'll encounter, and made the discoveries that define their fields.
              </p>

              <div className="bg-blue-50 border-l-4 border-brand p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Instructor Selection Process</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Industry Experience:</strong> Minimum 10+ years of hands-on experience</li>
                  <li>• <strong>Teaching Excellence:</strong> Proven track record of making complex topics accessible</li>
                  <li>• <strong>Current Relevance:</strong> Active in their field with up-to-date knowledge</li>
                  <li>• <strong>Passion for Education:</strong> Genuine commitment to student success</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Meet Some of Our Star Instructors</h2>
            </div>

            {/* Instructor Profiles */}
            <div className="space-y-8 my-8">
              {instructors.map((instructor, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto md:mx-0"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                          <p className="text-brand font-medium">{instructor.title}</p>
                          <p className="text-gray-600">{instructor.specialty}</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="ml-1 font-semibold">{instructor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{instructor.experience}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{instructor.students} taught</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {instructor.achievements.map((achievement, i) => (
                            <li key={i}>• {achievement}</li>
                          ))}
                        </ul>
                      </div>

                      <blockquote className="italic text-gray-700 border-l-4 border-brand pl-4">
                        "{instructor.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Z-Learn Teaching Philosophy</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our instructors follow a unique teaching philosophy that combines theoretical knowledge with practical application:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 border-l-4 border-green-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Learn by Doing</h3>
                  <p className="text-gray-700">
                    Every concept is reinforced with hands-on projects and real-world applications. You don't just learn about data science—you analyze actual datasets from real companies.
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Context</h3>
                  <p className="text-gray-700">
                    Our instructors share stories from their professional experience, giving you insight into how skills are actually used in the workplace.
                  </p>
                </div>
                
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Continuous Support</h3>
                  <p className="text-gray-700">
                    Through office hours, discussion forums, and personalized feedback, our instructors are committed to your success beyond the classroom.
                  </p>
                </div>
                
                <div className="bg-teal-50 border-l-4 border-teal-500 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Career Guidance</h3>
                  <p className="text-gray-700">
                    With deep industry connections, our instructors often provide career advice, networking opportunities, and job referrals.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Student Success Stories</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Here's what our students say about learning from industry experts:
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <blockquote className="text-gray-700 mb-4">
                  "Dr. Rodriguez didn't just teach me machine learning algorithms—she taught me how to think like a data scientist. Her real-world examples from Google helped me understand not just the 'how' but the 'why' behind every technique."
                </blockquote>
                <cite className="text-sm font-medium text-gray-900">— Maria Santos, now ML Engineer at Spotify</cite>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <blockquote className="text-gray-700 mb-4">
                  "Prof. Chen's cybersecurity course was like having a personal mentor who had seen it all. He shared attack scenarios from his consulting work that you'd never find in textbooks. It prepared me for real threats, not just theoretical ones."
                </blockquote>
                <cite className="text-sm font-medium text-gray-900">— James Kim, Cybersecurity Analyst at Microsoft</cite>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Beyond the Classroom</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our instructors' involvement doesn't end when the course does. Many continue to:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Host monthly industry insights webinars</li>
                <li>Provide portfolio review sessions</li>
                <li>Offer networking opportunities within their professional circles</li>
                <li>Share job openings and internship opportunities</li>
                <li>Serve as references for outstanding students</li>
              </ul>

              <div className="bg-brand/10 border border-brand/20 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Learn from the Best?</h3>
                <p className="text-gray-700 mb-4">
                  Join thousands of students who are learning from industry leaders and transforming their careers. Experience the difference that world-class instruction makes.
                </p>
                <Link 
                  href="/courses"
                  className="inline-flex items-center bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Explore Our Courses
                </Link>
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
            
            <Link href="/blog/verified-certificates" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-32">
                <Image
                  src="/images/features/verified-certificates.jpg"
                  alt="Verified certificates"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Your Skills, Verified: The Value of Digital Certificates</h3>
                <p className="text-sm text-gray-600">Learn how verified certificates can boost your career prospects in today's job market.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';

export default function PersonalizedLearningPage() {
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
              src="/images/features/personalized-learning.jpg"
              alt="AI-powered personalized learning interface"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-brand text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                AI Education
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The Future of Education: How AI Creates Personalized Learning Paths
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Dr. Sarah Chen</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>January 15, 2024</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>8 min read</span>
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
                In the rapidly evolving landscape of education, artificial intelligence is not just a buzzword—it's a revolutionary force that's reshaping how we learn, grow, and achieve our goals. At Z-Learn, we're at the forefront of this transformation, creating personalized learning experiences that adapt to each student's unique needs.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Makes Learning Truly Personal?</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Traditional education follows a one-size-fits-all approach, but we know that every learner is different. Some are visual learners who thrive with diagrams and infographics, while others prefer hands-on exercises or audio explanations. Some learn quickly through repetition, while others need time to reflect and process information deeply.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Our AI algorithms analyze multiple data points to understand your learning style:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Learning Pace:</strong> How quickly you progress through different types of content</li>
                <li><strong>Engagement Patterns:</strong> Which activities keep you most engaged and focused</li>
                <li><strong>Knowledge Gaps:</strong> Areas where you might need additional support or practice</li>
                <li><strong>Preferred Formats:</strong> Whether you learn better from videos, text, interactive exercises, or discussions</li>
                <li><strong>Time Patterns:</strong> When you're most alert and productive during the day</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Our AI Creates Your Learning Path</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Once our system understands your learning profile, it crafts a personalized journey that evolves with you. Here's how it works:
              </p>

              <div className="bg-blue-50 border-l-4 border-brand p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Initial Assessment</h3>
                <p className="text-gray-700">
                  When you start a course, our AI conducts a brief assessment to understand your current knowledge level and learning preferences. This isn't a test—it's a conversation that helps us get to know you better.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Dynamic Content Curation</h3>
                <p className="text-gray-700">
                  Based on your profile, the AI selects and sequences content that matches your learning style. Visual learners get more diagrams and animations, while kinesthetic learners receive interactive simulations and hands-on projects.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Continuous Adaptation</h3>
                <p className="text-gray-700">
                  As you progress, the AI continuously monitors your performance and engagement. If you're struggling with a concept, it provides additional resources or explains it differently. If you're excelling, it introduces more challenging material to keep you engaged.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Real-World Success Stories</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Sarah, a marketing professional, was struggling to learn data analytics through traditional online courses. Within Z-Learn's personalized system, the AI identified that she learned best through real-world case studies and visual representations of data. Her customized path included:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Interactive data visualization exercises using her company's actual marketing metrics</li>
                <li>Step-by-step video tutorials broken into 10-minute segments (matching her attention span)</li>
                <li>Weekly practice sessions scheduled for her most productive hours (Tuesday mornings)</li>
                <li>Peer discussion groups with other marketing professionals facing similar challenges</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-6">
                The result? Sarah completed her data analytics certification 40% faster than the average completion time and immediately applied her new skills to improve her team's campaign performance by 25%.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Science Behind Personalization</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our approach is grounded in decades of educational research and cognitive science. We leverage concepts from:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Adaptive Learning Theory:</strong> Content difficulty adjusts to maintain optimal challenge levels</li>
                <li><strong>Spaced Repetition:</strong> Review materials are scheduled at scientifically-proven intervals</li>
                <li><strong>Multimodal Learning:</strong> Content is presented in various formats to match different learning styles</li>
                <li><strong>Mastery Learning:</strong> You don't move forward until you've truly mastered each concept</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Looking Forward: The Future of AI Education</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We're just scratching the surface of what's possible with AI-powered education. In the coming years, expect to see:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Virtual reality environments that create immersive learning experiences</li>
                <li>AI tutors that can answer questions and provide guidance 24/7</li>
                <li>Predictive analytics that help you plan your career development path</li>
                <li>Integration with workplace tools to provide just-in-time learning</li>
              </ul>

              <div className="bg-brand/10 border border-brand/20 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Experience Personalized Learning?</h3>
                <p className="text-gray-700 mb-4">
                  Don't take our word for it—experience the power of AI-driven personalized learning yourself. Join thousands of learners who are already transforming their careers with Z-Learn.
                </p>
                <Link 
                  href="/level-selection"
                  className="inline-flex items-center bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Your Personalized Learning Journey
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
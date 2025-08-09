'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Star, Crown, Zap, Award, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  popular: boolean;
}

const PricingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  
  // Get course ID from URL params if user came from a specific course
  const courseId = searchParams.get('course');
  const courseName = searchParams.get('courseName');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 15000,
      originalPrice: 20000,
      duration: '1 Month',
      description: 'Perfect for getting started with individual courses',
      icon: <Star className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Access to 1 course',
        'Standard video quality',
        'Basic quizzes and assessments',
        'Course completion certificate',
        'Mobile app access',
        'Community forum access'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 45000,
      originalPrice: 60000,
      duration: '3 Months',
      description: 'Most popular choice for serious learners',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Access to 5 courses',
        'HD video quality',
        'Advanced assessments & projects',
        'Verified certificates',
        'Priority support',
        'Mobile & offline access',
        'Live Q&A sessions',
        'Career guidance resources'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 85000,
      originalPrice: 120000,
      duration: '6 Months',
      description: 'Complete access for professional growth',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      features: [
        'Unlimited course access',
        '4K video quality',
        'Advanced projects & capstone',
        'Industry-recognized certificates',
        '24/7 priority support',
        'All device access + downloads',
        'Weekly live sessions',
        '1-on-1 mentorship sessions',
        'Job placement assistance',
        'LinkedIn skill verification'
      ],
      popular: false
    }
  ];

  const features = [
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: 'Industry Certificates',
      description: 'Earn verified certificates recognized by top employers in Cameroon and worldwide.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and university professors with real-world experience.'
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths adapted to your pace and learning style.'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleEnrollment = (plan: PricingPlan) => {
    if (!session) {
      // Redirect to login with return URL
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    // Redirect to payment or enrollment flow
    const enrollmentParams = new URLSearchParams({
      plan: plan.id,
      price: plan.price.toString(),
      duration: plan.duration
    });

    if (courseId) {
      enrollmentParams.set('course', courseId);
    }

    router.push(`/enrollment/checkout?${enrollmentParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Plan
            </h1>
            {courseId && courseName && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  You&apos;re enrolling in: <span className="font-semibold">{decodeURIComponent(courseName)}</span>
                </p>
              </div>
            )}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock your potential with Z-Learn. All prices in CFA Francs (FCFA).
              Choose the plan that fits your learning goals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                selectedPlan === plan.id ? 'ring-4 ring-blue-500' : ''
              } ${plan.popular ? 'border-2 border-purple-500' : 'border border-gray-200'}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.color} rounded-t-2xl`}></div>

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price.toLocaleString()} FCFA
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-gray-500 line-through text-lg">
                        {plan.originalPrice.toLocaleString()} FCFA
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">{plan.duration}</div>
                  </div>

                  {/* Savings Badge */}
                  {plan.originalPrice && (
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                      Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleEnrollment(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {session ? 'Choose This Plan' : 'Sign In to Continue'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Z-Learn?
            </h2>
            <p className="text-xl text-gray-600">
              Designed specifically for Cameroonian students and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600 mb-4">
                We accept MTN Mobile Money, Orange Money, bank transfers, and major credit cards. All payments are processed securely.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I switch plans later?
              </h4>
              <p className="text-gray-600 mb-4">
                Yes! You can upgrade your plan at any time. Contact our support team for downgrades and we'll help you find the best solution.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Are the certificates recognized?
              </h4>
              <p className="text-gray-600 mb-4">
                Our certificates are recognized by employers across Cameroon and internationally. We partner with industry leaders to ensure relevance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a money-back guarantee?
              </h4>
              <p className="text-gray-600 mb-4">
                Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your learning experience, we'll refund your payment.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? Our support team is here to help.
          </p>
          <button 
            onClick={() => router.push('/support')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
};

export default PricingPage;
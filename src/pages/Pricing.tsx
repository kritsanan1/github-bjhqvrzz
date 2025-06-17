import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Check, Zap, Star, Clock, Palette } from 'lucide-react';
import PricingCalculator from '../components/pricing/PricingCalculator';
import StripeCheckout from '../components/pricing/StripeCheckout';

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'packages' | 'calculator'>('packages');
  
  // Mock user ID - in a real app, get this from auth context
  const userId = 'user_123'; // Replace with actual user ID from auth

  const packages = [
    {
      name: 'AI Design',
      price: 99,
      priceId: 'price_ai_design', // Replace with actual Stripe price ID
      description: 'Perfect for simple, AI-generated designs',
      features: [
        'AI-powered design generation',
        'Up to 5 design variations',
        'Basic customization options',
        'Digital design files',
        'Email support',
      ],
      color: 'from-gray-500 to-gray-600',
      popular: false,
      mode: 'payment' as const,
    },
    {
      name: 'Artist Collaboration',
      price: 299,
      priceId: 'price_artist_collab', // Replace with actual Stripe price ID
      description: 'AI concept refined by master artists',
      features: [
        'Everything in AI Design',
        'Artist refinement & enhancement',
        'Unlimited design revisions',
        'AR body placement preview',
        'Priority consultation',
        'Aftercare guidance',
      ],
      color: 'from-primary-500 to-primary-600',
      popular: true,
      mode: 'payment' as const,
    },
    {
      name: 'Premium Masterpiece',
      price: 599,
      priceId: 'price_premium', // Replace with actual Stripe price ID
      description: 'Complete end-to-end tattoo experience',
      features: [
        'Everything in Artist Collaboration',
        'Award-winning artist selection',
        'Premium tattoo session',
        'Professional photography',
        'Lifetime touch-up guarantee',
        '24/7 premium support',
      ],
      color: 'from-accent-500 to-accent-600',
      popular: false,
      mode: 'payment' as const,
    },
  ];

  const subscriptionPlans = [
    {
      name: 'Pro Monthly',
      price: 29,
      priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
      description: 'Monthly subscription for regular users',
      features: [
        '5,000 credits per month',
        'Unlimited AI generations',
        'Priority support',
        'Advanced customization',
        'Commercial license',
      ],
      mode: 'subscription' as const,
    },
    {
      name: 'Pro Yearly',
      price: 299,
      priceId: 'price_pro_yearly', // Replace with actual Stripe price ID
      description: 'Annual subscription with 2 months free',
      features: [
        '5,000 credits per month',
        'Unlimited AI generations',
        'Priority support',
        'Advanced customization',
        'Commercial license',
        '2 months free',
      ],
      mode: 'subscription' as const,
      popular: true,
    },
  ];

  const addOns = [
    { name: 'Rush Design (24h)', price: 50 },
    { name: 'Extra Design Variations (5)', price: 25 },
    { name: 'Color Consultation', price: 75 },
    { name: 'Size Adjustment Session', price: 40 },
  ];

  return (
    <div className="pt-16 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Transparent{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect package for your tattoo journey. All prices include AI design generation and expert consultation.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-1 bg-dark-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'packages'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star className="h-5 w-5" />
              <span>Packages</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calculator className="h-5 w-5" />
              <span>Calculator</span>
            </button>
          </div>
        </motion.div>

        {activeTab === 'packages' ? (
          <>
            {/* One-time Payment Packages */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">One-Time Packages</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border ${
                      pkg.popular ? 'border-primary-500' : 'border-gray-800'
                    } p-8 hover:border-primary-500/50 transition-all duration-300`}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Package Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                      <p className="text-gray-400 mb-4">{pkg.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">${pkg.price}</span>
                        <span className="text-gray-400 ml-2">one-time</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-accent-500 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <StripeCheckout
                      priceId={pkg.priceId}
                      userId={userId}
                      planName={pkg.name}
                      amount={pkg.price}
                      mode={pkg.mode}
                      className={pkg.popular 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/25'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                      }
                    >
                      Get Started
                    </StripeCheckout>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Subscription Plans</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {subscriptionPlans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className={`relative bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border ${
                      plan.popular ? 'border-primary-500' : 'border-gray-800'
                    } p-8 hover:border-primary-500/50 transition-all duration-300`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          Best Value
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400 ml-2">
                          /{plan.name.includes('Monthly') ? 'month' : 'year'}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-accent-500 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <StripeCheckout
                      priceId={plan.priceId}
                      userId={userId}
                      planName={plan.name}
                      amount={plan.price}
                      mode={plan.mode}
                      className={plan.popular 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/25'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                      }
                    >
                      Subscribe Now
                    </StripeCheckout>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-dark-800/30 to-dark-900/30 rounded-2xl border border-gray-800 p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Optional Add-ons
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {addOns.map((addon, index) => (
                  <div
                    key={index}
                    className="bg-dark-700/50 rounded-xl p-4 border border-gray-700 hover:border-primary-500/50 transition-colors"
                  >
                    <h4 className="text-white font-medium mb-2">{addon.name}</h4>
                    <p className="text-primary-400 font-bold">+${addon.price}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <PricingCalculator />
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: 'What\'s included in the AI design process?',
                answer: 'Our AI analyzes your preferences, style, and placement to generate unique concepts. You\'ll receive multiple variations and can request modifications.',
              },
              {
                question: 'How long does the design process take?',
                answer: 'AI generation is instant, but artist refinement typically takes 2-5 business days depending on complexity and your chosen package.',
              },
              {
                question: 'Can I see the tattoo on my body before committing?',
                answer: 'Yes! Our AR visualization technology lets you see exactly how your tattoo will look on your body before the final session.',
              },
              {
                question: 'What if I\'m not satisfied with the design?',
                answer: 'We offer unlimited revisions with our Artist Collaboration and Premium packages, plus a 100% satisfaction guarantee.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-dark-800/30 to-dark-900/30 rounded-xl border border-gray-800 p-6"
              >
                <h4 className="text-white font-semibold mb-3">{faq.question}</h4>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl border border-gray-800"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to start your tattoo journey?
          </h3>
          <p className="text-gray-300 mb-6">
            Book a free consultation to discuss your ideas and get a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
              Book Free Consultation
            </button>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-200">
              Start AI Design
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
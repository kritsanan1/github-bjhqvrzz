import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Palette, Users, Shield, Zap, Sparkles } from 'lucide-react';

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Design',
      description: 'Advanced machine learning algorithms create unique designs tailored to your vision and style preferences.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Palette,
      title: 'Master Artistry',
      description: 'Our certified artists refine AI concepts with traditional techniques, ensuring perfect execution.',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: Users,
      title: 'Collaborative Process',
      description: 'Real-time collaboration between you, AI, and artists throughout the entire design journey.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Every design undergoes rigorous quality checks and is backed by our satisfaction guarantee.',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Zap,
      title: 'Instant Visualization',
      description: 'See your tattoo on your body in real-time with AR visualization before committing.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Sparkles,
      title: 'Style Evolution',
      description: 'AI learns from your preferences and evolves designs to match your unique aesthetic vision.',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Revolutionary{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the perfect fusion of artificial intelligence and artistic mastery, 
            creating tattoos that are uniquely yours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-8 bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full backdrop-blur-sm">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
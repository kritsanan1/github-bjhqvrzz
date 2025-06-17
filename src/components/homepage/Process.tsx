import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Palette, Eye, Sparkles } from 'lucide-react';

const Process: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: Brain,
      title: 'AI Concept Generation',
      description: 'Our advanced AI analyzes your preferences, style, and placement to generate unique concept designs.',
      features: ['Style analysis', 'Placement optimization', 'Personal preference learning'],
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Palette,
      title: 'Artist Collaboration',
      description: 'Master tattoo artists refine the AI concept, adding human creativity and technical expertise.',
      features: ['Professional refinement', 'Technical optimization', 'Artistic enhancement'],
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: Eye,
      title: 'Real-time Visualization',
      description: 'See your tattoo on your body using AR technology before making the final commitment.',
      features: ['AR body mapping', 'Size adjustment', 'Placement preview'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Sparkles,
      title: 'Masterpiece Creation',
      description: 'Our certified artists bring your AI-enhanced design to life with precision and artistry.',
      features: ['Expert execution', 'Quality assurance', 'Aftercare guidance'],
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Our Design{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the revolutionary four-step process that combines AI innovation 
            with master artistry to create your perfect tattoo.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transform -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
                    </div>
                  </div>

                  <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} inline-flex`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="text-sm text-gray-500 flex items-center justify-center space-x-2"
                        >
                          <div className="w-1 h-1 bg-primary-500 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow (Desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent"
                      />
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-primary-500 border-t-2 border-t-transparent border-b-2 border-b-transparent" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <motion.button
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Journey</span>
            <Sparkles className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
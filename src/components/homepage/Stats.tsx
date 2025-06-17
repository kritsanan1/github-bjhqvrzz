import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Stats: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [counts, setCounts] = useState({
    designs: 0,
    artists: 0,
    satisfaction: 0,
    awards: 0,
  });

  const targets = {
    designs: 5000,
    artists: 15,
    satisfaction: 99,
    awards: 12,
  };

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      Object.keys(targets).forEach((key) => {
        const target = targets[key as keyof typeof targets];
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounts(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, interval);
      });
    }
  }, [inView]);

  const stats = [
    {
      value: counts.designs.toLocaleString(),
      suffix: '+',
      label: 'AI Designs Created',
      description: 'Unique tattoo concepts generated',
    },
    {
      value: counts.artists.toString(),
      suffix: '',
      label: 'Master Artists',
      description: 'AI-certified professionals',
    },
    {
      value: counts.satisfaction.toString(),
      suffix: '%',
      label: 'Satisfaction Rate',
      description: 'Happy clients worldwide',
    },
    {
      value: counts.awards.toString(),
      suffix: '',
      label: 'Industry Awards',
      description: 'Recognition for innovation',
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5" />
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-primary-500/30 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our innovative approach has earned recognition and trust from clients and industry professionals worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative p-8 bg-gradient-to-br from-dark-800/30 to-dark-900/30 rounded-2xl border border-gray-800 hover:border-primary-500/50 transition-all duration-300 backdrop-blur-sm">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Number */}
                <div className="relative">
                  <motion.div
                    className="text-4xl lg:text-5xl font-display font-bold mb-2"
                    animate={inView ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
                      {stat.value}{stat.suffix}
                    </span>
                  </motion.div>
                  
                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {stat.label}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-400">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
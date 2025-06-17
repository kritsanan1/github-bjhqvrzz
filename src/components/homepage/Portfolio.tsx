import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Heart, Share2 } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Work' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'realistic', label: 'Realistic' },
    { id: 'abstract', label: 'Abstract' },
  ];

  const portfolio = [
    {
      id: 1,
      title: 'Dragon Phoenix Fusion',
      category: 'traditional',
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=500',
      aiConcept: 'https://images.pexels.com/photos/3532557/pexels-photo-3532557.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 342,
    },
    {
      id: 2,
      title: 'Sacred Geometry Mandala',
      category: 'geometric',
      image: 'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&cs=tinysrgb&w=500',
      aiConcept: 'https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 287,
    },
    {
      id: 3,
      title: 'Portrait Realism',
      category: 'realistic',
      image: 'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=500',
      aiConcept: 'https://images.pexels.com/photos/3532553/pexels-photo-3532553.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 425,
    },
    {
      id: 4,
      title: 'Abstract Flow',
      category: 'abstract',
      image: 'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=500',
      aiConcept: 'https://images.pexels.com/photos/3532554/pexels-photo-3532554.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 198,
    },
    {
      id: 5,
      title: 'Neo-Traditional Rose',
      category: 'traditional',
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=500',
      aiConcept: 'https://images.pexels.com/photos/3532555/pexels-photo-3532555.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 356,
    },
    {
      id: 6,
      title: 'Minimalist Geometry',
      category: 'geometric',
      image: 'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&cs=tinysrgb&w=500',
      aiConcept: 'https://images.pexels.com/photos/3532556/pexels-photo-3532556.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 271,
    },
  ];

  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter);

  return (
    <section ref={ref} className="py-24 bg-dark-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Featured{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover the incredible transformation from AI concept to masterpiece tattoo, 
            showcasing the perfect blend of technology and artistry.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredPortfolio.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300"
              >
                {/* Before/After Images */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 flex">
                    {/* AI Concept */}
                    <div className="relative w-1/2 overflow-hidden">
                      <img
                        src={item.aiConcept}
                        alt="AI Concept"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        AI Concept
                      </div>
                    </div>
                    
                    {/* Final Tattoo */}
                    <div className="relative w-1/2 overflow-hidden border-l border-gray-700">
                      <img
                        src={item.image}
                        alt="Final Tattoo"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 bg-accent-500 text-dark-900 text-xs px-2 py-1 rounded font-medium">
                        Final Result
                      </div>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-dark-800/80 rounded-full text-white hover:bg-primary-500 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-dark-800/80 rounded-full text-white hover:bg-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-dark-800/80 rounded-full text-white hover:bg-blue-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Heart className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View Full Gallery</span>
            <ExternalLink className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
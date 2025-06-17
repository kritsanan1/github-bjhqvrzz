import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, Share2, Eye } from 'lucide-react';

const Gallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Styles' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'realistic', label: 'Realistic' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'minimalist', label: 'Minimalist' },
  ];

  const tattoos = [
    {
      id: 1,
      title: 'Dragon Phoenix Fusion',
      artist: 'Maya Chen',
      style: 'traditional',
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600',
      aiConcept: 'https://images.pexels.com/photos/3532557/pexels-photo-3532557.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 342,
      views: 1240,
      description: 'A stunning fusion of Eastern mythology featuring intricate dragon and phoenix elements.',
      tags: ['dragon', 'phoenix', 'mythology', 'color'],
    },
    {
      id: 2,
      title: 'Sacred Geometry Mandala',
      artist: 'Alex Rodriguez',
      style: 'geometric',
      image: 'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&cs=tinysrgb&w=600',
      aiConcept: 'https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 287,
      views: 892,
      description: 'Precise geometric patterns creating a mesmerizing mandala design.',
      tags: ['mandala', 'sacred geometry', 'symmetry', 'blackwork'],
    },
    {
      id: 3,
      title: 'Portrait Realism',
      artist: 'Sarah Johnson',
      style: 'realistic',
      image: 'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=600',
      aiConcept: 'https://images.pexels.com/photos/3532553/pexels-photo-3532553.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 425,
      views: 1567,
      description: 'Hyperrealistic portrait capturing every detail with stunning precision.',
      tags: ['portrait', 'realism', 'black and gray', 'detailed'],
    },
  ];

  const filteredTattoos = tattoos.filter(tattoo => {
    const matchesFilter = activeFilter === 'all' || tattoo.style === activeFilter;
    const matchesSearch = tattoo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tattoo.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tattoo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
            Smart{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our AI-enhanced portfolio showcasing the perfect fusion of technology and artistry.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, artist, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-dark-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Content */}
        <motion.div
          layout
          className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}
        >
          {filteredTattoos.map((tattoo, index) => (
            <motion.div
              key={tattoo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Image Section */}
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'aspect-square'}`}>
                <img
                  src={tattoo.image}
                  alt={tattoo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* AI Concept Overlay */}
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                  AI Enhanced
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1 bg-dark-900/80 text-white text-xs px-2 py-1 rounded">
                    <Heart className="h-3 w-3" />
                    <span>{tattoo.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-dark-900/80 text-white text-xs px-2 py-1 rounded">
                    <Eye className="h-3 w-3" />
                    <span>{tattoo.views}</span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button className="p-3 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {tattoo.title}
                </h3>
                <p className="text-gray-400 mb-3">by {tattoo.artist}</p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {tattoo.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tattoo.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-dark-700 text-gray-300 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="capitalize">{tattoo.style}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{tattoo.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{tattoo.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
            Load More Designs
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;
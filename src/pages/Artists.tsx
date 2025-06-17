import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Award, Instagram, ExternalLink } from 'lucide-react';

const Artists: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);

  const artists = [
    {
      id: 1,
      name: 'Maya Chen',
      specialization: 'Traditional & Neo-Traditional',
      experience: '8 years',
      rating: 4.9,
      reviews: 156,
      location: 'Studio Downtown',
      image: 'https://images.pexels.com/photos/3532551/pexels-photo-3532551.jpeg?auto=compress&cs=tinysrgb&w=400',
      portfolio: [
        'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=300',
      ],
      certifications: ['AI Design Certified', 'Advanced Color Theory', 'Master Traditional'],
      bio: 'Maya specializes in bringing AI concepts to life with traditional tattooing techniques. Her unique approach blends modern technology with classic artistry.',
      instagram: '@maya_ink_art',
      availability: 'Available',
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      specialization: 'Geometric & Abstract',
      experience: '6 years',
      rating: 4.8,
      reviews: 98,
      location: 'Studio Uptown',
      image: 'https://images.pexels.com/photos/3532554/pexels-photo-3532554.jpeg?auto=compress&cs=tinysrgb&w=400',
      portfolio: [
        'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&cs=tinysrgb&w=300',
      ],
      certifications: ['AI Integration Expert', 'Sacred Geometry', 'Precision Linework'],
      bio: 'Alex creates stunning geometric designs using AI-assisted precision. Known for perfect symmetry and mathematical beauty in every piece.',
      instagram: '@alex_geometric_ink',
      availability: 'Booking 2 weeks out',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      specialization: 'Realistic Portraits',
      experience: '10 years',
      rating: 5.0,
      reviews: 203,
      location: 'Studio Central',
      image: 'https://images.pexels.com/photos/3532555/pexels-photo-3532555.jpeg?auto=compress&cs=tinysrgb&w=400',
      portfolio: [
        'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300',
      ],
      certifications: ['Master Realism', 'AI Portrait Enhancement', 'Award Winner 2023'],
      bio: 'Sarah is our lead portrait artist, combining AI precision with hand-crafted realism. Her work has won multiple industry awards.',
      instagram: '@sarah_portrait_ink',
      availability: 'Booking 4 weeks out',
    },
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
            Master{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Artists
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet our AI-certified master artists who bring your digital concepts to life with unmatched skill and precision.
          </p>
        </motion.div>

        {/* Artists Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 overflow-hidden hover:border-primary-500/50 transition-all duration-300"
            >
              {/* Artist Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                
                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    artist.availability === 'Available' 
                      ? 'bg-accent-500 text-dark-900' 
                      : 'bg-orange-500 text-white'
                  }`}>
                    {artist.availability}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-dark-900/80 rounded-lg px-3 py-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-white font-medium">{artist.rating}</span>
                  <span className="text-gray-300 text-sm">({artist.reviews})</span>
                </div>
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{artist.name}</h3>
                <p className="text-primary-400 font-medium mb-1">{artist.specialization}</p>
                <p className="text-gray-400 text-sm mb-4">{artist.experience} experience</p>

                {/* Bio */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{artist.bio}</p>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{artist.location}</span>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.certifications.slice(0, 2).map((cert, idx) => (
                    <span
                      key={idx}
                      className="flex items-center space-x-1 text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded"
                    >
                      <Award className="h-3 w-3" />
                      <span>{cert}</span>
                    </span>
                  ))}
                </div>

                {/* Portfolio Preview */}
                <div className="flex space-x-2 mb-4">
                  {artist.portfolio.slice(0, 3).map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`Portfolio ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Book Consultation
                  </button>
                  <button className="p-3 bg-dark-700 text-gray-300 rounded-xl hover:bg-dark-600 hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedArtist(selectedArtist === artist.id ? null : artist.id)}
                    className="p-3 bg-dark-700 text-gray-300 rounded-xl hover:bg-dark-600 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedArtist === artist.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-800 p-6 bg-dark-900/50"
                >
                  <h4 className="text-white font-semibold mb-3">All Certifications</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {artist.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="flex items-center space-x-1 text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded"
                      >
                        <Award className="h-3 w-3" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="text-white font-semibold mb-3">Full Portfolio</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {artist.portfolio.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Portfolio ${idx + 1}`}
                        className="aspect-square object-cover rounded-lg border border-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl border border-gray-800"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Can't decide? Let us help you choose!
          </h3>
          <p className="text-gray-300 mb-6">
            Our AI matching system can recommend the perfect artist based on your design preferences and style.
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
            Find My Perfect Artist
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Artists;
// src/pages/Reviews.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Reviews = () => {
  const reviews = [
    { id: 1, name: 'Alice', rating: 5, comment: 'Amazing experience! Highly recommend.' },
    { id: 2, name: 'Bob', rating: 4, comment: 'Really helpful service and easy to use.' },
    { id: 3, name: 'Charlie', rating: 5, comment: 'Loved the design and usability!' },
    { id: 4, name: 'Dana', rating: 3, comment: 'It was okay, could be improved.' },
    { id: 5, name: 'Eve', rating: 4, comment: 'Very intuitive and user-friendly platform.' },
  ];

  // Framer Motion container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-blue-700 to-cyan-600 p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12 drop-shadow-lg">
        What Our Users Are Saying
      </h1>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {reviews.map(review => (
          <motion.div
            key={review.id}
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: '0px 15px 25px rgba(255,255,255,0.2)' }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 text-white font-bold mr-4 shadow-lg">
                {review.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{review.name}</h2>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="mr-1 text-xl">⭐</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-12 text-center text-white/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>© 2025 Matty by Global Next Consulting India Pvt Ltd</p>
      </motion.div>
    </div>
  );
};

export default Reviews;

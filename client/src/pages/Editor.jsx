import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CanvasEditor from '../components/CanvasEditor';

const Editor = () => {
  const { id } = useParams();
  const [designData, setDesignData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (id) {
      fetch(`http://localhost:5000/api/designs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch design');
          return res.json();
        })
        .then((data) => {
          setDesignData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setDesignData({});
          setLoading(false);
        });
    } else {
      setDesignData({}); // Optional: blank design if no ID
      setLoading(false);
    }
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100 p-6 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Floating background accent blobs */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl z-0"
        animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-60 h-60 bg-yellow-400 rounded-full opacity-20 blur-3xl z-0"
        animate={{ y: [0, -20, 0], x: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      />

      {/* Header */}
    

      {/* Loader or Error */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <motion.div
            className="w-24 h-24 border-4 border-t-pink-500 border-gray-600 rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      ) : error ? (
        <motion.div
          className="text-red-400 text-center py-20 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Error: {error}
        </motion.div>
      ) : (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* CanvasEditor */}
          <CanvasEditor initialData={designData || {}} />
        </motion.div>
      )}

      {/* Footer Note */}
      <motion.div
        className="absolute bottom-4 w-full text-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        🎨 Your creations are auto-saved as you work!
      </motion.div>
    </motion.div>
  );
};

export default Editor;

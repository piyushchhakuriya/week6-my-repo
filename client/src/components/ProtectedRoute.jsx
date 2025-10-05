import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="inline-flex space-x-3">
        <motion.div
          className="w-4 h-4 md:w-5 md:h-5 bg-yellow-400 rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
        />
        <motion.div
          className="w-4 h-4 md:w-5 md:h-5 bg-pink-400 rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
        />
        <motion.div
          className="w-4 h-4 md:w-5 md:h-5 bg-purple-400 rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
        />
      </div>
      <motion.p
        className="mt-6 text-white text-lg md:text-xl font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Loading your dashboard...
      </motion.p>
    </motion.div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setRedirecting(true);
      const timer = setTimeout(() => {}, 800); // Optional delay
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated)
    return redirecting ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.p
          className="text-white text-lg md:text-xl font-semibold animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Redirecting to login...
        </motion.p>
      </div>
    ) : (
      <Navigate to="/login" replace />
    );

  // Fade-in effect for protected pages
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;

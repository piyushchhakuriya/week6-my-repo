// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Github, Mail as MailIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const response = await authAPI.login({ email: formData.email, password: formData.password });
      login(response.user, response.token);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-600 to-cyan-500"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Floating abstract blobs */}
      <motion.div className="absolute w-96 h-96 bg-purple-500/20 rounded-full top-0 -left-20"
        animate={{ y: [0, 50, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute w-80 h-80 bg-blue-400/20 rounded-full bottom-0 -right-16"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <motion.h1
            className="text-6xl font-black text-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Matty
          </motion.h1>
        </div>
        <p className="text-center text-white/70 mb-6">Online Graphic Design Tool</p>

        {apiError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
          >
            {apiError}
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <motion.div className="relative">
            <label className="absolute -top-3 left-3 text-xs text-white/80 bg-white/20 px-1 rounded">Email</label>
            <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-white/40'} rounded-xl bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 outline-none transition`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </motion.div>

          {/* Password */}
          <motion.div className="relative">
            <label className="absolute -top-3 left-3 text-xs text-white/80 bg-white/20 px-1 rounded">Password</label>
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-white/40'} rounded-xl bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 outline-none transition`}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </motion.div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-white/70 hover:text-white font-medium">Forgot Password?</Link>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        {/* OR separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/30"></div>
          <span className="px-4 text-white/50 text-sm">OR</span>
          <div className="flex-1 border-t border-white/30"></div>
        </div>

        {/* Social buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 border border-white/40 rounded-xl text-white hover:bg-white/20 transition"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" /> Google
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 border border-white/40 rounded-xl text-white hover:bg-white/20 transition"
          >
            <Github size={20} /> GitHub
          </motion.button>
        </div>

        <div className="mt-6 text-center text-white/70">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-4 text-center w-full text-white/50 text-sm">
        <p>© 2025 Matty by Global Next Consulting India Pvt Ltd</p>
      </div>
    </div>
  );
};

export default Login;

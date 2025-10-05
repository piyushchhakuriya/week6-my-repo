// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Mail as MailIcon, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.token) {
        login(response.user, response.token);
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setSuccessMessage('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
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
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-600 to-cyan-500"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Floating blobs */}
      <motion.div className="absolute w-96 h-96 bg-purple-500/20 rounded-full top-0 -left-20"
        animate={{ y: [0, 50, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute w-80 h-80 bg-blue-400/20 rounded-full bottom-0 -right-16"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Register card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10"
      >
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

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <label className="absolute -top-3 left-3 text-xs text-white/80 bg-white/20 px-1 rounded">Username</label>
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border ${errors.username ? 'border-red-500' : 'border-white/40'} rounded-xl bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 outline-none transition`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="relative">
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
          </div>

          {/* Password */}
          <div className="relative">
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
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="absolute -top-3 left-3 text-xs text-white/80 bg-white/20 px-1 rounded">Confirm Password</label>
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/40'} rounded-xl bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 outline-none transition`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        {/* OR separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/30"></div>
          <span className="px-4 text-white/50 text-sm">OR</span>
          <div className="flex-1 border-t border-white/30"></div>
        </div>

        {/* Social login buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 border border-white/40 rounded-xl text-white hover:bg-white/20 transition"
            onClick={() => alert('Google OAuth integration needed')}
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
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-4 text-center w-full text-white/50 text-sm">
        <p>© 2025 Matty by Global Next Consulting India Pvt Ltd</p>
      </div>
    </div>
  );
};

export default Register;

//Register.tsx
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { register, socialLogin, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    // Reset error
    setError('');

    // Validate name
    if (!name.trim()) {
      setError('Full name is required.');
      return false;
    }

    if (name.trim().length < 2) {
      setError('Full name must be at least 2 characters long.');
      return false;
    }

    // Validate email
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Validate password
    if (!password) {
      setError('Password is required.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(name, email, password, phone);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Could not create account. Please try again.';
      setError(errorMessage);
      toast.error('Registration failed. Please check your details.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      await socialLogin(provider);
      toast.success(`Successfully signed up with ${provider}!`);
      navigate('/');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Could not sign up with ${provider}. Please try again.`;
      setError(errorMessage);
      toast.error(`${provider} signup failed.`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-playfair text-center flex-1 mr-8">
          Create Account
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="flex flex-col justify-center">
          <div className="text-center mb-8">
            <img
              src="/lovable-uploads/50d770e8-285d-4eea-b8bc-8fa0af1d3b87.png"
              alt="Parkside Plaza Hotel"
              className="h-16 mx-auto mb-4"
            />
            <p className="text-gray-600">
              Join us to enjoy exclusive benefits and rewards
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              {password && password.length < 6 && (
                <p className="text-xs text-amber-600 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsCheckbox"
                required
                className="mt-1 h-4 w-4 border-gray-300 rounded text-hotel-burgundy focus:ring-hotel-burgundy focus:ring-2"
              />
              <label
                htmlFor="termsCheckbox"
                className="text-sm text-gray-600 leading-relaxed"
              >
                I agree to the{' '}
                <a href="#" className="text-hotel-burgundy hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-hotel-burgundy hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hotel-burgundy text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin('google')}
                className="py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('apple')}
                className="py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/494552/apple.svg"
                  alt="Apple"
                  className="w-5 h-5"
                />
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-hotel-burgundy font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

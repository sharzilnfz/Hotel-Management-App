import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, AlertCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { CountrySelector } from "@/components/ui/country-selector";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    socialLogin,
    isLoading
  } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Mobile number is required.");
      return;
    }
    
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError("Could not create account. Please try again.");
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      await socialLogin(provider);
      navigate("/");
    } catch (err) {
      setError(`Could not sign up with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center mb-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-playfair text-center flex-1 mr-8 text-hotel-burgundy-dark">Create Account</h1>
      </div>

      <motion.div 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.5
        }} 
        className="max-w-md mx-auto"
      >
        <div className="flex flex-col justify-center">
          <div className="text-center mb-8">
            <img src="/lovable-uploads/50d770e8-285d-4eea-b8bc-8fa0af1d3b87.png" alt="Parkside Plaza Hotel" className="h-16 mx-auto mb-4" />
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
                Mobile Number
              </label>
              <div className="flex gap-2">
                <CountrySelector 
                  value={countryCode} 
                  onValueChange={setCountryCode} 
                />
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="tel" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required 
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent" 
                    placeholder="123 456 7890" 
                  />
                </div>
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
            </div>

            <div className="flex items-start">
              <input type="checkbox" id="termsCheckbox" required className="mt-1 border-gray-300 rounded text-hotel-burgundy focus:ring-hotel-burgundy" />
              <label htmlFor="termsCheckbox" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-hotel-burgundy">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-hotel-burgundy">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-hotel-burgundy text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
              <button onClick={() => handleSocialLogin("google")} className="py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button onClick={() => handleSocialLogin("apple")} className="py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                <img src="https://www.svgrepo.com/show/494552/apple.svg" alt="Apple" className="w-5 h-5" />
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-hotel-burgundy font-medium">
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

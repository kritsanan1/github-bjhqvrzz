import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Zap, Shield, AlertTriangle } from 'lucide-react';
import { useSecureForm } from '../hooks/useSecureForm';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '../utils/validation';
import SecureInput from '../components/ui/SecureInput';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useSecureForm<LoginFormData>({
    schema: loginSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Login:', data);
        // Handle successful login
      } finally {
        setIsLoading(false);
      }
    },
    rateLimitKey: 'login',
    maxAttempts: 3
  });

  const registerForm = useSecureForm<RegisterFormData>({
    schema: registerSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Register:', data);
        // Handle successful registration
      } finally {
        setIsLoading(false);
      }
    },
    rateLimitKey: 'register',
    maxAttempts: 3
  });

  const currentForm = isLogin ? loginForm : registerForm;

  return (
    <div className="pt-16 min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-8 backdrop-blur-sm"
        >
          {/* Security Badge */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm">
              <Shield className="h-4 w-4" />
              <span>Secure Authentication</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Zap className="h-12 w-12 text-primary-500" />
                <div className="absolute inset-0 bg-primary-500 blur-sm opacity-50" />
              </div>
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join InkAI Studio'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to continue your tattoo journey' 
                : 'Create your account to start designing'
              }
            </p>
          </div>

          {/* Rate Limit Warning */}
          {currentForm.isRateLimited && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">
                  Too many attempts. Please wait before trying again.
                </span>
              </div>
              <button
                onClick={currentForm.resetRateLimit}
                className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
              >
                Reset (for demo purposes)
              </button>
            </motion.div>
          )}

          {/* Attempt Counter */}
          {currentForm.submitAttempts > 0 && !currentForm.isRateLimited && (
            <div className="mb-4 text-center text-sm text-gray-400">
              Attempts: {currentForm.submitAttempts}/{currentForm.maxAttempts}
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="flex space-x-1 bg-dark-900/50 rounded-lg p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit} className="space-y-6">
                <SecureInput
                  label="Email Address"
                  type="email"
                  icon={<Mail className="h-5 w-5" />}
                  placeholder="Enter your email"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                  required
                />

                <SecureInput
                  label="Password"
                  type="password"
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="Enter your password"
                  showPasswordToggle
                  sanitize={false}
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                  required
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...loginForm.register('rememberMe')}
                      className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-300">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || currentForm.isRateLimited}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit} className="space-y-6">
                <SecureInput
                  label="Full Name"
                  type="text"
                  icon={<User className="h-5 w-5" />}
                  placeholder="Enter your full name"
                  error={registerForm.formState.errors.name?.message}
                  {...registerForm.register('name')}
                  required
                />

                <SecureInput
                  label="Email Address"
                  type="email"
                  icon={<Mail className="h-5 w-5" />}
                  placeholder="Enter your email"
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register('email')}
                  required
                />

                <SecureInput
                  label="Password"
                  type="password"
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="Create a password"
                  showPasswordToggle
                  sanitize={false}
                  error={registerForm.formState.errors.password?.message}
                  {...registerForm.register('password')}
                  required
                />

                <SecureInput
                  label="Confirm Password"
                  type="password"
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="Confirm your password"
                  showPasswordToggle
                  sanitize={false}
                  error={registerForm.formState.errors.confirmPassword?.message}
                  {...registerForm.register('confirmPassword')}
                  required
                />

                {/* Terms */}
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...registerForm.register('agreeToTerms')}
                    className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the{' '}
                    <button type="button" className="text-primary-400 hover:text-primary-300 transition-colors">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-primary-400 hover:text-primary-300 transition-colors">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {registerForm.formState.errors.agreeToTerms && (
                  <p className="text-red-400 text-sm">
                    {registerForm.formState.errors.agreeToTerms.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || currentForm.isRateLimited}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Form Errors */}
          {currentForm.formState.errors.root && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{currentForm.formState.errors.root.message}</span>
              </div>
            </motion.div>
          )}

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg bg-dark-700 text-sm font-medium text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button 
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg bg-dark-700 text-sm font-medium text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="ml-2">Twitter</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
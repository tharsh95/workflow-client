// import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Social media icons
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5a4.38 4.38 0 0 0-2.91 1.5 4.13 4.13 0 0 0-1.03 2.96c2.23.17 4.01-1.11 4.01-1.11s-.51.29-1.13-.66zm2.42 7.31v9a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75v-9h10.5zM7.39 4.93l.05-.14C8.01 2.73 9.75 1 11.83 1c.03 0 .06 0 .09.01 1.67 0 2.94.89 3.48 1.59.5.65.8 1.31.96 1.82.03.1.06.19.07.27.02.06.03.12.04.18.04.21.06.42.06.63 0 .28-.05.57-.14.84-.1.29-.23.57-.41.82-.17.25-.38.47-.62.66-.24.19-.51.34-.8.45-.29.11-.6.17-.92.17-.31 0-.61-.05-.89-.16-.28-.11-.54-.26-.77-.45-.23-.19-.42-.42-.57-.67-.15-.25-.26-.52-.33-.81-.07-.29-.1-.58-.1-.88 0-.29.04-.58.11-.86.08-.28.19-.55.34-.79.15-.24.33-.46.55-.64.22-.18.46-.33.73-.43.27-.1.55-.15.85-.15.29 0 .57.05.84.14.27.09.51.23.73.4.22.17.4.38.54.61.14.23.24.49.3.75.06.26.08.53.08.8 0 .26-.03.52-.1.77-.07.25-.16.48-.29.7-.13.22-.28.41-.46.58-.18.17-.38.3-.6.4-.22.1-.45.15-.7.15-.24 0-.48-.04-.7-.13-.22-.09-.42-.21-.6-.37-.18-.16-.32-.35-.43-.56-.11-.21-.18-.44-.22-.68-.04-.24-.05-.48-.03-.73.02-.25.07-.49.15-.73.08-.24.19-.46.33-.67.14-.21.31-.39.5-.55.19-.16.41-.28.64-.37.23-.09.48-.13.73-.13.25 0 .5.04.73.13.23.09.45.21.64.37.19.16.36.34.5.55.14.21.25.43.33.67.08.24.13.48.15.73.02.25.01.49-.03.73-.04.24-.11.47-.22.68-.11.21-.25.4-.43.56-.18.16-.38.28-.6.37-.22.09-.46.13-.7.13-.25 0-.48-.05-.7-.15-.22-.1-.42-.23-.6-.4-.18-.17-.33-.36-.46-.58-.13-.22-.22-.45-.29-.7-.07-.25-.1-.51-.1-.77 0-.27.02-.54.08-.8.06-.26.16-.52.3-.75.14-.23.32-.44.54-.61.22-.17.46-.31.73-.4.27-.09.55-.14.84-.14.3 0 .58.05.85.15.27.1.51.25.73.43.22.18.4.4.55.64.15.24.26.51.34.79.07.28.11.57.11.86 0 .3-.03.59-.1.88-.07.29-.18.56-.33.81-.15.25-.34.48-.57.67-.23.19-.49.34-.77.45-.28.11-.58.16-.89.16-.32 0-.63-.06-.92-.17-.29-.11-.56-.26-.8-.45-.24-.19-.45-.41-.62-.66-.18-.25-.31-.53-.41-.82-.09-.27-.14-.56-.14-.84 0-.21.02-.42.06-.63.01-.06.02-.12.04-.18.01-.08.04-.17.07-.27.16-.51.46-1.17.96-1.82.54-.7 1.81-1.59 3.48-1.59.03-.01.06-.01.09-.01 2.08 0 3.82 1.73 4.39 3.79l.05.14h-1.03z"
    />
  </svg>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // The login function will handle setting the auth cookie
      const success = await login(email, password);
      
      
      if (success.success) {
        // Redirect to dashboard on success
        navigate('/dashboard');
      } else {
        // Display error message from context
        setErrorMessage(success.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left side with background and branding */}
      <div className="flex-1 bg-[#1B4332] relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)",
          backgroundSize: '100px 100px',
          opacity: 0.2
        }} />
        <div className="relative z-10 p-12">
          <h1 className="text-white text-4xl font-bold mb-24">HighBridge</h1>
          <h2 className="text-white text-5xl font-bold mb-6">
            Welcome Back
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Sign in to access your workflows and continue building powerful automations.
          </p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">SIGN IN</h2>
            <h3 className="text-3xl font-bold">Access Your Account</h3>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-6">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={() => {/* TODO: Implement Google login */}}
              >
                <GoogleIcon />
                <span className="ml-3">Sign in with Google</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={() => {/* TODO: Implement Facebook login */}}
              >
                <FacebookIcon />
                <span className="ml-3">Sign in with Facebook</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                onClick={() => {/* TODO: Implement Apple login */}}
              >
                <AppleIcon />
                <span className="ml-3">Sign in with Apple</span>
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
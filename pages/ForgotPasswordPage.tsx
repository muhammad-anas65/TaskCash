
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { sendPasswordResetLink } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // The function returns true on "success" (even if user doesn't exist, for security)
    const success = sendPasswordResetLink(email);
    if(success) {
        setMessage('If an account with that email exists, a password reset link has been sent. Please check your console.');
    } else {
        // This part should ideally not be reached if we always return true
        setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email to receive a reset link.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && <p className="text-sm text-center text-green-600 dark:text-green-400">{message}</p>}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary-600 group hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Send Reset Link
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
          <Link
            to="/"
            className="inline-flex items-center font-medium text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

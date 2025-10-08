
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      const success = signup(email, password);
      if (!success) {
        setError('An account with this email already exists.');
      }
    }
  };
  
  const toggleForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsLogin(!isLogin);
      setError(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
  }

  return (
    <div className="flex items-stretch justify-center min-h-screen text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          Task<span className="font-light">Cash</span>
        </h1>
        <p className="mt-4 text-xl text-primary-200">Turn your time into money. Complete simple tasks and get paid.</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center w-full p-4 lg:w-1/2 sm:p-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
          <div className="text-center">
            <div className="lg:hidden mb-6">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Task<span className="font-light text-primary-600">Cash</span>
                </h1>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? 'Welcome back to TaskCash!' : 'Get started in just a few clicks.'}
            </p>
          </div>
          
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="w-full py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            {!isLogin && (
                 <div className="relative">
                    <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="w-full py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 dark:hover:text-gray-300">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            )}
            
            {error && <p className="text-xs text-center text-red-500">{error}</p>}
            
             {isLogin && (
                <div className="text-sm text-right">
                    <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                    </Link>
                </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-bold text-white transition-all duration-300 border border-transparent rounded-lg shadow-lg bg-primary-600 group hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-105"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <a
              href="#"
              onClick={toggleForm}
              className="ml-1 font-medium text-primary-600 hover:text-primary-500"
            >
              {isLogin ? "Sign Up" : 'Sign In'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        const emailParam = params.get('email');
        if (tokenParam && emailParam) {
            setToken(tokenParam);
            setEmail(emailParam);
        } else {
            setError('Invalid password reset link.');
        }
    }, [location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (email && token) {
            const success = resetPassword(email, token, password);
            if (success) {
                setMessage('Your password has been reset successfully. You can now log in.');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError('Invalid or expired token. Please request a new password reset link.');
            }
        }
    };

    if (!token || !email) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-md p-8 space-y-4 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
                     <h1 className="text-xl font-bold text-red-500">Invalid Link</h1>
                     <p className="text-gray-600 dark:text-gray-400">{error || 'The password reset link is missing required information.'}</p>
                     <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">Request a new link</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Your Password</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Enter your new password below.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                         <div>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && <p className="text-sm text-center text-green-600 dark:text-green-400">{message}</p>}
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}

                    <div>
                        <button
                        type="submit"
                        className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary-600 group hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                        Update Password
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

export default ResetPasswordPage;

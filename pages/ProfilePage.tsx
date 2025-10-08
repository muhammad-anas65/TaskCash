
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { User as UserIcon, Phone, Wallet, Save } from 'lucide-react';
import { User } from '../types';

type PaymentMethod = 'PayPal' | 'Easypaisa' | 'JazzCash';

const ProfilePage: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const [profile, setProfile] = useState<Partial<User>>({
        paymentFullName: '',
        mobileNumber: '',
        preferredPaymentMethod: 'PayPal',
        paymentDetails: '',
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                paymentFullName: user.paymentFullName || '',
                mobileNumber: user.mobileNumber || '',
                preferredPaymentMethod: user.preferredPaymentMethod || 'PayPal',
                paymentDetails: user.paymentDetails || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (updateUserProfile) {
            updateUserProfile(profile);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
        }
    };

    const getPaymentDetailsLabel = (method: PaymentMethod | undefined) => {
        switch (method) {
            case 'PayPal':
                return 'PayPal Email';
            case 'Easypaisa':
            case 'JazzCash':
                return 'Account Number';
            default:
                return 'Payment Details';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Payment</h1>
            <div className="max-w-2xl p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Update Your Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="paymentFullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name (as on payment account)</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="paymentFullName"
                                name="paymentFullName"
                                value={profile.paymentFullName}
                                onChange={handleChange}
                                className="w-full py-2 pl-10 pr-3 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={profile.mobileNumber}
                                onChange={handleChange}
                                className="w-full py-2 pl-10 pr-3 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g. 03001234567"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label htmlFor="preferredPaymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Payment Method</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Wallet className="w-5 h-5 text-gray-400" />
                            </div>
                            <select
                                id="preferredPaymentMethod"
                                name="preferredPaymentMethod"
                                value={profile.preferredPaymentMethod}
                                onChange={handleChange}
                                className="w-full py-2 pl-10 pr-8 border-gray-300 rounded-md appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="PayPal">PayPal</option>
                                <option value="Easypaisa">Easypaisa</option>
                                <option value="JazzCash">JazzCash</option>
                            </select>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <label htmlFor="paymentDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getPaymentDetailsLabel(profile.preferredPaymentMethod as PaymentMethod)}
                        </label>
                        <input
                            type="text"
                            id="paymentDetails"
                            name="paymentDetails"
                            value={profile.paymentDetails}
                            onChange={handleChange}
                            className="w-full mt-1 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={`Enter your ${getPaymentDetailsLabel(profile.preferredPaymentMethod as PaymentMethod)}`}
                            required
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-end pt-2">
                        {isSaved && <p className="mr-4 text-sm text-green-600 transition-opacity duration-300 dark:text-green-400">Profile saved!</p>}
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 font-bold text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
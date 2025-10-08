import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckSquare, Gift, Star } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close tutorial"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-full bg-primary-600">
                <Star className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {userName}!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Here's a quick guide to get you started.</p>
        </div>

        <ul className="mt-6 space-y-4 text-left">
            <li className="flex items-start">
                <CheckSquare className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-green-500" />
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Complete Tasks</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Navigate to the 'Tasks' page to find simple activities like visiting websites or watching videos.</p>
                </div>
            </li>
            <li className="flex items-start">
                <Star className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-yellow-500" />
                 <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Earn Points</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Each completed task rewards you with points, which you can see on your dashboard.</p>
                </div>
            </li>
            <li className="flex items-start">
                <Gift className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-purple-500" />
                 <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Daily Bonus</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Don't forget to visit the 'Bonus' page every day for a free spin on the wheel!</p>
                </div>
            </li>
        </ul>

        <div className="mt-8">
             <Link to="/user/tasks" onClick={onClose} className="w-full flex justify-center px-4 py-3 font-semibold text-white rounded-md bg-primary-600 hover:bg-primary-700">
                Let's Go!
            </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;

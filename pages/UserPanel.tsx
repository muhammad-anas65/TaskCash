
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { tasks, subscriptionPlans, dailyTaskLimit } from '../data';
import { Task, TaskCategory, Withdrawal, SubscriptionPlan } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, CheckCircle, Clock, Gift, Users, Star, ArrowRight, Filter, ArrowDownUp, Share2, Eye, Info, X, AlertTriangle, ArrowLeft, Upload } from 'lucide-react';
import SpinWheel from './SpinWheel';
import TutorialModal from '../components/TutorialModal';
import ProfilePage from './ProfilePage';

const ProfileCompletionReminder = ({ user }: { user: ReturnType<typeof useAuth>['user'] }) => {
    if (!user) return null;
    const isProfileComplete = !!user.paymentFullName && !!user.paymentDetails;

    if (isProfileComplete) {
        return null;
    }

    return (
        <div className="p-4 mb-6 text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 rounded-md dark:bg-yellow-900 dark:text-yellow-300 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                    <AlertTriangle className="flex-shrink-0 w-6 h-6 mr-3" />
                    <div>
                        <p className="font-bold">Complete Your Profile</p>
                        <p className="text-sm">Please update your payment details to enable withdrawals.</p>
                    </div>
                </div>
                <Link to="/user/profile" className="flex items-center px-4 py-2 text-sm font-semibold text-white whitespace-nowrap bg-yellow-600 rounded-md hover:bg-yellow-700">
                    Go to Profile <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
};


const DashboardCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ElementType, color: string }) => {
    const Icon = icon;
    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

const UserDashboard = () => {
    const { user, pkrPer1000Points } = useAuth();
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);

    useEffect(() => {
      const isNewUser = sessionStorage.getItem('isNewUser') === 'true';
      const tutorialShown = localStorage.getItem('taskcash_tutorial_shown') === 'true';

      if (isNewUser && !tutorialShown) {
        setIsTutorialOpen(true);
        sessionStorage.removeItem('isNewUser');
      }
    }, []);

    const handleCloseTutorial = () => {
        setIsTutorialOpen(false);
        localStorage.setItem('taskcash_tutorial_shown', 'true');
    };

    const earningsData = [
        { name: 'Mon', earnings: 120 }, { name: 'Tue', earnings: 200 },
        { name: 'Wed', earnings: 150 }, { name: 'Thu', earnings: 250 },
        { name: 'Fri', earnings: 180 }, { name: 'Sat', earnings: 300 },
        { name: 'Sun', earnings: 220 },
    ];
    const taskCategoryData = useMemo(() => {
        const counts = tasks.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {} as Record<TaskCategory, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, []);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="space-y-6">
            <ProfileCompletionReminder user={user} />
            <TutorialModal 
                isOpen={isTutorialOpen} 
                onClose={handleCloseTutorial} 
                userName={user?.name || 'User'} 
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Points" value={user?.points.toLocaleString() || '0'} icon={Star} color="bg-yellow-500" />
                <DashboardCard title="PKR Equivalent" value={`Rs ${((user?.points || 0) * (pkrPer1000Points / 1000)).toFixed(0)}`} icon={DollarSign} color="bg-green-500" />
                <DashboardCard title="Tasks Today" value={`${user?.tasksCompletedToday || 0} / ${dailyTaskLimit}`} icon={CheckCircle} color="bg-blue-500" />
                <DashboardCard title="Referrals" value={user?.referralCount || 0} icon={Users} color="bg-purple-500" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Weekly Earnings</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={earningsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)"/>
                            <XAxis dataKey="name" tick={{ fill: 'rgb(156 163 175)' }}/>
                            <YAxis tick={{ fill: 'rgb(156 163 175)' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                            <Bar dataKey="earnings" fill="#8884d8" name="Points Earned" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Tasks by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={taskCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {taskCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const UserTasks = () => {
    const TASK_COOLDOWN_SECONDS = 10;
    const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
    const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const { updateUserPoints, user, recordTaskCompletion } = useAuth();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [limitReached, setLimitReached] = useState(false);
    const [cooldownActive, setCooldownActive] = useState(false);
    const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (user?.lastTaskCompletionDate === today && (user?.tasksCompletedToday || 0) >= dailyTaskLimit) {
            setLimitReached(true);
        } else {
            setLimitReached(false);
        }
    }, [user]);

    useEffect(() => {
        let filtered = activeCategory === 'all' ? tasks : tasks.filter(t => t.category === activeCategory);
        
        filtered.sort((a, b) => {
            if (sortOrder === 'asc') return a.points - b.points;
            return b.points - a.points;
        });
        
        setFilteredTasks(filtered);

    }, [activeCategory, sortOrder]);

    const startCooldown = () => {
        setCooldownActive(true);
        setCooldownTimeLeft(TASK_COOLDOWN_SECONDS);
    };

    useEffect(() => {
        if (activeTask && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (activeTask && timeLeft === 0) {
            // Task completed
            updateUserPoints(activeTask.points * (user?.isPremium ? 2 : 1));
            alert(`Task "${activeTask.title}" completed! You earned ${activeTask.points * (user?.isPremium ? 2 : 1)} points.`);
            setActiveTask(null);
            startCooldown();
        }
    }, [activeTask, timeLeft, updateUserPoints, user]);

    useEffect(() => {
        if (cooldownActive && cooldownTimeLeft > 0) {
            const timer = setTimeout(() => setCooldownTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (cooldownActive && cooldownTimeLeft === 0) {
            setCooldownActive(false);
        }
    }, [cooldownActive, cooldownTimeLeft]);

    const startTask = (task: Task) => {
        if(limitReached) {
            alert("You have reached your daily task limit. Please come back tomorrow!");
            return;
        }

        const canProceed = recordTaskCompletion(task.id);
        if (!canProceed) {
            setLimitReached(true);
            alert("You have reached your daily task limit. Please come back tomorrow!");
            return;
        }

        if (task.durationSeconds) {
            setActiveTask(task);
            setTimeLeft(task.durationSeconds);
        } else {
            // For non-timed tasks, just award points and open link
            updateUserPoints(task.points * (user?.isPremium ? 2 : 1));
            alert(`You earned ${task.points * (user?.isPremium ? 2 : 1)} points for starting the task "${task.title}".`);
            window.open(task.url, '_blank');
            startCooldown();
        }
    };

    if (activeTask) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-6 text-center bg-white rounded-lg shadow dark:bg-gray-800">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task in Progress: {activeTask.title}</h2>
                 <p className="text-gray-600 dark:text-gray-400">Please keep this page open to earn your points.</p>
                 <div className="text-6xl font-bold text-primary-600">{timeLeft}</div>
                 <p className="text-lg text-gray-700 dark:text-gray-300">seconds remaining</p>
                 <iframe src={activeTask.url} title={activeTask.title} className="w-full h-64 border-2 rounded-lg border-gray-200 dark:border-gray-700" sandbox=""></iframe>
            </div>
        );
    }

    return (
         <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Tasks</h1>
            
             {limitReached && (
                 <div className="p-4 text-center text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 rounded-md dark:bg-yellow-900 dark:text-yellow-300">
                     <p className="font-bold">Daily Limit Reached</p>
                     <p>You have completed all your tasks for today. Please come back tomorrow for more!</p>
                 </div>
             )}
            
            {cooldownActive && (
                <div className="p-4 text-center text-indigo-800 bg-indigo-100 border-l-4 border-indigo-500 rounded-md dark:bg-indigo-900 dark:text-indigo-300">
                    <div className="flex items-center justify-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <div>
                            <p className="font-bold">Task Cooldown</p>
                            <p>Please wait <span className="font-mono">{cooldownTimeLeft}</span> seconds before starting your next task.</p>
                        </div>
                    </div>
                </div>
            )}

             <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                    <select onChange={(e) => setActiveCategory(e.target.value as TaskCategory | 'all')} value={activeCategory} className="py-1 pl-2 pr-8 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="all">All</option>
                        {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div className="flex items-center space-x-2">
                     <ArrowDownUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Sort by Points:</span>
                     <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} value={sortOrder} className="py-1 pl-2 pr-8 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="desc">Highest First</option>
                        <option value="asc">Lowest First</option>
                    </select>
                </div>
            </div>

             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {filteredTasks.map(task => {
                     const isCompleted = user?.completedTaskIdsToday?.includes(task.id);
                     return (
                         <div key={task.id} className={`flex flex-col justify-between p-6 bg-white rounded-lg shadow dark:bg-gray-800 transition-opacity ${limitReached || isCompleted || cooldownActive ? 'opacity-60' : ''}`}>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{task.category}</span>
                                    <span className="flex items-center text-lg font-bold text-yellow-500">
                                        <Star className="w-5 h-5 mr-1"/> {task.points * (user?.isPremium ? 2 : 1)}
                                    </span>
                                </div>
                                <h3 className="flex items-center mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                    {task.title}
                                    {isCompleted && <CheckCircle className="w-5 h-5 ml-2 text-green-500" />}
                                </h3>
                                {task.durationSeconds && (
                                    <p className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-1"/> Duration: {task.durationSeconds} seconds
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={() => startTask(task)} 
                                disabled={limitReached || isCompleted || cooldownActive} 
                                className={`flex items-center justify-center w-full px-4 py-2 mt-4 font-semibold text-white rounded-md transition-colors
                                    ${isCompleted 
                                        ? 'bg-green-600 cursor-not-allowed' 
                                        : 'bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-500'}
                                `}
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" /> Completed
                                    </>
                                ) : (
                                    <>
                                        Start Task <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                     );
                 })}
            </div>
        </div>
    );
};

const UserWallet = () => {
    const { user, updateUserPoints, requestWithdrawal, withdrawals, minWithdrawal, maxWithdrawal, pkrPer1000Points } = useAuth();
    const [amountPKR, setAmountPKR] = useState(minWithdrawal);
    const [method, setMethod] = useState<'PayPal' | 'Easypaisa' | 'JazzCash'>(user?.preferredPaymentMethod || 'PayPal');
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [withdrawalDetails, setWithdrawalDetails] = useState<{ amountPKR: number; points: number; method: string } | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const pointsNeeded = Math.ceil(amountPKR * (1000 / pkrPer1000Points));
    const userWithdrawals = useMemo(() => withdrawals.filter(w => w.userId === user?.id).sort((a,b) => b.id - a.id), [withdrawals, user]);
    
    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        if (user?.preferredPaymentMethod) {
            setMethod(user.preferredPaymentMethod);
        }
    }, [user?.preferredPaymentMethod]);

    useEffect(() => {
        setAmountPKR(minWithdrawal);
    }, [minWithdrawal]);
    
    const initiateWithdrawal = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (amountPKR < minWithdrawal || amountPKR > maxWithdrawal) {
            setNotification({type: 'error', message: `Withdrawal amount must be between Rs ${minWithdrawal.toLocaleString()} and Rs ${maxWithdrawal.toLocaleString()}.`});
            return;
        }

        if (!user?.paymentFullName || !user.paymentDetails) {
            setNotification({type: 'error', message: 'Please complete your profile and payment details on the Profile page before requesting a withdrawal.'});
            return;
        }
        if (user && user.points < pointsNeeded) {
            setNotification({type: 'error', message: "You don't have enough points for this withdrawal."});
            return;
        }
        
        setWithdrawalDetails({
            amountPKR: amountPKR,
            points: pointsNeeded,
            method: method,
        });
        setIsConfirmationModalOpen(true);
    };

    const confirmWithdrawal = () => {
        if (!user || !withdrawalDetails) return;

        if (user.points >= withdrawalDetails.points) {
            updateUserPoints(-withdrawalDetails.points);
            requestWithdrawal({
                amountPKR: withdrawalDetails.amountPKR,
                points: withdrawalDetails.points,
                method: withdrawalDetails.method as 'PayPal' | 'Easypaisa' | 'JazzCash',
            });
            setNotification({type: 'success', message: `Withdrawal request for Rs ${withdrawalDetails.amountPKR.toLocaleString()} submitted!`});
        } else {
            setNotification({type: 'error', message: "An error occurred. You may not have enough points."});
        }
        
        setIsConfirmationModalOpen(false);
        setWithdrawalDetails(null);
    };

    const isProfileComplete = !!user?.paymentFullName && !!user?.paymentDetails;

    return (
        <>
            {notification && (
                <div className={`fixed top-24 right-6 z-50 w-full max-w-sm p-4 rounded-lg shadow-xl text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} animate-fade-in-up`} role="alert">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-semibold">{notification.message}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <button onClick={() => setNotification(null)} className="-mx-1.5 -my-1.5 p-1.5 rounded-md inline-flex hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current">
                                <span className="sr-only">Dismiss</span>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
                
                <ProfileCompletionReminder user={user} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Request a Withdrawal</h2>
                            <form onSubmit={initiateWithdrawal} className="space-y-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (PKR)</label>
                                    <input type="number" id="amount" value={amountPKR} onChange={e => setAmountPKR(Number(e.target.value))} min={minWithdrawal} max={maxWithdrawal} step="10" className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This will cost <span className="font-bold">{pointsNeeded.toLocaleString()}</span> points.</p>
                                </div>
                                <div>
                                    <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                                    <select id="method" value={method} onChange={e => setMethod(e.target.value as any)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                                        <option value="PayPal">PayPal</option>
                                        <option value="Easypaisa">Easypaisa</option>
                                        <option value="JazzCash">JazzCash</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={!user || user.points < pointsNeeded || !isProfileComplete} className="w-full px-4 py-2 font-bold text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-500">
                                    Request Withdrawal
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 bg-white rounded-lg shadow dark:bg-gray-800">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Balance</h3>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-gray-900 dark:text-white">{user?.points.toLocaleString()}</p>
                            <p className="text-gray-500 dark:text-gray-400">Points</p>
                        </div>
                        <div className="text-center">
                             <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Rs {((user?.points || 0) * (pkrPer1000Points / 1000)).toFixed(2)}</p>
                             <p className="text-gray-500 dark:text-gray-400">PKR Equivalent</p>
                        </div>
                        <div className="pt-4 text-sm text-center text-gray-600 border-t border-gray-200 dark:text-gray-300 dark:border-gray-700">
                            <p>1,000 Points = Rs {pkrPer1000Points}</p>
                            <p>Minimum withdrawal: Rs {minWithdrawal.toLocaleString()}</p>
                            <p>Maximum withdrawal: Rs {maxWithdrawal.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {isConfirmationModalOpen && withdrawalDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-up">
                        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Withdrawal</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Please review the details below before confirming.</p>
                            <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between">
                                    <span>Amount to Withdraw:</span>
                                    <span className="font-semibold">Rs {withdrawalDetails.amountPKR.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Points Deduction:</span>
                                    <span className="font-semibold">{withdrawalDetails.points.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <span className="font-semibold">{withdrawalDetails.method}</span>
                                </div>
                            </div>
                            <div className="flex justify-end pt-6 space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsConfirmationModalOpen(false)} 
                                    className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={confirmWithdrawal} 
                                    className="px-4 py-2 font-bold text-white rounded-md bg-primary-600 hover:bg-primary-700">
                                    Confirm & Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                 <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Withdrawal History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Date</th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount (PKR)</th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Method</th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {userWithdrawals.map(w => (
                                    <tr key={w.id}>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{w.date}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">Rs {w.amountPKR.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{w.method}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${statusColor[w.status]}`}>
                                                    {w.status}
                                                </span>
                                                {w.status === 'declined' && w.declineReason && (
                                                    <div className="relative group">
                                                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                                                        <div className="absolute bottom-full left-1/2 z-10 w-48 px-2 py-1 mb-2 text-xs text-center text-white -translate-x-1/2 bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {w.declineReason}
                                                            <svg className="absolute w-4 h-4 text-gray-700 transform -translate-x-1/2 top-full left-1/2" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                            {w.status === 'approved' && w.receiptUrl ? (
                                                <a href={w.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                                                    <Eye className="w-4 h-4 mr-1"/> View Receipt
                                                </a>
                                            ) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                 {userWithdrawals.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-sm text-center text-gray-500">No withdrawal history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

const UserReferrals = () => {
    const { user, pointsPerReferral, referralBonus } = useAuth();
    const referralLink = `https://task.cash/ref/${user?.referralCode}`;
    
    const referralCount = user?.referralCount || 0;
    const referralEarnings = referralCount * pointsPerReferral;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join TaskCash!',
                    text: 'Earn money by completing simple tasks. Join using my referral link!',
                    url: referralLink,
                });
            } catch (error) {
                console.log('Share cancelled or failed', error);
            }
        } else {
            alert('Web Share API is not supported in your browser. Please copy the link manually.');
        }
    };

    const canShare = typeof navigator.share === 'function';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refer & Earn</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:bg-green-900">
                        <Users className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Successful Referrals</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{referralCount}</p>
                    </div>
                </div>
                <div className="flex items-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full dark:bg-yellow-900">
                        <Star className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Earnings</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{referralEarnings.toLocaleString()} Points</p>
                    </div>
                </div>
            </div>

            <div className="p-8 text-center bg-white rounded-lg shadow dark:bg-gray-800">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Invite Your Friends</h2>
                 <p className="mt-2 text-gray-600 dark:text-gray-400">Share your referral link and earn <span className="font-bold">{pointsPerReferral} points</span> for every friend who signs up!</p>
                 
                 <div className="inline-flex items-center justify-center w-auto gap-3 px-4 py-3 mt-4 text-sm font-semibold border rounded-lg bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/20 dark:border-primary-500/30 dark:text-primary-300">
                    <Gift className="flex-shrink-0 w-6 h-6" />
                    <span>Daily Bonus: Refer <span className="font-bold">{referralBonus.referralsNeeded}</span> friends today to earn an extra <span className="font-bold">{referralBonus.bonusPoints.toLocaleString()}</span> points!</span>
                </div>

                 <div className="flex justify-center mt-6">
                    <div className="flex w-full max-w-md rounded-md shadow-sm">
                        <input type="text" readOnly value={referralLink} className="flex-1 block w-full min-w-0 px-4 py-2 text-center text-gray-700 bg-gray-100 border border-gray-300 rounded-none rounded-l-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-primary-500 focus:border-primary-500" />
                        <button onClick={copyToClipboard} className={`relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-white border border-transparent bg-primary-600 hover:bg-primary-700 focus:z-10 ${!canShare ? 'rounded-r-md' : ''}`}>
                            <span>Copy</span>
                        </button>
                        {canShare && (
                            <button onClick={handleShare} className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-white border border-transparent rounded-r-md bg-indigo-600 hover:bg-indigo-700 focus:z-10">
                                <Share2 className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

const PaymentPage = () => {
    const { planId } = useParams<{ planId: string }>();
    const { adminPaymentDetails, requestPremiumUpgrade } = useAuth();
    const navigate = useNavigate();
    const [receiptUrl, setReceiptUrl] = useState('');

    const plan = subscriptionPlans.find(p => p.id === planId);
    
    if (!plan) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Plan not found</h1>
                <Link to="/user/subscription" className="text-primary-600">Go back</Link>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!receiptUrl) {
            alert("Please provide a receipt URL.");
            return;
        }
        requestPremiumUpgrade(plan.id, receiptUrl);
        alert("Your upgrade request has been submitted. It will be reviewed by an administrator shortly.");
        navigate('/user/subscription');
    };

    return (
        <div className="space-y-6">
             <button onClick={() => navigate('/user/subscription')} className="inline-flex items-center mb-4 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subscription Plans
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upgrade to {plan.name}</h1>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="p-6 space-y-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Instructions</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        To upgrade your account, please send <span className="font-bold">Rs {plan.pricePKR.toLocaleString()}</span> to one of the following accounts.
                    </p>
                    <div className="p-4 space-y-2 border rounded-md dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Easypaisa Details</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap dark:text-gray-400">{adminPaymentDetails.Easypaisa}</p>
                    </div>
                     <div className="p-4 space-y-2 border rounded-md dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">JazzCash Details</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap dark:text-gray-400">{adminPaymentDetails.JazzCash}</p>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        After making the payment, please upload a screenshot or provide the URL of your receipt in the form.
                    </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Your Receipt</h2>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="receiptUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Receipt URL</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Upload your receipt to a service like Imgur and paste the link here.</p>
                            <div className="relative">
                                <Upload className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="url"
                                    id="receiptUrl"
                                    value={receiptUrl}
                                    onChange={(e) => setReceiptUrl(e.target.value)}
                                    placeholder="https://i.imgur.com/your-receipt.png"
                                    required
                                    className="w-full py-2 pl-10 pr-3 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full px-4 py-2 font-bold text-white rounded-md bg-primary-600 hover:bg-primary-700">
                            Submit for Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const UserSubscription = () => {
    const { user, upgradeRequests } = useAuth();
    const navigate = useNavigate();

    const pendingRequest = upgradeRequests.find(req => req.userId === user?.id && req.status === 'pending');

    const handleUpgrade = () => {
        const premiumPlan = subscriptionPlans.find(p => p.id === 'premium');
        if (!premiumPlan) return;
        navigate(`/user/subscription/payment/${premiumPlan.id}`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {subscriptionPlans.map(plan => {
                    return (
                        <div key={plan.id} className={`p-8 border rounded-lg shadow-lg flex flex-col ${user?.isPremium && plan.id === 'premium' ? 'border-primary-500' : 'dark:border-gray-700'}`}>
                            <div className="flex-grow">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                                <p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">
                                    {plan.pricePKR > 0 ? `Rs ${plan.pricePKR}` : 'Free'}
                                    <span className="text-base font-medium text-gray-500 dark:text-gray-400"> / one-time</span>
                                </p>
                                <ul className="mt-6 space-y-4">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircle className="flex-shrink-0 w-6 h-6 mr-2 text-green-500" />
                                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-8">
                                {plan.id === 'premium' ? (
                                    user?.isPremium ? (
                                        <button disabled className="w-full py-3 font-semibold text-white rounded-lg bg-primary-600 opacity-70">Current Plan</button>
                                    ) : (
                                        <button 
                                            onClick={handleUpgrade}
                                            disabled={!!pendingRequest}
                                            className="w-full py-3 font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                        >
                                            {pendingRequest ? 'Upgrade Pending Review' : 'Upgrade Now'}
                                        </button>
                                    )
                                ) : (
                                    <button disabled className="w-full py-3 font-semibold text-center text-gray-700 bg-gray-200 rounded-lg cursor-not-allowed dark:bg-gray-700 dark:text-gray-300">
                                        {!user?.isPremium ? 'Your Current Plan' : 'Standard Plan'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const UserPanel = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/tasks" element={<UserTasks />} />
                <Route path="/bonus" element={<SpinWheel />} />
                <Route path="/wallet" element={<UserWallet />} />
                <Route path="/referrals" element={<UserReferrals />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/subscription" element={<UserSubscription />} />
                <Route path="/subscription/payment/:planId" element={<PaymentPage />} />
            </Routes>
        </Layout>
    );
};

export default UserPanel;

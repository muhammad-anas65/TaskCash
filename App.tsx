
import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { users as mockUsers, withdrawals as mockWithdrawals, rolePermissions, subscriptionPlans, PKR_PER_1000_POINTS, MIN_WITHDRAWAL_PKR, MAX_WITHDRAWAL_PKR, dailyTaskLimit } from './data';
import { User, AdminRole, Withdrawal, SubscriptionPlan } from './types';
import AuthPage from './pages/AuthPage';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};


interface AuthContextType {
  user: User | null;
  users: User[];
  withdrawals: Withdrawal[];
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  signup: (email: string, password?: string) => boolean;
  updateUserPoints: (pointsToAdd: number) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  sendPasswordResetLink: (email: string) => boolean;
  resetPassword: (email: string, token: string, newPassword: string) => boolean;
  recordTaskCompletion: (taskId: number) => boolean;
  requestWithdrawal: (withdrawalRequest: Omit<Withdrawal, 'id' | 'userId' | 'userName' | 'status' | 'date'>) => void;
  updateWithdrawalStatus: (withdrawalId: number, status: 'approved' | 'declined', details?: { receiptUrl?: string; declineReason?: string }) => void;
  upgradeToPremium: (planId: string) => boolean;
  minWithdrawal: number;
  maxWithdrawal: number;
  updateWithdrawalLimits: (min: number, max: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
    const [minWithdrawal, setMinWithdrawal] = useState(MIN_WITHDRAWAL_PKR);
    const [maxWithdrawal, setMaxWithdrawal] = useState(MAX_WITHDRAWAL_PKR);

    const login = (email: string, password?: string): boolean => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    };

    const signup = (email: string, password?: string): boolean => {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            return false; // User already exists
        }
        const newUser: User = {
            id: users.length + 1,
            name: email.split('@')[0],
            email: email,
            password: password,
            role: 'user', // New signups are always users
            isPremium: false,
            points: 100,
            referralCode: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            status: 'active'
        };
        setUsers([...users, newUser]);
        setUser(newUser);
        sessionStorage.setItem('isNewUser', 'true'); // Flag for tutorial
        return true;
    }
    
    const sendPasswordResetLink = (email: string): boolean => {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            const token = Math.random().toString(36).substring(2, 15);
            // In a real app, you would email this link. We'll just log it.
            console.log(`Password reset link for ${email}: /#/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
            // Store token to validate later (in a real app, this would be in a DB with an expiry)
            sessionStorage.setItem(`reset_${email}`, token);
            return true;
        }
        return false; // Silently fail if user not found for security
    };

    const resetPassword = (email: string, token: string, newPassword: string): boolean => {
        const storedToken = sessionStorage.getItem(`reset_${email}`);
        if (storedToken && storedToken === token) {
            const userIndex = users.findIndex(u => u.email === email);
            if (userIndex !== -1) {
                const updatedUsers = [...users];
                updatedUsers[userIndex].password = newPassword;
                setUsers(updatedUsers);
                sessionStorage.removeItem(`reset_${email}`);
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };
    
    const updateUserPoints = (pointsToAdd: number) => {
        if (user) {
            const updatedUser = { ...user, points: user.points + pointsToAdd };
            setUser(updatedUser);
            // Also update the mock data source
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
        }
    };

    const updateUserProfile = (profileData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
        }
    };

    const hasPermission = (permission: string): boolean => {
        if (!user || user.role === 'user') {
            return false;
        }
        const userPermissions = rolePermissions[user.role as AdminRole] || [];
        return userPermissions.includes(permission);
    };
    
    const recordTaskCompletion = (taskId: number): boolean => {
        if (!user) return false;

        const today = new Date().toISOString().split('T')[0];
        const { tasksCompletedToday = 0, lastTaskCompletionDate, completedTaskIdsToday = [] } = user;

        if (lastTaskCompletionDate === today) {
            if (tasksCompletedToday >= dailyTaskLimit) {
                return false; // Limit reached
            }
             const updatedUser = { 
                ...user, 
                tasksCompletedToday: tasksCompletedToday + 1,
                completedTaskIdsToday: [...completedTaskIdsToday, taskId]
            };
            setUser(updatedUser);
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
        } else {
            // First task of a new day
            const updatedUser = { 
                ...user, 
                tasksCompletedToday: 1, 
                lastTaskCompletionDate: today,
                completedTaskIdsToday: [taskId]
            };
            setUser(updatedUser);
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
        }
        return true;
    };
    
    const requestWithdrawal = (withdrawalRequest: Omit<Withdrawal, 'id' | 'userId' | 'userName' | 'status' | 'date'>) => {
        if (!user) return;
        const newWithdrawal: Withdrawal = {
            id: withdrawals.length + 1,
            userId: user.id,
            userName: user.name,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            ...withdrawalRequest
        };
        setWithdrawals(prev => [...prev, newWithdrawal]);
    };
    
    const updateWithdrawalStatus = (withdrawalId: number, status: 'approved' | 'declined', details: { receiptUrl?: string; declineReason?: string } = {}) => {
        setWithdrawals(prev => prev.map(w => 
            w.id === withdrawalId ? { ...w, status, ...details } : w
        ));
    };
    
    const upgradeToPremium = (planId: string): boolean => {
        if (!user) return false;
        
        const plan = subscriptionPlans.find(p => p.id === planId);
        if (!plan || plan.pricePKR <= 0) return false;

        const costInPoints = Math.ceil(plan.pricePKR * (1000 / PKR_PER_1000_POINTS));

        if (user.points >= costInPoints) {
            const updatedUser = {
                ...user,
                points: user.points - costInPoints,
                isPremium: true
            };
            setUser(updatedUser);
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
            return true;
        }
        
        return false;
    };
    
    const updateWithdrawalLimits = (min: number, max: number) => {
        setMinWithdrawal(min);
        setMaxWithdrawal(max);
    };


    const value = useMemo(() => ({ 
        user, 
        users,
        withdrawals,
        login, 
        logout, 
        signup, 
        updateUserPoints, 
        hasPermission, 
        updateUserProfile,
        sendPasswordResetLink,
        resetPassword,
        recordTaskCompletion,
        requestWithdrawal,
        updateWithdrawalStatus,
        upgradeToPremium,
        minWithdrawal,
        maxWithdrawal,
        updateWithdrawalLimits,
    }), [user, users, withdrawals, minWithdrawal, maxWithdrawal]);


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    </ThemeProvider>
  );
}

const AppRoutes = () => {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <Routes>
            <Route path="/" element={!user ? <AuthPage /> : <Navigate to={user.role === 'user' ? '/user' : '/admin'} replace />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            <Route path="/user/*" element={
                user && user.role === 'user' ? <UserPanel /> : <Navigate to="/" state={{ from: location }} replace />
            } />

            <Route path="/admin/*" element={
                user && user.role !== 'user' ? <AdminPanel /> : <Navigate to="/" state={{ from: location }} replace />
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
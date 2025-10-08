
import React, { useState, Fragment, useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth, useTheme } from '../App';
import { Sun, Moon, LogOut, Menu, X, User as UserIcon, LayoutDashboard, CheckSquare, Wallet, Users, Settings, BarChart2, DollarSign, Gift, Shield, UserCog, Crown } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  permission?: string;
}

const userNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/user/tasks', icon: CheckSquare },
  { name: 'Bonus', path: '/user/bonus', icon: Gift },
  { name: 'Wallet', path: '/user/wallet', icon: Wallet },
  { name: 'Referrals', path: '/user/referrals', icon: Users },
  { name: 'Profile', path: '/user/profile', icon: UserCog },
  { name: 'Subscription', path: '/user/subscription', icon: DollarSign },
];

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart2, permission: 'view_dashboard' },
  { name: 'Users', path: '/admin/users', icon: Users, permission: 'manage_users' },
  { name: 'Staff', path: '/admin/staff', icon: Shield, permission: 'manage_staff' },
  { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare, permission: 'manage_tasks' },
  { name: 'Withdrawals', path: '/admin/withdrawals', icon: DollarSign, permission: 'manage_withdrawals' },
  { name: 'Subscriptions', path: '/admin/subscriptions', icon: Crown, permission: 'manage_subscriptions' },
  { name: 'Settings', path: '/admin/settings', icon: Settings, permission: 'manage_settings' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout, hasPermission } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const navItems = useMemo(() => {
        if (user?.role === 'user') {
            return userNavItems;
        }
        return adminNavItems.filter(item => item.permission ? hasPermission(item.permission) : true);
    }, [user, hasPermission]);


    const NavLinks = ({ className }: { className?: string }) => (
        <nav className={`flex flex-col space-y-2 ${className}`}>
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`
                    }
                >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                </NavLink>
            ))}
        </nav>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 px-4 py-6 overflow-y-auto transition-transform duration-300 transform bg-white shadow-lg dark:bg-gray-800 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                        Task<span className="text-primary-600">Cash</span>
                    </Link>
                     <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                <div className="mt-8">
                    <NavLinks />
                </div>

                <div className="mt-auto space-y-4">
                     <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Night Mode</span>
                        <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="theme-toggle" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                        <div>Logged in as:</div>
                        <div className="font-bold">{user?.role}</div>
                    </div>
                </div>
            </aside>
            
            <div className="flex flex-col flex-1">
                {/* Header */}
                <header className="flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm dark:bg-gray-800 dark:border-gray-700 md:px-6">
                     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 md:hidden dark:text-gray-400">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1"></div> {/* Spacer */}
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <div className="relative">
                            <div className="flex items-center space-x-2">
                                <UserIcon className="w-8 h-8 p-1 text-gray-600 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" />
                                <div className="hidden text-sm md:block">
                                    <p className="font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                        
                         <button onClick={logout} className="flex items-center p-2 text-sm text-gray-500 rounded-md hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
                            <LogOut className="w-5 h-5 mr-1" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </header>
                {/* Main Content */}
                <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

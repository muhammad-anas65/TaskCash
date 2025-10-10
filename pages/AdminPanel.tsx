
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { tasks as initialTasks } from '../data';
import { User, Task, Withdrawal, TaskCategory, UpgradeRequest } from '../types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from 'recharts';
import { DollarSign, Users, CheckSquare, Clock, Plus, Edit, Trash2, X as XIcon, Shield, AlertTriangle, Info, Save, Eye } from 'lucide-react';


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

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">You do not have permission to view this page.</p>
    </div>
);


const AdminDashboard = () => {
    const { hasPermission, users, withdrawals } = useAuth();
    if (!hasPermission('view_dashboard')) return <AccessDenied />;

    const userData = [
        { name: 'Jan', users: 120 }, { name: 'Feb', users: 150 },
        { name: 'Mar', users: 200 }, { name: 'Apr', users: 230 },
        { name: 'May', users: 280 }, { name: 'Jun', users: 320 },
    ];

    const dailyPointsData = [
        { name: 'Mon', points: 1250 },
        { name: 'Tue', points: 1800 },
        { name: 'Wed', points: 1600 },
        { name: 'Thu', points: 2200 },
        { name: 'Fri', points: 2500 },
        { name: 'Sat', points: 3100 },
        { name: 'Sun', points: 2800 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardCard title="Total Users" value={users.filter(u => u.role === 'user').length} icon={Users} color="bg-blue-500" />
                <DashboardCard title="Active Tasks" value={initialTasks.length} icon={CheckSquare} color="bg-purple-500" />
                <DashboardCard title="Pending Payouts" value={withdrawals.filter(w => w.status === 'pending').length} icon={Clock} color="bg-yellow-500" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)"/>
                            <XAxis dataKey="name" tick={{ fill: 'rgb(156 163 175)' }}/>
                            <YAxis tick={{ fill: 'rgb(156 163 175)' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Daily Points Earned (Last Week)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyPointsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                            <XAxis dataKey="name" tick={{ fill: 'rgb(156 163 175)' }} />
                            <YAxis tick={{ fill: 'rgb(156 163 175)' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Bar dataKey="points" fill="#82ca9d" name="Total Points Earned" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const ManageUsers = () => {
    const { hasPermission, users } = useAuth();
    if (!hasPermission('manage_users')) return <AccessDenied />;
    
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Name</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Email</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Points</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {users.filter(u => u.role === 'user').map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{user.points.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ManageStaff = () => {
    const { hasPermission, users } = useAuth();
    if (!hasPermission('manage_staff')) return <AccessDenied />;

    const [staff] = useState<User[]>(users.filter(u => u.role !== 'user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStaff, setCurrentStaff] = useState<Partial<User> | null>(null);

    const openModal = (staffMember: Partial<User> | null = null) => {
        setCurrentStaff(staffMember || { name: '', email: '', role: 'Marketing Manager', status: 'active' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStaff(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentStaff) return;
        // Add or update staff logic here (not implemented for mock data)
        console.log("Saving staff member:", currentStaff);
        closeModal();
    }
    
    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Staff</h1>
                <button onClick={() => openModal()} className="flex items-center px-4 py-2 font-bold text-white rounded-md bg-primary-600 hover:bg-primary-700">
                    <Plus className="w-5 h-5 mr-2" /> Add Staff Member
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Name</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Email</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Role</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                         {staff.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                                    <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {isModalOpen && currentStaff && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentStaff.id ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
                            <button onClick={closeModal}><XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400"/></button>
                        </div>
                        <form onSubmit={handleSave} className="mt-4 space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input type="text" name="name" defaultValue={currentStaff.name} className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input type="email" name="email" defaultValue={currentStaff.email} className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <select name="role" defaultValue={currentStaff.role} className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option>Marketing Manager</option>
                                    <option>Support Staff</option>
                                    <option>Super Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 font-bold text-white rounded-md bg-primary-600 hover:bg-primary-700">Save</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    )
}


const ManageTasks = () => {
    const { hasPermission } = useAuth();
    if (!hasPermission('manage_tasks')) return <AccessDenied />;

    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
    const [filterCategory, setFilterCategory] = useState<'all' | TaskCategory>('all');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const openModalForNew = () => {
        setCurrentTask({
            title: '',
            category: TaskCategory.WEBSITE,
            points: 10,
            durationSeconds: 30,
            url: ''
        });
        setIsModalOpen(true);
    };

    const openModalForEdit = (task: Task) => {
        setCurrentTask({ ...task });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };

    const openDeleteModal = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setTaskToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            setTasks(tasks.filter(task => task.id !== taskToDelete.id));
            closeDeleteModal();
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentTask || !currentTask.title || !currentTask.url) return;

        if ('id' in currentTask && currentTask.id) {
            setTasks(tasks.map(task => task.id === currentTask.id ? (currentTask as Task) : task));
        } else {
            const newTask: Task = {
                ...currentTask,
                id: Math.max(...tasks.map(t => t.id), 0) + 1,
            } as Task;
            setTasks([...tasks, newTask]);
        }
        closeModal();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!currentTask) return;
        const { name, value } = e.target;
        setCurrentTask({
            ...currentTask,
            [name]: name === 'points' || name === 'durationSeconds' ? parseInt(value, 10) || 0 : value,
        });
    };

    const filteredTasks = tasks.filter(task =>
        filterCategory === 'all' || task.category === filterCategory
    );
    
    return (
        <div className="space-y-4">
            <div className="items-center justify-between md:flex">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Tasks</h1>
                <div className="flex items-center mt-4 space-x-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                         <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
                        <select
                            id="category-filter"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as 'all' | TaskCategory)}
                            className="py-1 pl-2 pr-8 text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">All Categories</option>
                            {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <button onClick={openModalForNew} className="flex items-center px-4 py-2 font-bold text-white rounded-md bg-primary-600 hover:bg-primary-700">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Task
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Title</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Category</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Points</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Duration (s)</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {filteredTasks.map(task => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{task.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{task.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{task.points}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{task.durationSeconds || 'N/A'}</td>
                                <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                                    <button onClick={() => openModalForEdit(task)} className="p-1 text-indigo-600 rounded-md hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-gray-700"><Edit className="w-5 h-5"/></button>
                                    <button onClick={() => openDeleteModal(task)} className="p-1 text-red-600 rounded-md hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700"><Trash2 className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 text-sm text-center text-gray-500">
                                    No tasks found for the selected category.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && currentTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentTask.id ? 'Edit Task' : 'Add New Task'}</h2>
                            <button onClick={closeModal}><XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400"/></button>
                        </div>
                        <form onSubmit={handleSave} className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input type="text" id="title" name="title" value={currentTask.title} onChange={handleChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
                            </div>
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select id="category" name="category" value={currentTask.category} onChange={handleChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Points</label>
                                    <input type="number" id="points" name="points" value={currentTask.points} onChange={handleChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required min="0"/>
                                </div>
                                <div>
                                    <label htmlFor="durationSeconds" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Duration (seconds)
                                        <div className="relative flex items-center ml-1.5 group">
                                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 z-10 w-64 p-2 mb-2 text-xs text-center text-white -translate-x-1/2 bg-gray-700 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                                                Optional. Set a duration for tasks that require the user to stay on the page. Leave blank for none.
                                            </div>
                                        </div>
                                    </label>
                                    <input type="number" id="durationSeconds" name="durationSeconds" value={currentTask.durationSeconds || ''} onChange={handleChange} placeholder="e.g., 30" className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                                <input 
                                    type="url" 
                                    id="url" 
                                    name="url" 
                                    value={currentTask.url} 
                                    onChange={handleChange} 
                                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 font-bold text-white rounded-md bg-primary-600 hover:bg-primary-700">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && taskToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-up">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto text-red-600 bg-red-100 rounded-full">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Are you sure you want to delete the task "{taskToDelete.title}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-center mt-6 space-x-4">
                            <button 
                                type="button" 
                                onClick={closeDeleteModal} 
                                className="px-6 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmDelete} 
                                className="px-6 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const ManageWithdrawals = () => {
    const { hasPermission, withdrawals, updateWithdrawalStatus, users } = useAuth();
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [declineReason, setDeclineReason] = useState('');
    const [currentWithdrawal, setCurrentWithdrawal] = useState<Withdrawal | null>(null);

    if (!hasPermission('manage_withdrawals')) return <AccessDenied />;

    const openApproveModal = (withdrawal: Withdrawal) => {
        setCurrentWithdrawal(withdrawal);
        setIsApproveModalOpen(true);
    };

    const closeApproveModal = () => {
        setCurrentWithdrawal(null);
        setIsApproveModalOpen(false);
        setReceiptUrl('');
    };
    
    const openDeclineModal = (withdrawal: Withdrawal) => {
        setCurrentWithdrawal(withdrawal);
        setIsDeclineModalOpen(true);
    };

    const closeDeclineModal = () => {
        setCurrentWithdrawal(null);
        setIsDeclineModalOpen(false);
        setDeclineReason('');
    };

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentWithdrawal) {
            updateWithdrawalStatus(currentWithdrawal.id, 'approved', { receiptUrl });
            closeApproveModal();
        }
    };
    
    const handleDecline = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentWithdrawal) {
            updateWithdrawalStatus(currentWithdrawal.id, 'declined', { declineReason });
            closeDeclineModal();
        }
    };

    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Withdrawals</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">User</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Current Points</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Balance Before Request</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount (PKR)</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Method</th>
                             <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Date</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                       {withdrawals.map(w => {
                           const withdrawalUser = users.find(u => u.id === w.userId);
                           return (
                               <tr key={w.id}>
                                   <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{w.userName}</td>
                                   <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{withdrawalUser ? withdrawalUser.points.toLocaleString() : 'N/A'}</td>
                                   <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{withdrawalUser ? (withdrawalUser.points + w.points).toLocaleString() : 'N/A'}</td>
                                   <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">Rs {w.amountPKR.toLocaleString()}</td>
                                   <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{w.method}</td>
                                   <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{w.date}</td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${statusColor[w.status]}`}>
                                            {w.status}
                                       </span>
                                   </td>
                                   <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                       {w.status === 'pending' && (
                                           <div className="flex space-x-2">
                                                <button onClick={() => openApproveModal(w)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Approve</button>
                                                <button onClick={() => openDeclineModal(w)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Decline</button>
                                           </div>
                                       )}
                                   </td>
                               </tr>
                           );
                       })}
                    </tbody>
                </table>
            </div>

            {isApproveModalOpen && currentWithdrawal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Approve Withdrawal</h2>
                            <button onClick={closeApproveModal}><XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400"/></button>
                        </div>
                        <form onSubmit={handleApprove} className="mt-4 space-y-4">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300">Approving request for <span className="font-bold">{currentWithdrawal.userName}</span> of <span className="font-bold">Rs {currentWithdrawal.amountPKR.toLocaleString()}</span>.</p>
                            </div>
                            <div>
                                <label htmlFor="receiptUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Receipt URL</label>
                                <input 
                                    type="url" 
                                    id="receiptUrl"
                                    name="receiptUrl" 
                                    value={receiptUrl}
                                    onChange={(e) => setReceiptUrl(e.target.value)}
                                    className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    required
                                    placeholder="https://example.com/receipt.png"
                                />
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={closeApproveModal} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 font-bold text-white rounded-md bg-green-600 hover:bg-green-700">Confirm Approval</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeclineModalOpen && currentWithdrawal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Decline Withdrawal</h2>
                            <button onClick={closeDeclineModal}><XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400"/></button>
                        </div>
                        <form onSubmit={handleDecline} className="mt-4 space-y-4">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300">Declining request for <span className="font-bold">{currentWithdrawal.userName}</span> of <span className="font-bold">Rs {currentWithdrawal.amountPKR.toLocaleString()}</span>.</p>
                            </div>
                            <div>
                                <label htmlFor="declineReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Decline</label>
                                <textarea 
                                    id="declineReason"
                                    name="declineReason" 
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500" 
                                    required
                                    rows={3}
                                    placeholder="e.g., Invalid payment details provided."
                                />
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={closeDeclineModal} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700">Confirm Decline</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ManageSubscriptions = () => {
    const { hasPermission, upgradeRequests, updateUpgradeRequestStatus } = useAuth();
    if (!hasPermission('manage_subscriptions')) return <AccessDenied />;

    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Subscriptions</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">User</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Plan</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Price (PKR)</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Date</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Receipt</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {upgradeRequests.map(req => (
                            <tr key={req.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{req.userName}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{req.planName}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">Rs {req.pricePKR.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{req.date}</td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                    <a href={req.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                                        <Eye className="w-4 h-4 mr-1"/> View
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${statusColor[req.status]}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                    {req.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => updateUpgradeRequestStatus(req.id, 'approved')} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Approve</button>
                                            <button onClick={() => updateUpgradeRequestStatus(req.id, 'declined')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Decline</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {upgradeRequests.length === 0 && (
                            <tr><td colSpan={7} className="py-4 text-sm text-center text-gray-500">No subscription requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const AdminSettings = () => {
    const { hasPermission, minWithdrawal, maxWithdrawal, updateWithdrawalLimits, pkrPer1000Points, updatePkrRate, pointsPerReferral, referralBonus, updateReferralSettings, adminPaymentDetails, updateAdminPaymentDetails } = useAuth();
    
    const [min, setMin] = useState(minWithdrawal);
    const [max, setMax] = useState(maxWithdrawal);
    const [rate, setRate] = useState(pkrPer1000Points);
    const [refPoints, setRefPoints] = useState(pointsPerReferral);
    const [bonusNeeded, setBonusNeeded] = useState(referralBonus.referralsNeeded);
    const [bonusPoints, setBonusPoints] = useState(referralBonus.bonusPoints);
    const [easypaisaDetails, setEasypaisaDetails] = useState(adminPaymentDetails.Easypaisa);
    const [jazzcashDetails, setJazzcashDetails] = useState(adminPaymentDetails.JazzCash);
    const [saved, setSaved] = useState(false);

    if (!hasPermission('manage_settings')) return <AccessDenied />;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (min >= max) {
            alert("Minimum withdrawal must be less than maximum withdrawal.");
            return;
        }
        updateWithdrawalLimits(min, max);
        updatePkrRate(rate);
        updateReferralSettings(refPoints, { referralsNeeded: bonusNeeded, bonusPoints: bonusPoints });
        updateAdminPaymentDetails({ Easypaisa: easypaisaDetails, JazzCash: jazzcashDetails });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Application Settings</h1>
            <div className="max-w-2xl">
                 <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Withdrawal Limits</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Set the minimum and maximum withdrawal amounts in PKR.</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="minWithdrawal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Withdrawal (PKR)</label>
                                <input type="number" id="minWithdrawal" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                            </div>
                            <div>
                                <label htmlFor="maxWithdrawal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maximum Withdrawal (PKR)</label>
                                <input type="number" id="maxWithdrawal" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Point Conversion</h2>
                         <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Define how many PKR are equivalent to 1,000 points.</p>
                         <div className="mt-4">
                            <label htmlFor="pkrRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">PKR per 1,000 Points</label>
                            <input type="number" id="pkrRate" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                         </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Referral Settings</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Configure rewards for user referrals.</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="refPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Points per Referral</label>
                                <input type="number" id="refPoints" value={refPoints} onChange={(e) => setRefPoints(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="bonusNeeded" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Daily Referrals for Bonus</label>
                                    <input type="number" id="bonusNeeded" value={bonusNeeded} onChange={(e) => setBonusNeeded(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                                </div>
                                <div>
                                    <label htmlFor="bonusPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bonus Points Amount</label>
                                    <input type="number" id="bonusPoints" value={bonusPoints} onChange={(e) => setBonusPoints(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details for Upgrades</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">This information will be shown to users who want to upgrade to premium.</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="easypaisaDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Easypaisa Details</label>
                                <textarea id="easypaisaDetails" value={easypaisaDetails} onChange={(e) => setEasypaisaDetails(e.target.value)} rows={3} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                            <div>
                                <label htmlFor="jazzcashDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">JazzCash Details</label>
                                <textarea id="jazzcashDetails" value={jazzcashDetails} onChange={(e) => setJazzcashDetails(e.target.value)} rows={3} className="w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-5 border-t border-gray-200 dark:border-gray-700">
                        {saved && <p className="mr-4 text-sm text-green-600 dark:text-green-400">Settings saved successfully!</p>}
                        <button type="submit" className="inline-flex items-center px-4 py-2 font-bold text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700">
                            <Save className="w-5 h-5 mr-2" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminPanel = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/users" element={<ManageUsers />} />
                <Route path="/staff" element={<ManageStaff />} />
                <Route path="/tasks" element={<ManageTasks />} />
                <Route path="/withdrawals" element={<ManageWithdrawals />} />
                <Route path="/subscriptions" element={<ManageSubscriptions />} />
                <Route path="/settings" element={<AdminSettings />} />
            </Routes>
        </Layout>
    );
};

export default AdminPanel;

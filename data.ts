import { User, Task, TaskCategory, Withdrawal, SubscriptionPlan, AdminRole } from './types';

export const users: User[] = [
  { id: 1, name: 'Admin', email: 'admin@task.cash', password: 'password123', role: 'Super Admin', isPremium: true, points: 0, referralCode: 'ADM001', status: 'active' },
];

export const tasks: Task[] = [];

export const withdrawals: Withdrawal[] = [];

export const subscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free User',
        pricePKR: 0,
        features: ['Standard Earning Rate', 'Access to all tasks', 'Standard Support'],
        earningMultiplier: 1,
    },
    {
        id: 'premium',
        name: 'Premium Member',
        pricePKR: 1500,
        features: ['2x Earning Rate', 'Priority Task Access', 'Premium Support', 'Premium Badge'],
        earningMultiplier: 2,
    }
];

export const rolePermissions: Record<AdminRole, string[]> = {
  'Super Admin': ['manage_users', 'manage_staff', 'manage_tasks', 'manage_withdrawals', 'view_dashboard', 'manage_settings'],
  'Marketing Manager': ['manage_tasks', 'view_dashboard'],
  'Support Staff': ['manage_users', 'manage_withdrawals', 'view_dashboard'],
};

export const PKR_PER_1000_POINTS = 278;
export const MIN_WITHDRAWAL_PKR = 1390;
export const MAX_WITHDRAWAL_PKR = 10000;
export const dailyTaskLimit = 5;
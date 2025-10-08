import { User, Task, TaskCategory, Withdrawal, SubscriptionPlan, AdminRole } from './types';

export const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'user@task.cash', password: 'password123', role: 'user', isPremium: true, points: 12500, referralCode: 'ALI123', status: 'active', tasksCompletedToday: 2, lastTaskCompletionDate: '2023-10-29' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'user', isPremium: false, points: 7800, referralCode: 'BOB456', status: 'active' },
  { id: 3, name: 'Admin', email: 'admin@task.cash', password: 'password123', role: 'Super Admin', isPremium: true, points: 0, referralCode: 'ADM789', status: 'active' },
  { id: 4, name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', role: 'user', isPremium: false, points: 1500, referralCode: 'CHA101', status: 'suspended' },
  { id: 5, name: 'Mark Lee', email: 'mark@task.cash', password: 'password123', role: 'Marketing Manager', isPremium: false, points: 0, referralCode: 'MAR555', status: 'active' },
  { id: 6, name: 'Susan White', email: 'susan@task.cash', password: 'password123', role: 'Support Staff', isPremium: false, points: 0, referralCode: 'SUS666', status: 'active' },
];

export const tasks: Task[] = [
  { id: 1, title: 'Visit TechCrunch for 30s', category: TaskCategory.WEBSITE, points: 50, durationSeconds: 30, url: 'https://techcrunch.com' },
  { id: 2, title: 'Watch MKBHD YouTube Video', category: TaskCategory.VIDEO, points: 75, durationSeconds: 60, url: 'https://www.youtube.com/embed/vcdF_n5v_tw' },
  { id: 3, title: 'Complete CPALead Survey', category: TaskCategory.SURVEY, points: 500, url: '#' },
  { id: 4, title: 'Visit a cool portfolio site', category: TaskCategory.WEBSITE, points: 40, durationSeconds: 20, url: 'https://brittanychiang.com/' },
  { id: 5, title: 'Watch a TikTok compilation', category: TaskCategory.VIDEO, points: 60, durationSeconds: 45, url: 'https://www.youtube.com/embed/IcaIsy2c2K8' },
  { id: 6, title: 'AdGem Offer', category: TaskCategory.SURVEY, points: 800, url: '#' },
];

export const withdrawals: Withdrawal[] = [
  { id: 1, userId: 1, userName: 'Alice Johnson', amountPKR: 1390, points: 5000, method: 'PayPal', status: 'approved', date: '2023-10-26', receiptUrl: 'https://i.imgur.com/receipt.png' },
  { id: 2, userId: 2, userName: 'Bob Smith', amountPKR: 2780, points: 10000, method: 'JazzCash', status: 'pending', date: '2023-10-28' },
  { id: 3, userId: 1, userName: 'Alice Johnson', amountPKR: 1946, points: 7000, method: 'Easypaisa', status: 'pending', date: '2023-10-29' },
  { id: 4, userId: 2, userName: 'Bob Smith', amountPKR: 1390, points: 5000, method: 'PayPal', status: 'declined', date: '2023-10-25', declineReason: 'Incorrect PayPal email provided.' },
];

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
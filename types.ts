
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'user' | AdminRole;
  isPremium: boolean;
  points: number;
  referralCode: string;
  status: 'active' | 'suspended';
  paymentFullName?: string;
  mobileNumber?: string;
  preferredPaymentMethod?: 'PayPal' | 'Easypaisa' | 'JazzCash';
  paymentDetails?: string;
  tasksCompletedToday?: number;
  lastTaskCompletionDate?: string;
}

export type AdminRole = 'Super Admin' | 'Marketing Manager' | 'Support Staff';

export enum TaskCategory {
  WEBSITE = 'Visit Websites',
  VIDEO = 'Watch Videos',
  SURVEY = 'Surveys & Offers'
}

export interface Task {
  id: number;
  title: string;
  category: TaskCategory;
  points: number;
  durationSeconds?: number; // for timed tasks
  url: string;
}

export interface Withdrawal {
  id: number;
  userId: number;
  userName: string;
  amountPKR: number; // in PKR
  points: number;
  method: 'PayPal' | 'Easypaisa' | 'JazzCash';
  status: 'pending' | 'approved' | 'declined';
  date: string;
  receiptUrl?: string;
  declineReason?: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    pricePKR: number;
    features: string[];
    earningMultiplier: number;
}
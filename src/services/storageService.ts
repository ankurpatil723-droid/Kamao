import { BudgetPlan, Expense, UserProfile } from '../types';
import { getTodayDateString, getCurrentTimeString } from '../utils/formatters';

const STORAGE_KEYS = {
  USER_PROFILE: 'kamao_user_profile_v1',
  BUDGET_PLAN: 'kamao_budget_plan_v1',
  EXPENSES: 'kamao_expenses_v1',
  ACTIVE_TAB: 'kamao_active_tab_v1',
};

// Generate sample initial data for quick testing if requested
export function generateSampleData(userId: string): { plan: BudgetPlan; expenses: Expense[] } {
  const plan: BudgetPlan = {
    id: 'sample-plan-1',
    userId,
    monthlyIncome: 65000,
    rent: 18000,
    rentBracket: '₹15,000–₹20,000',
    foodGroceries: 8000,
    travel: 4500,
    foodDelivery: 3500,
    emi: 5000,
    emiBracket: '₹5,000–₹10,000',
    shoppingEntertainment: 5000,
    impulse: 2000,
    impulseBracket: '₹2,000–₹5,000',
    giftsOccasions: 2500,
    emergencyFund: 5000,
    totalPlannedSpend: 53500,
    remainingAmount: 11500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const today = getTodayDateString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dayBefore = new Date(Date.now() - 172800000).toISOString().split('T')[0];

  const expenses: Expense[] = [
    {
      id: 'exp-1',
      userId,
      category: 'Food Delivery',
      description: 'Zepto groceries & snacks',
      amount: 284,
      date: today,
      time: '19:40',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-2',
      userId,
      category: 'Travel',
      description: 'Uber auto to office',
      amount: 145,
      date: today,
      time: '09:15',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-3',
      userId,
      category: 'Food',
      description: 'Chai & evening snacks',
      amount: 60,
      date: today,
      time: '17:30',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-4',
      userId,
      category: 'Food Delivery',
      description: 'Swiggy Biryani Dinner',
      amount: 420,
      date: yesterday,
      time: '20:15',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-5',
      userId,
      category: 'Travel',
      description: 'Metro recharge',
      amount: 500,
      date: yesterday,
      time: '08:45',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-6',
      userId,
      category: 'Shopping',
      description: 'Amazon book order',
      amount: 650,
      date: dayBefore,
      time: '14:20',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-7',
      userId,
      category: 'Food',
      description: 'Weekly Kirana Store',
      amount: 2150,
      date: dayBefore,
      time: '11:00',
      createdAt: new Date().toISOString(),
    },
  ];

  return { plan, expenses };
}

export const StorageService = {
  // User Profile
  getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  },

  // Budget Plan
  getBudgetPlan(userId?: string): BudgetPlan | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGET_PLAN);
      if (!data) return null;
      const plan: BudgetPlan = JSON.parse(data);
      if (userId && plan.userId !== userId) return null;
      return plan;
    } catch {
      return null;
    }
  },

  saveBudgetPlan(plan: BudgetPlan): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET_PLAN, JSON.stringify(plan));
    } catch (err) {
      console.error('Failed to save budget plan:', err);
    }
  },

  // Expenses
  getExpenses(userId?: string): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!data) return [];
      const list: Expense[] = JSON.parse(data);
      if (userId) {
        return list.filter(e => e.userId === userId);
      }
      return list;
    } catch {
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (err) {
      console.error('Failed to save expenses:', err);
    }
  },

  addExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const expenses = this.getExpenses();
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      date: expenseData.date || getTodayDateString(),
      time: expenseData.time || getCurrentTimeString(),
    };
    const updated = [newExpense, ...expenses];
    this.saveExpenses(updated);
    return newExpense;
  },

  updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): boolean {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return false;

    expenses[index] = { ...expenses[index], ...updates };
    this.saveExpenses(expenses);
    return true;
  },

  deleteExpense(id: string): boolean {
    const expenses = this.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    if (filtered.length === expenses.length) return false;
    this.saveExpenses(filtered);
    return true;
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.BUDGET_PLAN);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  },

  exportBackupJSON(): string {
    const data = {
      profile: this.getUserProfile(),
      plan: this.getBudgetPlan(),
      expenses: this.getExpenses(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) this.saveUserProfile(data.profile);
      if (data.plan) this.saveBudgetPlan(data.plan);
      if (Array.isArray(data.expenses)) this.saveExpenses(data.expenses);
      return true;
    } catch {
      return false;
    }
  },
};

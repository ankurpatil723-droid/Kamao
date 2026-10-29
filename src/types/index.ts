export type CostTier = 'Tier-1' | 'Tier-2' | 'Tier-3';

export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  area?: string;
  district?: string;
  tier: CostTier;
  recommendedRentBracket: string;
  description: string;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Food'
  | 'Travel'
  | 'Food Delivery'
  | 'EMI'
  | 'Shopping'
  | 'Impulse'
  | 'Gifts'
  | 'Emergency'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  pincode: string;
  city: string;
  state: string;
  area: string;
  tier: CostTier;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetPlan {
  id: string;
  userId: string;
  monthlyIncome: number;
  rent: number;
  rentBracket: string;
  foodGroceries: number;
  travel: number;
  foodDelivery: number;
  emi: number;
  emiBracket: string;
  shoppingEntertainment: number;
  impulse: number;
  impulseBracket: string;
  giftsOccasions: number;
  emergencyFund: number;
  totalPlannedSpend: number;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: string;
}

export type ViewTab = 'day' | 'month' | 'year';
export type MainTab = 'planner' | 'tracker' | 'insights';

export interface CategoryBudgetStatus {
  category: ExpenseCategory;
  planned: number;
  actual: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

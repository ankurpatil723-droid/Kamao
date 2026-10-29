import React from 'react';
import { BudgetPlan, Expense, UserProfile, ExpenseCategory } from '../../types';
import { formatINR, CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/formatters';
import { StorageService } from '../../services/storageService';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Download,
  Upload,
  Zap,
  Flame,
  Award,
  LogOut,
  Trash2,
} from '../common/Icons';

interface InsightsOverviewProps {
  user: UserProfile | null;
  budgetPlan: BudgetPlan | null;
  expenses: Expense[];
  onDataImported: () => void;
  onLogout?: () => void;
}

export const InsightsOverview: React.FC<InsightsOverviewProps> = ({
  user,
  budgetPlan,
  expenses,
  onDataImported,
  onLogout,
}) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthTotal = currentMonthExpenses.reduce((a, b) => a + b.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  currentMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
  const highestCategory = sortedCategories[0];

  // Daily average this month
  const todayDate = new Date().getDate();
  const dailyAverage = todayDate > 0 ? Math.round(monthTotal / todayDate) : 0;

  // Budget Adherence
  const plannedSpend = budgetPlan ? budgetPlan.totalPlannedSpend : 0;
  const adherence = plannedSpend > 0 ? Math.round((monthTotal / plannedSpend) * 100) : 0;

  const handleExportBackup = () => {
    const json = StorageService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kamao-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && StorageService.importBackupJSON(content)) {
        onDataImported();
        alert('Data backup successfully restored!');
      } else {
        alert('Failed to import backup file. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* Title */}
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-display font-bold text-warmtext">Financial Health & Insights</h2>
        <p className="text-xs text-warmmuted">
          Smart patterns and optimization tips based on your budget blueprint and logged spend.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Daily Burn Rate */}
        <div className="bg-warmcard p-5 rounded-3xl border border-warmborder shadow-warm-sm">
          <div className="flex items-center justify-between text-warmmuted mb-2">
            <span className="text-[11px] uppercase font-bold">Daily Burn Rate</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold font-tabular text-warmtext">
            {formatINR(dailyAverage)}
            <span className="text-xs text-warmmuted font-normal"> /day</span>
          </div>
          <span className="text-[10px] text-warmmuted block mt-1">Average spent this month</span>
        </div>

        {/* Highest Spend Category */}
        <div className="bg-warmcard p-5 rounded-3xl border border-warmborder shadow-warm-sm">
          <div className="flex items-center justify-between text-warmmuted mb-2">
            <span className="text-[11px] uppercase font-bold">Top Expense Driver</span>
            <Zap className="w-4 h-4 text-terracotta-500" />
          </div>
          <div className="text-lg font-bold text-warmtext truncate flex items-center gap-1.5">
            {highestCategory ? (
              <>
                <span>{CATEGORY_ICONS[highestCategory[0] as ExpenseCategory] || '📌'}</span>
                <span>{highestCategory[0]}</span>
              </>
            ) : (
              <span>None Yet</span>
            )}
          </div>
          <span className="text-xs font-bold text-warmtext font-tabular block mt-1">
            {highestCategory ? formatINR(highestCategory[1]) : '₹0'}
          </span>
        </div>

        {/* Adherence */}
        <div className="bg-warmcard p-5 rounded-3xl border border-warmborder shadow-warm-sm">
          <div className="flex items-center justify-between text-warmmuted mb-2">
            <span className="text-[11px] uppercase font-bold">Monthly Velocity</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-tabular text-warmtext">
            {adherence}%
          </div>
          <span className="text-[10px] text-warmmuted block mt-1">
            {adherence > 100 ? 'Over planned budget' : 'Pacing within monthly limit'}
          </span>
        </div>
      </div>

      {/* Smart Indian Budgeting Tips */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 shadow-warm-md space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-terracotta-600" />
          <h3 className="text-base font-bold text-warmtext">Personalized Recommendations</h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          {budgetPlan && budgetPlan.foodDelivery > 4000 && (
            <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 text-orange-950 flex items-start gap-3">
              <span className="text-lg">🛵</span>
              <div>
                <strong className="font-bold block">High Quick Commerce / Delivery Spend</strong>
                <span>
                  You planned {formatINR(budgetPlan.foodDelivery)} for delivery apps (Zomato/Swiggy/Zepto). Cooking 2 more meals a week or batch ordering can easily save ~₹2,000 monthly!
                </span>
              </div>
            </div>
          )}

          {budgetPlan && user && user.tier === 'Tier-1' && budgetPlan.rent > budgetPlan.monthlyIncome * 0.35 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3">
              <span className="text-lg">🏠</span>
              <div>
                <strong className="font-bold block">Tier-1 Rent Proportion</strong>
                <span>
                  Your rent represents {Math.round((budgetPlan.rent / budgetPlan.monthlyIncome) * 100)}% of income. In Tier-1 metros ({user.city}), keeping rent under 30-35% leaves room for high unexpected commute and social costs.
                </span>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <span className="text-lg">🛡️</span>
            <div>
              <strong className="font-bold block">Emergency Fund Rule of Thumb</strong>
              <span>
                Aim for 3 to 6 months of essential living expenses (around {formatINR((budgetPlan?.rent || 15000) * 3 + (budgetPlan?.foodGroceries || 8000) * 3)}) in a high-yield liquid FD or savings account.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Backup & Export / Import */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 shadow-warm-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-warmtext">Data Storage & Backup</h4>
          <p className="text-xs text-warmmuted mt-0.5">
            All your budget data and expenses are safely stored on your device. Export a JSON backup anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportBackup}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-warmborder text-xs font-bold text-warmtext flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Export JSON</span>
          </button>

          <label className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-warmborder text-xs font-bold text-warmtext flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Log Out & Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BudgetPlan, Expense, ExpenseCategory } from '../../types';
import {
  formatINR,
  formatDateDisplay,
  formatTimeDisplay,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from '../../utils/formatters';
import { CategoryProgressBar } from './CategoryProgressBar';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Plus,
  Receipt,
  Layers,
} from '../common/Icons';

interface MonthViewProps {
  expenses: Expense[];
  budgetPlan: BudgetPlan | null;
  onAddClick: () => void;
  onEditClick: (expense: Expense) => void;
  onDeleteClick: (id: string) => void;
  selectedCategory: ExpenseCategory | 'All';
  onSelectCategory: (cat: ExpenseCategory | 'All') => void;
}

const ALL_CATEGORIES: ExpenseCategory[] = [
  'Food Delivery',
  'Food',
  'Travel',
  'Shopping',
  'Impulse',
  'Rent',
  'EMI',
  'Gifts',
  'Emergency',
  'Other',
];

export const MonthView: React.FC<MonthViewProps> = ({
  expenses,
  budgetPlan,
  onAddClick,
  onEditClick,
  onDeleteClick,
  selectedCategory,
  onSelectCategory,
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1); // 1-indexed

  // Change month
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Month prefix string: "YYYY-MM"
  const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  // Filter expenses for this month
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthPrefix));
  const filteredMonthExpenses = monthExpenses.filter((e) =>
    selectedCategory === 'All' ? true : e.category === selectedCategory
  );

  // Month-to-date total
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Map category actuals
  const categoryActuals: Record<ExpenseCategory, number> = {
    Rent: 0,
    Food: 0,
    Travel: 0,
    'Food Delivery': 0,
    EMI: 0,
    Shopping: 0,
    Impulse: 0,
    Gifts: 0,
    Emergency: 0,
    Other: 0,
  };

  monthExpenses.forEach((e) => {
    categoryActuals[e.category] = (categoryActuals[e.category] || 0) + e.amount;
  });

  // Category planned amounts from budgetPlan
  const getPlannedForCategory = (cat: ExpenseCategory): number => {
    if (!budgetPlan) return 0;
    switch (cat) {
      case 'Rent':
        return budgetPlan.rent;
      case 'Food':
        return budgetPlan.foodGroceries;
      case 'Travel':
        return budgetPlan.travel;
      case 'Food Delivery':
        return budgetPlan.foodDelivery;
      case 'EMI':
        return budgetPlan.emi;
      case 'Shopping':
        return budgetPlan.shoppingEntertainment;
      case 'Impulse':
        return budgetPlan.impulse;
      case 'Gifts':
        return budgetPlan.giftsOccasions;
      case 'Emergency':
        return budgetPlan.emergencyFund;
      case 'Other':
        return 0;
    }
  };

  // Group filtered expenses by date in descending order
  const groupedByDate: Record<string, Expense[]> = {};
  filteredMonthExpenses.forEach((e) => {
    if (!groupedByDate[e.date]) {
      groupedByDate[e.date] = [];
    }
    groupedByDate[e.date].push(e);
  });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const monthName = new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const plannedTotal = budgetPlan ? budgetPlan.totalPlannedSpend : 0;
  const budgetUtilization = plannedTotal > 0 ? Math.round((monthTotal / plannedTotal) * 100) : 0;
  const remainingTotal = plannedTotal - monthTotal;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Month Header & Total Card */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-5 sm:p-6 shadow-warm-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-warmborder hover:bg-sand-100 text-warmmuted hover:text-warmtext transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-sand-50 rounded-xl border border-warmborder min-w-[170px] justify-center">
              <Calendar className="w-4 h-4 text-terracotta-600" />
              <span className="text-sm font-bold text-warmtext">{monthName}</span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-warmborder hover:bg-sand-100 text-warmmuted hover:text-warmtext transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month To Date Summary */}
          <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto bg-sand-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-warmborder">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase font-bold text-warmmuted block">
                Month-to-Date Spend
              </span>
              <div className="text-2xl font-bold font-tabular text-warmtext">
                {formatINR(monthTotal)}
              </div>
            </div>

            {budgetPlan && (
              <div className="text-right pl-4 border-l border-warmborder">
                <span className="text-[11px] uppercase font-bold text-warmmuted block">
                  Budget Remaining
                </span>
                <span
                  className={`text-lg font-bold font-tabular ${
                    remainingTotal >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {formatINR(remainingTotal)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress Meter */}
        {budgetPlan && (
          <div className="mt-5 pt-4 border-t border-warmborder/80">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-warmmuted">Monthly Budget Utilization</span>
              <span
                className={`font-tabular ${
                  budgetUtilization > 100
                    ? 'text-red-600 font-extrabold'
                    : budgetUtilization > 80
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {budgetUtilization}% ({formatINR(monthTotal)} of {formatINR(plannedTotal)})
              </span>
            </div>
            <div className="w-full h-2.5 bg-sand-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetUtilization > 100
                    ? 'bg-red-500'
                    : budgetUtilization > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Progress Bars (Actual vs Planned Budget) */}
      {budgetPlan && (
        <div className="bg-warmcard rounded-3xl border border-warmborder p-5 sm:p-6 shadow-warm-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-terracotta-600" />
              <h3 className="text-base font-bold text-warmtext">Category Budgets vs Actual Spend</h3>
            </div>
            <span className="text-xs font-semibold text-warmmuted">{monthName}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_CATEGORIES.filter(
              (cat) => getPlannedForCategory(cat) > 0 || categoryActuals[cat] > 0
            ).map((cat) => (
              <CategoryProgressBar
                key={cat}
                category={cat}
                planned={getPlannedForCategory(cat)}
                actual={categoryActuals[cat] || 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Daily Grouped Expense Log */}
      <div className="bg-warmcard rounded-3xl border border-warmborder shadow-warm-md overflow-hidden">
        <div className="p-4 border-b border-warmborder/80 flex items-center justify-between bg-sand-50/60">
          <span className="text-xs font-bold uppercase tracking-wider text-warmmuted">
            Daily Breakdown ({monthExpenses.length} total entries)
          </span>
          <button
            onClick={onAddClick}
            className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>

        {sortedDates.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-warmmuted flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-warmtext">No expenses found for {monthName}</p>
            <p className="text-xs text-warmmuted">Log an expense to see daily breakdowns.</p>
          </div>
        ) : (
          <div className="divide-y divide-warmborder">
            {sortedDates.map((dateStr) => {
              const dayItems = groupedByDate[dateStr];
              const daySum = dayItems.reduce((acc, curr) => acc + curr.amount, 0);

              return (
                <div key={dateStr} className="p-4 space-y-2.5">
                  {/* Day Subheader */}
                  <div className="flex items-center justify-between pb-1 border-b border-warmborder/40">
                    <span className="text-xs font-bold text-warmtext flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                      {formatDateDisplay(dateStr)} ({dateStr})
                    </span>
                    <span className="text-xs font-bold text-terracotta-700 font-tabular">
                      Day Total: {formatINR(daySum)}
                    </span>
                  </div>

                  {/* Day Entries */}
                  <div className="space-y-1.5 pl-2">
                    {dayItems.map((item) => {
                      const colorMeta = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other'];
                      const icon = CATEGORY_ICONS[item.category] || '📌';

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-sand-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm shrink-0">{icon}</span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-warmtext truncate block">
                                {item.description}
                              </span>
                              <span className="text-[10px] text-warmmuted">
                                {item.category} · {formatTimeDisplay(item.time)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-tabular text-warmtext">
                              {formatINR(item.amount)}
                            </span>
                            <button
                              onClick={() => onEditClick(item)}
                              className="text-xs text-warmmuted hover:text-warmtext p-1"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteClick(item.id)}
                              className="text-xs text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

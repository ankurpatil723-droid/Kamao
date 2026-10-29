import React from 'react';
import { MainTab } from '../../types';
import { PieChart, Receipt, Sparkles, TrendingUp } from './Icons';

interface NavbarProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  hasBudgetPlan: boolean;
  expenseCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  hasBudgetPlan,
  expenseCount,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2">
      <div className="flex bg-warmcard/90 border border-warmborder p-1.5 rounded-2xl shadow-warm-sm gap-1 backdrop-blur-md">
        {/* Tab 1: Budget Planner */}
        <button
          onClick={() => onChangeTab('planner')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            activeTab === 'planner'
              ? 'bg-terracotta-500 text-white shadow-warm-md'
              : 'text-warmmuted hover:text-warmtext hover:bg-sand-100/70'
          }`}
        >
          <PieChart className={`w-4 h-4 ${activeTab === 'planner' ? 'text-white' : 'text-warmmuted'}`} />
          <span>Budget Planner</span>
          {hasBudgetPlan && activeTab !== 'planner' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        {/* Tab 2: Expense Tracker */}
        <button
          onClick={() => onChangeTab('tracker')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            activeTab === 'tracker'
              ? 'bg-terracotta-500 text-white shadow-warm-md'
              : 'text-warmmuted hover:text-warmtext hover:bg-sand-100/70'
          }`}
        >
          <Receipt className={`w-4 h-4 ${activeTab === 'tracker' ? 'text-white' : 'text-warmmuted'}`} />
          <span>Expense Tracker</span>
          {expenseCount > 0 && (
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'tracker'
                  ? 'bg-white/20 text-white'
                  : 'bg-sand-200 text-warmtext'
              }`}
            >
              {expenseCount}
            </span>
          )}
        </button>

        {/* Tab 3: Insights & Analytics */}
        <button
          onClick={() => onChangeTab('insights')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            activeTab === 'insights'
              ? 'bg-terracotta-500 text-white shadow-warm-md'
              : 'text-warmmuted hover:text-warmtext hover:bg-sand-100/70'
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${activeTab === 'insights' ? 'text-white' : 'text-warmmuted'}`} />
          <span>Analytics</span>
        </button>
      </div>
    </div>
  );
};

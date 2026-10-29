import React from 'react';
import { UserProfile, BudgetPlan } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Sparkles, MapPin, RefreshCw, Layers, LogOut } from './Icons';

interface HeaderProps {
  user: UserProfile | null;
  budgetPlan: BudgetPlan | null;
  onResetBudget: () => void;
  onLogout: () => void;
  onLoadSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  budgetPlan,
  onResetBudget,
  onLogout,
  onLoadSampleData,
}) => {
  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-warmborder transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-600 to-terracotta-400 flex items-center justify-center text-white shadow-warm-md font-display font-extrabold text-xl tracking-tight">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold tracking-tight text-warmtext">
                Kamao
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
                India
              </span>
            </div>
            <p className="text-xs text-warmmuted font-medium hidden sm:block">
              Smart Budget Planner & Expense Tracker
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2 bg-white/80 border border-warmborder rounded-full pl-3 pr-2 py-1 shadow-warm-sm">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-warmtext leading-tight flex items-center gap-1">
                    {user.name}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  </span>
                  <span className="text-[11px] text-warmmuted flex items-center gap-0.5 leading-tight">
                    <MapPin className="w-3 h-3 text-terracotta-500" />
                    {user.city} · <span className="font-semibold text-terracotta-600">{user.tier}</span>
                  </span>
                </div>
                <button
                  onClick={onResetBudget}
                  title="Edit Location & Budget Plan"
                  className="p-1.5 text-warmmuted hover:text-terracotta-600 hover:bg-terracotta-50 rounded-full transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Explicit Log Out Button */}
              <button
                onClick={onLogout}
                title="Log Out & Start From Beginning"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold shadow-warm-sm transition-all active:scale-[0.97]"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoadSampleData}
              className="flex items-center gap-1.5 text-xs font-medium bg-white/80 border border-warmborder hover:border-terracotta-300 text-warmtext px-3 py-1.5 rounded-full shadow-warm-sm hover:bg-terracotta-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Load Demo Data</span>
            </button>
          )}

          {budgetPlan && (
            <div className="hidden md:flex flex-col text-right bg-sand-100 border border-warmborder px-3 py-1 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-warmmuted">Planned Monthly</span>
              <span className="text-xs font-bold text-warmtext font-tabular">
                {formatINR(budgetPlan.totalPlannedSpend)} / {formatINR(budgetPlan.monthlyIncome)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

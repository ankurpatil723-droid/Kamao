import React from 'react';
import { BudgetPlan, UserProfile, ExpenseCategory } from '../../types';
import { formatINR, CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/formatters';
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  Award,
  Wallet,
} from '../common/Icons';

interface BudgetSummaryProps {
  user: UserProfile;
  budgetPlan: BudgetPlan;
  onEditBudget: () => void;
  onSaveAndTrack: () => void;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  user,
  budgetPlan,
  onEditBudget,
  onSaveAndTrack,
}) => {
  const {
    monthlyIncome,
    rent,
    foodGroceries,
    travel,
    foodDelivery,
    emi,
    shoppingEntertainment,
    impulse,
    giftsOccasions,
    emergencyFund,
    totalPlannedSpend,
    remainingAmount,
  } = budgetPlan;

  const isSurplus = remainingAmount >= 0;
  const savingsRate = monthlyIncome > 0 ? Math.round(((remainingAmount + emergencyFund) / monthlyIncome) * 100) : 0;

  // Breakdown items
  const allocations: { category: ExpenseCategory; name: string; amount: number; desc: string }[] = [
    { category: 'Rent', name: 'Rent / Accommodation', amount: rent, desc: budgetPlan.rentBracket },
    { category: 'Food', name: 'Food & Groceries', amount: foodGroceries, desc: 'Home kitchen & provisions' },
    { category: 'Travel', name: 'Travel & Transport', amount: travel, desc: 'Daily commute & fuel' },
    { category: 'Food Delivery', name: 'Food Delivery Apps', amount: foodDelivery, desc: 'Zomato, Swiggy, Zepto' },
    { category: 'EMI', name: 'EMIs & Loans', amount: emi, desc: budgetPlan.emiBracket },
    { category: 'Shopping', name: 'Shopping & Entertainment', amount: shoppingEntertainment, desc: 'Outings & leisure' },
    { category: 'Impulse', name: 'Impulse Purchases', amount: impulse, desc: budgetPlan.impulseBracket },
    { category: 'Gifts', name: 'Gifts & Celebrations', amount: giftsOccasions, desc: 'Birthdays & festivals' },
    { category: 'Emergency', name: 'Emergency Reserve', amount: emergencyFund, desc: 'Safety net buffer' },
  ].filter((item) => item.amount > 0);

  // 50-30-20 Rule Calculation
  // Needs: Rent + Food + Travel + EMI
  const needsSpend = rent + foodGroceries + travel + emi;
  // Wants: Food Delivery + Shopping + Impulse + Gifts
  const wantsSpend = foodDelivery + shoppingEntertainment + impulse + giftsOccasions;
  // Savings: Emergency Fund + Remaining Surplus
  const totalSavings = emergencyFund + (isSurplus ? remainingAmount : 0);

  const needsPct = monthlyIncome > 0 ? Math.round((needsSpend / monthlyIncome) * 100) : 0;
  const wantsPct = monthlyIncome > 0 ? Math.round((wantsSpend / monthlyIncome) * 100) : 0;
  const savingsPct = monthlyIncome > 0 ? Math.round((totalSavings / monthlyIncome) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 sm:p-8 shadow-warm-lg text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-b from-terracotta-100/40 to-transparent pointer-events-none rounded-full blur-2xl"></div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 border border-warmborder text-xs font-bold text-warmmuted mb-4">
          <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
          <span>{user.name}'s Monthly Blueprint · {user.city} ({user.tier})</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-warmtext tracking-tight">
          Your Monthly Budget Plan
        </h2>
        <p className="text-xs sm:text-sm text-warmmuted mt-1 max-w-md mx-auto">
          Here is how your ₹{monthlyIncome.toLocaleString('en-IN')} income is calibrated against realistic living benchmarks.
        </p>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {/* Monthly Income */}
          <div className="p-4 rounded-2xl bg-sand-50 border border-warmborder/80 text-left">
            <span className="text-[11px] uppercase font-bold text-warmmuted block">Monthly Income</span>
            <div className="text-xl sm:text-2xl font-bold font-tabular text-warmtext mt-1">
              {formatINR(monthlyIncome)}
            </div>
            <span className="text-[10px] text-warmmuted">In-hand earnings</span>
          </div>

          {/* Total Spend */}
          <div className="p-4 rounded-2xl bg-sand-50 border border-warmborder/80 text-left">
            <span className="text-[11px] uppercase font-bold text-warmmuted block">Planned Expenses</span>
            <div className="text-xl sm:text-2xl font-bold font-tabular text-warmtext mt-1">
              {formatINR(totalPlannedSpend)}
            </div>
            <span className="text-[10px] text-warmmuted">
              {Math.round((totalPlannedSpend / (monthlyIncome || 1)) * 100)}% of income
            </span>
          </div>

          {/* Leftover / Deficit */}
          <div
            className={`p-4 rounded-2xl border text-left ${
              isSurplus
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-red-50/80 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold block">
                {isSurplus ? 'Monthly Leftover' : 'Budget Deficit'}
              </span>
              {isSurplus ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold font-tabular mt-1 ${
                isSurplus ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {formatINR(remainingAmount)}
            </div>
            <span className="text-[10px] opacity-80">
              {isSurplus ? `${savingsRate}% total savings potential` : 'Expenses exceed income'}
            </span>
          </div>
        </div>

        {/* Financial health message */}
        <div className="mt-4 p-3.5 rounded-2xl text-xs text-left flex items-start gap-2.5 bg-sand-100/70 border border-warmborder">
          {isSurplus ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-warmtext">Healthy Budget Plan! </strong>
                <span className="text-warmmuted">
                  You have a comfortable buffer of {formatINR(remainingAmount)} after all fixed & lifestyle expenses and emergency allocation.
                </span>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-red-800">Budget Warning: </strong>
                <span className="text-red-700">
                  Your planned spend exceeds your monthly income by {formatINR(Math.abs(remainingAmount))}. Consider trimming impulse purchases or food delivery.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 50 / 30 / 20 Rule Analysis */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 shadow-warm-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-terracotta-600" />
            <h3 className="text-base font-bold text-warmtext">50 / 30 / 20 Rule Benchmark</h3>
          </div>
          <span className="text-xs font-semibold text-warmmuted">Indian standard guide</span>
        </div>

        {/* Visual Multi-segment Bar */}
        <div className="w-full h-4 bg-sand-200 rounded-full flex overflow-hidden shadow-inner mb-3">
          <div
            style={{ width: `${Math.min(100, needsPct)}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`Needs: ${needsPct}%`}
          />
          <div
            style={{ width: `${Math.min(100 - needsPct, wantsPct)}%` }}
            className="bg-terracotta-500 h-full transition-all"
            title={`Wants: ${wantsPct}%`}
          />
          <div
            style={{ width: `${Math.max(0, 100 - needsPct - wantsPct)}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Savings: ${savingsPct}%`}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="block font-bold text-amber-900">Needs ({needsPct}%)</span>
            <span className="text-[11px] text-amber-700 font-tabular">{formatINR(needsSpend)}</span>
            <span className="text-[10px] text-amber-600 block">Target: ~50%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200">
            <span className="block font-bold text-orange-900">Wants ({wantsPct}%)</span>
            <span className="text-[11px] text-orange-700 font-tabular">{formatINR(wantsSpend)}</span>
            <span className="text-[10px] text-orange-600 block">Target: ~30%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="block font-bold text-emerald-900">Savings ({savingsPct}%)</span>
            <span className="text-[11px] text-emerald-700 font-tabular">{formatINR(totalSavings)}</span>
            <span className="text-[10px] text-emerald-600 block">Target: ~20%</span>
          </div>
        </div>
      </div>

      {/* Category Wise Planned Breakdown */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 shadow-warm-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-terracotta-600" />
            <h3 className="text-base font-bold text-warmtext">Category-Wise Allocation</h3>
          </div>
          <button
            onClick={onEditBudget}
            className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Adjust Answers</span>
          </button>
        </div>

        <div className="space-y-3">
          {allocations.map((item) => {
            const pct = Math.round((item.amount / (totalPlannedSpend || 1)) * 100);
            const colorMeta = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other'];
            const icon = CATEGORY_ICONS[item.category] || '📌';

            return (
              <div
                key={item.category}
                className="p-3.5 rounded-2xl bg-sand-50/60 border border-warmborder/80 hover:bg-sand-100/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{icon}</span>
                    <div>
                      <div className="text-sm font-bold text-warmtext">{item.name}</div>
                      <div className="text-[11px] text-warmmuted">{item.desc}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-warmtext font-tabular">{formatINR(item.amount)}</div>
                    <div className="text-[11px] font-semibold text-warmmuted">{pct}% of spend</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-sand-200 rounded-full mt-2.5 overflow-hidden">
                  <div
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colorMeta.bar,
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA: Save & Go to Daily Expense Tracker */}
      <div className="sticky bottom-4 z-20 glass-panel p-4 rounded-3xl shadow-warm-xl border border-warmborder flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left hidden sm:block">
          <span className="text-xs font-bold text-warmtext block">Ready to log daily spending?</span>
          <span className="text-[11px] text-warmmuted">Your plan will guide your live budget progress.</span>
        </div>

        <button
          onClick={onSaveAndTrack}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-warm-lg cursor-pointer transition-all active:scale-[0.99]"
        >
          <span>Save Plan & Open Expense Tracker</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

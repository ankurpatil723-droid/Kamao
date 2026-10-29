import React, { useState } from 'react';
import { Expense } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Calendar, ChevronLeft, ChevronRight, BarChart2, TrendingUp } from '../common/Icons';

interface YearViewProps {
  expenses: Expense[];
  onSelectMonth?: (monthIndex: number) => void;
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const YearView: React.FC<YearViewProps> = ({ expenses }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Filter expenses for selected year
  const yearExpenses = expenses.filter((e) => e.date.startsWith(`${selectedYear}-`));

  // Compute 12 month totals
  const monthTotals: number[] = Array(12).fill(0);
  yearExpenses.forEach((e) => {
    const month = parseInt(e.date.split('-')[1], 10) - 1;
    if (month >= 0 && month < 12) {
      monthTotals[month] += e.amount;
    }
  });

  const yearGrandTotal = monthTotals.reduce((sum, amt) => sum + amt, 0);
  const maxMonthSpend = Math.max(...monthTotals, 1);
  const activeMonths = monthTotals.filter((m) => m > 0).length || 1;
  const monthlyAverage = Math.round(yearGrandTotal / activeMonths);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Year Selector & Annual Summary Card */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-5 sm:p-6 shadow-warm-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="p-2 rounded-xl border border-warmborder hover:bg-sand-100 text-warmmuted hover:text-warmtext transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-4 py-1.5 bg-sand-50 rounded-xl border border-warmborder min-w-[140px] justify-center">
              <Calendar className="w-4 h-4 text-terracotta-600" />
              <span className="text-base font-bold text-warmtext">{selectedYear}</span>
            </div>

            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="p-2 rounded-xl border border-warmborder hover:bg-sand-100 text-warmmuted hover:text-warmtext transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto bg-sand-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-warmborder">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase font-bold text-warmmuted block">
                Annual Spend Total
              </span>
              <div className="text-2xl font-bold font-tabular text-warmtext">
                {formatINR(yearGrandTotal)}
              </div>
            </div>

            <div className="text-right pl-4 border-l border-warmborder">
              <span className="text-[11px] uppercase font-bold text-warmmuted block">
                Monthly Average
              </span>
              <div className="text-base font-bold font-tabular text-terracotta-700">
                {formatINR(monthlyAverage)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Month by Month Interactive Visual Bar Chart */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-5 sm:p-6 shadow-warm-md">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-terracotta-600" />
          <h3 className="text-base font-bold text-warmtext">
            Month-by-Month Spending Distribution ({selectedYear})
          </h3>
        </div>

        {/* 12 Month Bar Graph */}
        <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-48 sm:h-56 pt-6 pb-2 border-b border-warmborder/80">
          {monthTotals.map((total, idx) => {
            const heightPct = Math.max(4, Math.round((total / maxMonthSpend) * 100));
            const isHighest = total > 0 && total === maxMonthSpend;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-warmtext bg-sand-100 px-1.5 py-0.5 rounded shadow-warm-sm mb-1 text-center font-tabular pointer-events-none whitespace-nowrap">
                  {formatINR(total, { compact: true })}
                </div>

                <div className="w-full bg-sand-100 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    style={{ height: `${total === 0 ? 0 : heightPct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isHighest
                        ? 'bg-terracotta-500 shadow-warm-sm'
                        : total > 0
                        ? 'bg-terracotta-400/80 group-hover:bg-terracotta-500'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-warmmuted mt-2">
                  {MONTH_NAMES[idx]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Month by Month List Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-6">
          {monthTotals.map((total, idx) => {
            const hasData = total > 0;
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                  hasData
                    ? 'bg-sand-50/80 border-warmborder'
                    : 'bg-sand-50/20 border-warmborder/40 opacity-60'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-warmtext block">
                    {MONTH_NAMES[idx]} {selectedYear}
                  </span>
                  <span className="text-[10px] text-warmmuted">
                    {hasData ? `${Math.round((total / (yearGrandTotal || 1)) * 100)}% of year` : 'No spend'}
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-bold font-tabular text-warmtext">
                  {formatINR(total)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

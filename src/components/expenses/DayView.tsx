import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import {
  formatINR,
  formatDateDisplay,
  formatTimeDisplay,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  getTodayDateString,
} from '../../utils/formatters';
import {
  Calendar,
  Trash2,
  Edit2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Search,
} from '../common/Icons';

interface DayViewProps {
  expenses: Expense[];
  onAddClick: () => void;
  onEditClick: (expense: Expense) => void;
  onDeleteClick: (id: string) => void;
  selectedCategory: ExpenseCategory | 'All';
  onSelectCategory: (cat: ExpenseCategory | 'All') => void;
}

export const DayView: React.FC<DayViewProps> = ({
  expenses,
  onAddClick,
  onEditClick,
  onDeleteClick,
  selectedCategory,
  onSelectCategory,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState('');

  // Shift date backward/forward by 1 day
  const changeDateByDays = (delta: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + delta);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newD = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  // Filter expenses for this day & category & search
  const dayExpenses = expenses.filter((e) => e.date === selectedDate);
  const filteredExpenses = dayExpenses.filter((e) => {
    const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate day total
  const dayTotal = dayExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Date Navigation & Running Daily Total Header */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-5 shadow-warm-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => changeDateByDays(-1)}
            className="p-2 rounded-xl border border-warmborder hover:bg-sand-100 text-warmmuted hover:text-warmtext transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-sand-50 rounded-xl border border-warmborder">
            <Calendar className="w-4 h-4 text-terracotta-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-warmtext focus:outline-none cursor-pointer"
            />
            {isToday && (
              <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                Today
              </span>
            )}
          </div>

          <button
            onClick={() => changeDateByDays(1)}
            disabled={isToday}
            className={`p-2 rounded-xl border border-warmborder transition-colors ${
              isToday
                ? 'opacity-40 cursor-not-allowed text-warmmuted'
                : 'hover:bg-sand-100 text-warmmuted hover:text-warmtext'
            }`}
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Running Day Total Metric */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto bg-sand-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-warmborder">
          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase font-bold text-warmmuted block">
              Daily Running Total
            </span>
            <span className="text-2xl font-bold font-tabular text-warmtext">
              {formatINR(dayTotal)}
            </span>
          </div>

          <button
            onClick={onAddClick}
            className="px-4 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-warm-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Spend</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-warmmuted" />
          <input
            type="text"
            placeholder="Search description (e.g. Zepto, Metro, Chai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-warmborder bg-white text-xs font-medium text-warmtext focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          />
        </div>
      </div>

      {/* Running Spreadsheet / Sheet Log Table */}
      <div className="bg-warmcard rounded-3xl border border-warmborder shadow-warm-md overflow-hidden">
        <div className="p-4 border-b border-warmborder/80 flex items-center justify-between bg-sand-50/60">
          <span className="text-xs font-bold uppercase tracking-wider text-warmmuted">
            {formatDateDisplay(selectedDate)} Log ({filteredExpenses.length} entries)
          </span>
          <span className="text-xs font-bold text-warmtext font-tabular">
            Sum: {formatINR(filteredExpenses.reduce((a, b) => a + b.amount, 0))}
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 text-warmmuted flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-warmtext">No expenses logged for this day</p>
              <p className="text-xs text-warmmuted mt-0.5">
                Tap the "+ Add Spend" button above to log your daily purchases.
              </p>
            </div>
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-xs font-bold text-warmtext border border-warmborder transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log first spend</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-warmborder/60">
            {filteredExpenses.map((expense) => {
              const colorMeta = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Other'];
              const icon = CATEGORY_ICONS[expense.category] || '📌';

              return (
                <div
                  key={expense.id}
                  className="p-4 flex items-center justify-between hover:bg-sand-50/70 transition-colors group"
                >
                  {/* Left Column: Icon + Category + Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl ${colorMeta.bg} border ${colorMeta.border} flex items-center justify-center text-lg shrink-0 shadow-xs`}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-warmtext truncate">
                          {expense.description}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${colorMeta.bg} ${colorMeta.text} ${colorMeta.border}`}
                        >
                          {expense.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-warmmuted font-medium block">
                        {formatTimeDisplay(expense.time)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Amount + Actions */}
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold font-tabular text-warmtext">
                      {formatINR(expense.amount)}
                    </span>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditClick(expense)}
                        className="p-1.5 rounded-lg text-warmmuted hover:text-warmtext hover:bg-sand-200 transition-colors"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(expense.id)}
                        className="p-1.5 rounded-lg text-warmmuted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

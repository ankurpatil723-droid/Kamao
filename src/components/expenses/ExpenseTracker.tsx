import React, { useState } from 'react';
import { BudgetPlan, Expense, ExpenseCategory, ViewTab } from '../../types';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { AddExpenseModal } from './AddExpenseModal';
import { CATEGORY_ICONS } from '../../utils/formatters';
import { Plus, Sun, Calendar, BarChart3, Filter } from '../common/Icons';

interface ExpenseTrackerProps {
  userId: string;
  expenses: Expense[];
  budgetPlan: BudgetPlan | null;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORY_FILTER_OPTIONS: (ExpenseCategory | 'All')[] = [
  'All',
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

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  userId,
  expenses,
  budgetPlan,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [viewTab, setViewTab] = useState<ViewTab>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      onUpdateExpense(editingExpense.id, data);
    } else {
      onAddExpense(data);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 pb-16">
      {/* View Switcher Controls (Day / Month / Year) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-warmcard p-2 rounded-2xl border border-warmborder shadow-warm-sm">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setViewTab('day')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewTab === 'day'
                ? 'bg-terracotta-500 text-white shadow-warm-sm'
                : 'text-warmmuted hover:text-warmtext hover:bg-sand-100'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Day View</span>
          </button>

          <button
            onClick={() => setViewTab('month')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewTab === 'month'
                ? 'bg-terracotta-500 text-white shadow-warm-sm'
                : 'text-warmmuted hover:text-warmtext hover:bg-sand-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Month View</span>
          </button>

          <button
            onClick={() => setViewTab('year')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewTab === 'year'
                ? 'bg-terracotta-500 text-white shadow-warm-sm'
                : 'text-warmmuted hover:text-warmtext hover:bg-sand-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Year View</span>
          </button>
        </div>

        {/* Global Quick Add Action */}
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-warm-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Expense</span>
        </button>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
        <span className="text-[11px] font-bold text-warmmuted flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3 text-terracotta-500" />
          Filter:
        </span>
        {CATEGORY_FILTER_OPTIONS.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-warmtext text-white border-warmtext font-bold shadow-xs'
                : 'bg-white/80 hover:bg-sand-100 border-warmborder text-warmmuted hover:text-warmtext'
            }`}
          >
            {cat !== 'All' && <span className="mr-1">{CATEGORY_ICONS[cat]}</span>}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Active Sub-view */}
      {viewTab === 'day' && (
        <DayView
          expenses={expenses}
          onAddClick={handleOpenAddModal}
          onEditClick={handleOpenEditModal}
          onDeleteClick={onDeleteExpense}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {viewTab === 'month' && (
        <MonthView
          expenses={expenses}
          budgetPlan={budgetPlan}
          onAddClick={handleOpenAddModal}
          onEditClick={handleOpenEditModal}
          onDeleteClick={onDeleteExpense}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {viewTab === 'year' && <YearView expenses={expenses} />}

      {/* Add / Edit Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        userId={userId}
      />
    </div>
  );
};

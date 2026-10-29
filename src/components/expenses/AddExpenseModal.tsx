import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import {
  getTodayDateString,
  getCurrentTimeString,
  parseINR,
  POPULAR_PRESETS,
  CATEGORY_ICONS,
} from '../../utils/formatters';
import { X, Plus, Clock, Calendar, Check } from '../common/Icons';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  editingExpense?: Expense | null;
  userId: string;
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

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  userId,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('Food Delivery');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState(getCurrentTimeString());

  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount);
      setDate(editingExpense.date);
      setTime(editingExpense.time);
    } else {
      setCategory('Food Delivery');
      setDescription('');
      setAmount('');
      setDate(getTodayDateString());
      setTime(getCurrentTimeString());
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = typeof amount === 'number' ? amount : parseINR(amount);
    if (!numAmount || numAmount <= 0) return;

    onSave({
      userId,
      category,
      description: description.trim() || category,
      amount: numAmount,
      date,
      time,
    });
    onClose();
  };

  const handleApplyPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setCategory(preset.category);
    setDescription(preset.label);
    if (preset.defaultAmount) {
      setAmount(preset.defaultAmount);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-warmcard w-full max-w-lg rounded-3xl border border-warmborder shadow-warm-xl p-6 sm:p-7 relative overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warmborder/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-bold text-lg">
              {CATEGORY_ICONS[category]}
            </div>
            <h3 className="text-lg font-display font-bold text-warmtext">
              {editingExpense ? 'Edit Expense' : 'Log New Spend'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-warmmuted hover:text-warmtext hover:bg-sand-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 py-4 flex-1 pr-1">
          {/* Amount (Hero Input) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
                ₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                required
                value={amount !== '' ? amount.toLocaleString('en-IN') : ''}
                onChange={(e) => setAmount(parseINR(e.target.value))}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3.5 text-2xl font-bold font-tabular rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Popular Quick Chips for Indian Users */}
          {!editingExpense && (
            <div>
              <span className="text-[11px] font-bold text-warmmuted block mb-1.5">
                Quick Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {POPULAR_PRESETS.slice(0, 10).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 border border-warmborder text-warmtext font-medium transition-colors flex items-center gap-1"
                  >
                    <span>{CATEGORY_ICONS[preset.category]}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    category === cat
                      ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-warm-sm'
                      : 'bg-sand-50/80 border-warmborder text-warmtext hover:bg-sand-100'
                  }`}
                >
                  <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
                  <span className="truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted mb-1.5">
              Description / Merchant
            </label>
            <div className="relative">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Zepto groceries, Travel to office, Chai"
                className="w-full px-4 py-3 rounded-xl border border-warmborder bg-sand-50 text-warmtext font-medium text-sm focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all placeholder:text-warmmuted/50"
              />
            </div>
          </div>

          {/* Date & Time (Auto-filled to now, editable) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-warmmuted" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-warmborder bg-sand-50 text-warmtext font-medium text-xs focus:ring-1 focus:ring-terracotta-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-warmmuted" />
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-warmborder bg-sand-50 text-warmtext font-medium text-xs focus:ring-1 focus:ring-terracotta-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!amount || Number(amount) <= 0}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md transition-all cursor-pointer ${
                amount && Number(amount) > 0
                  ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                  : 'bg-sand-200 text-warmmuted cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{editingExpense ? 'Save Changes' : 'Add Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

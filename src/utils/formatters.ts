import { ExpenseCategory } from '../types';

export function formatINR(amount: number, options: { compact?: boolean; hideSymbol?: boolean } = {}): string {
  const { compact = false, hideSymbol = false } = options;
  const symbol = hideSymbol ? '' : '₹';

  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }

  if (compact && Math.abs(amount) >= 100000) {
    const inLakhs = amount / 100000;
    return `${symbol}${inLakhs % 1 === 0 ? inLakhs.toFixed(0) : inLakhs.toFixed(1)}L`;
  } else if (compact && Math.abs(amount) >= 1000) {
    const inK = amount / 1000;
    return `${symbol}${inK % 1 === 0 ? inK.toFixed(0) : inK.toFixed(1)}k`;
  }

  // Standard Indian numbering format (e.g. 1,00,000)
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export function parseINR(val: string | number): number {
  if (typeof val === 'number') return Math.max(0, val);
  const cleaned = val.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const today = getTodayDateString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Rent: '🏠',
  Food: '🛒',
  Travel: '🚗',
  'Food Delivery': '🛵',
  EMI: '💳',
  Shopping: '🛍️',
  Impulse: '⚡',
  Gifts: '🎁',
  Emergency: '🛡️',
  Other: '📌',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; border: string; bar: string }> = {
  Rent: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', bar: '#D97706' },
  Food: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', bar: '#10B981' },
  Travel: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', bar: '#3B82F6' },
  'Food Delivery': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', bar: '#F97316' },
  EMI: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', bar: '#8B5CF6' },
  Shopping: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200', bar: '#EC4899' },
  Impulse: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', bar: '#EF4444' },
  Gifts: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', bar: '#6366F1' },
  Emergency: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', bar: '#14B8A6' },
  Other: { bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200', bar: '#78716C' },
};

export const POPULAR_PRESETS: { category: ExpenseCategory; label: string; defaultAmount?: number }[] = [
  { category: 'Food Delivery', label: 'Zomato' },
  { category: 'Food Delivery', label: 'Swiggy' },
  { category: 'Food Delivery', label: 'Zepto' },
  { category: 'Food Delivery', label: 'Blinkit' },
  { category: 'Food Delivery', label: 'Instamart' },
  { category: 'Travel', label: 'Uber / Ola' },
  { category: 'Travel', label: 'Metro Smart Card' },
  { category: 'Travel', label: 'Petrol / Fuel' },
  { category: 'Travel', label: 'Auto Rickshaw' },
  { category: 'Food', label: 'Kirana / Grocery' },
  { category: 'Food', label: 'Chai & Snacks' },
  { category: 'Food', label: 'Fruits & Veggies' },
  { category: 'Shopping', label: 'Amazon / Flipkart' },
  { category: 'Shopping', label: 'Myntra / Zara' },
  { category: 'Shopping', label: 'Medicine / Pharmacy' },
  { category: 'Impulse', label: 'Late Night Cravings' },
  { category: 'Impulse', label: 'Random Amazon Buy' },
  { category: 'Rent', label: 'Monthly House Rent' },
  { category: 'EMI', label: 'Credit Card / Loan EMI' },
  { category: 'Emergency', label: 'Doctor / Clinic Visit' },
  { category: 'Gifts', label: 'Birthday / Celebration' },
];

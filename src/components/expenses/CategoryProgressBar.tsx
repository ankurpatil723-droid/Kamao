import React from 'react';
import { ExpenseCategory } from '../../types';
import { formatINR, CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/formatters';
import { AlertCircle } from '../common/Icons';

interface CategoryProgressBarProps {
  category: ExpenseCategory;
  planned: number;
  actual: number;
}

export const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  category,
  planned,
  actual,
}) => {
  const percentage = planned > 0 ? Math.round((actual / planned) * 100) : 0;
  const isOver = planned > 0 && actual > planned;
  const isNearLimit = planned > 0 && actual >= planned * 0.85 && actual <= planned;
  const remaining = planned - actual;

  const colorMeta = CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
  const icon = CATEGORY_ICONS[category] || '📌';

  let barColor = colorMeta.bar;
  if (isOver) barColor = '#DC2626'; // Red for over-budget
  else if (isNearLimit) barColor = '#D97706'; // Amber for 85%+

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-warmborder shadow-warm-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs sm:text-sm font-bold text-warmtext">{category}</span>
        </div>

        <div className="text-right">
          <span className="text-xs sm:text-sm font-bold text-warmtext font-tabular">
            {formatINR(actual)}
          </span>
          {planned > 0 && (
            <span className="text-xs text-warmmuted font-normal font-tabular">
              {' '}/ {formatINR(planned)}
            </span>
          )}
        </div>
      </div>

      {/* Progress Track */}
      {planned > 0 ? (
        <>
          <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
            <div
              style={{
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: barColor,
              }}
              className="h-full rounded-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span
              className={`font-semibold ${
                isOver ? 'text-red-700 font-bold' : isNearLimit ? 'text-amber-700' : 'text-warmmuted'
              }`}
            >
              {percentage}% spent
            </span>

            <span
              className={`font-tabular ${
                isOver
                  ? 'text-red-700 font-bold flex items-center gap-1'
                  : 'text-emerald-700 font-medium'
              }`}
            >
              {isOver ? (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>+{formatINR(Math.abs(remaining))} over budget</span>
                </>
              ) : (
                <span>{formatINR(remaining)} left</span>
              )}
            </span>
          </div>
        </>
      ) : (
        <div className="text-[11px] text-warmmuted italic">No planned budget allocated</div>
      )}
    </div>
  );
};

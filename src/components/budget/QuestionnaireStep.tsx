import React, { useState } from 'react';
import { BudgetPlan, PincodeInfo, UserProfile } from '../../types';
import { formatINR, parseINR } from '../../utils/formatters';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Wallet,
  Building,
  Utensils,
  Car,
  ShoppingBag,
  CreditCard,
  Zap,
  Gift,
  ShieldCheck,
  Bike,
} from '../common/Icons';

interface QuestionnaireStepProps {
  user: UserProfile;
  pincodeInfo: PincodeInfo;
  initialPlan: BudgetPlan | null;
  onBack: () => void;
  onComplete: (plan: BudgetPlan) => void;
}

const RENT_OPTIONS = [
  { bracket: '₹5,000–₹10,000', value: 7500, tierRecommendation: 'Tier-3' },
  { bracket: '₹10,000–₹15,000', value: 12500, tierRecommendation: 'Tier-2' },
  { bracket: '₹15,000–₹20,000', value: 17500, tierRecommendation: 'Tier-1' },
  { bracket: '₹20,000+', value: 25000, tierRecommendation: 'Tier-1' },
];

const EMI_OPTIONS = [
  { bracket: 'No EMI', value: 0 },
  { bracket: '₹1,000–₹5,000', value: 3000 },
  { bracket: '₹5,000–₹10,000', value: 7500 },
  { bracket: '₹10,000+', value: 15000 },
];

const IMPULSE_OPTIONS = [
  { bracket: '₹0', value: 0 },
  { bracket: '₹500–₹2,000', value: 1250 },
  { bracket: '₹2,000–₹5,000', value: 3500 },
  { bracket: '₹5,000+', value: 6500 },
];

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  user,
  pincodeInfo,
  initialPlan,
  onBack,
  onComplete,
}) => {
  // Current active question index (0 to 9 for the 10 questions)
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(initialPlan?.monthlyIncome || 60000);
  
  // Rent default based on PIN code tier
  const defaultRentBracket = pincodeInfo.recommendedRentBracket || '₹10,000–₹15,000';
  const defaultRentObj = RENT_OPTIONS.find(r => r.bracket === defaultRentBracket) || RENT_OPTIONS[1];
  const [rentBracket, setRentBracket] = useState<string>(initialPlan?.rentBracket || defaultRentObj.bracket);
  const [rentValue, setRentValue] = useState<number>(initialPlan?.rent || defaultRentObj.value);

  const [foodGroceries, setFoodGroceries] = useState<number>(initialPlan?.foodGroceries || 8000);
  const [travel, setTravel] = useState<number>(initialPlan?.travel || 4000);
  const [foodDelivery, setFoodDelivery] = useState<number>(initialPlan?.foodDelivery || 3000);

  const [emiBracket, setEmiBracket] = useState<string>(initialPlan?.emiBracket || 'No EMI');
  const [emiValue, setEmiValue] = useState<number>(initialPlan?.emi || 0);

  const [shoppingEntertainment, setShoppingEntertainment] = useState<number>(initialPlan?.shoppingEntertainment || 5000);

  const [impulseBracket, setImpulseBracket] = useState<string>(initialPlan?.impulseBracket || '₹500–₹2,000');
  const [impulseValue, setImpulseValue] = useState<number>(initialPlan?.impulse || 1250);

  const [giftsOccasions, setGiftsOccasions] = useState<number>(initialPlan?.giftsOccasions || 2000);
  const [emergencyFund, setEmergencyFund] = useState<number>(initialPlan?.emergencyFund || 5000);

  // Total Planned calculation
  const totalPlannedSpend =
    rentValue +
    foodGroceries +
    travel +
    foodDelivery +
    emiValue +
    shoppingEntertainment +
    impulseValue +
    giftsOccasions +
    emergencyFund;

  const remainingAmount = monthlyIncome - totalPlannedSpend;

  const handleFinish = () => {
    const plan: BudgetPlan = {
      id: initialPlan?.id || `plan_${Date.now()}`,
      userId: user.id,
      monthlyIncome,
      rent: rentValue,
      rentBracket,
      foodGroceries,
      travel,
      foodDelivery,
      emi: emiValue,
      emiBracket,
      shoppingEntertainment,
      impulse: impulseValue,
      impulseBracket,
      giftsOccasions,
      emergencyFund,
      totalPlannedSpend,
      remainingAmount,
      createdAt: initialPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onComplete(plan);
  };

  const questions = [
    // 1. Income
    {
      id: 1,
      title: 'What is your monthly in-hand income?',
      subtitle: 'Enter your total monthly earnings after tax.',
      icon: Wallet,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={monthlyIncome ? monthlyIncome.toLocaleString('en-IN') : ''}
              onChange={(e) => setMonthlyIncome(parseINR(e.target.value))}
              placeholder="e.g. 60,000"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          {/* Quick Shortcuts */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[30000, 50000, 75000, 100000, 150000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setMonthlyIncome(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  monthlyIncome === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // 2. Rent
    {
      id: 2,
      title: 'How much do you want to spend on rent?',
      subtitle: `Pre-adjusted for your location (${user.city} · ${user.tier}).`,
      icon: Building,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {RENT_OPTIONS.map((opt) => {
              const isRecommended = opt.bracket === pincodeInfo.recommendedRentBracket;
              const isSelected = rentBracket === opt.bracket;

              return (
                <button
                  key={opt.bracket}
                  type="button"
                  onClick={() => {
                    setRentBracket(opt.bracket);
                    setRentValue(opt.value);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-terracotta-50 border-2 border-terracotta-500 shadow-warm-sm'
                      : 'bg-sand-50/60 border-warmborder hover:bg-sand-100 hover:border-warmmuted/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-base text-warmtext font-tabular">{opt.bracket}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-terracotta-600" />}
                  </div>

                  {isRecommended && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-800 bg-terracotta-100/80 px-2 py-0.5 rounded-md self-start border border-terracotta-200">
                      <Sparkles className="w-3 h-3 text-terracotta-600" />
                      <span>Recommended for {user.tier}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom rent override */}
          <div className="pt-2 flex items-center gap-2 text-xs text-warmmuted">
            <span>Exact planned amount:</span>
            <div className="relative inline-block w-36">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-warmmuted">₹</span>
              <input
                type="text"
                value={rentValue ? rentValue.toLocaleString('en-IN') : ''}
                onChange={(e) => setRentValue(parseINR(e.target.value))}
                className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-warmborder bg-white text-warmtext font-bold text-xs focus:ring-1 focus:ring-terracotta-500 outline-none"
              />
            </div>
          </div>
        </div>
      ),
    },

    // 3. Food/Groceries
    {
      id: 3,
      title: 'How much do you spend on food & groceries every month?',
      subtitle: 'Include home groceries, milk, vegetables, fruits, and basic provisions.',
      icon: Utensils,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={foodGroceries ? foodGroceries.toLocaleString('en-IN') : ''}
              onChange={(e) => setFoodGroceries(parseINR(e.target.value))}
              placeholder="e.g. 8,000"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[4000, 6000, 8000, 12000, 15000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setFoodGroceries(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  foodGroceries === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // 4. Travel / Transportation
    {
      id: 4,
      title: 'How much do you spend on travel & transportation?',
      subtitle: 'Daily commute, metro/bus passes, fuel, auto-rickshaws, or cab rides.',
      icon: Car,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={travel ? travel.toLocaleString('en-IN') : ''}
              onChange={(e) => setTravel(parseINR(e.target.value))}
              placeholder="e.g. 4,000"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1500, 3000, 5000, 8000, 12000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTravel(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  travel === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // 5. Food Delivery Apps
    {
      id: 5,
      title: 'How much do you spend on food & quick commerce delivery apps?',
      subtitle: 'Zomato, Swiggy, Zepto, Blinkit, Instamart, etc.',
      icon: Bike,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={foodDelivery ? foodDelivery.toLocaleString('en-IN') : ''}
              onChange={(e) => setFoodDelivery(parseINR(e.target.value))}
              placeholder="e.g. 3,000"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1000, 2500, 4000, 7000, 10000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setFoodDelivery(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  foodDelivery === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // 6. EMI & Loans
    {
      id: 6,
      title: 'Do you have any EMI or loan payments?',
      subtitle: 'Home loan, car loan, phone/laptop EMI, or credit card repayments.',
      icon: CreditCard,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {EMI_OPTIONS.map((opt) => {
              const isSelected = emiBracket === opt.bracket;
              return (
                <button
                  key={opt.bracket}
                  type="button"
                  onClick={() => {
                    setEmiBracket(opt.bracket);
                    setEmiValue(opt.value);
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-terracotta-50 border-2 border-terracotta-500 shadow-warm-sm font-bold text-warmtext'
                      : 'bg-sand-50/60 border-warmborder hover:bg-sand-100 text-warmtext'
                  }`}
                >
                  <span className="font-semibold text-base font-tabular">{opt.bracket}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-terracotta-600" />}
                </button>
              );
            })}
          </div>
          {emiValue > 0 && (
            <div className="pt-2 flex items-center gap-2 text-xs text-warmmuted">
              <span>Exact planned monthly EMI:</span>
              <div className="relative inline-block w-36">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-warmmuted">₹</span>
                <input
                  type="text"
                  value={emiValue ? emiValue.toLocaleString('en-IN') : ''}
                  onChange={(e) => setEmiValue(parseINR(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-warmborder bg-white text-warmtext font-bold text-xs focus:ring-1 focus:ring-terracotta-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ),
    },

    // 7. Shopping & Entertainment
    {
      id: 7,
      title: 'How much do you spend on shopping & entertainment?',
      subtitle: 'Clothes, gadgets, movies, OTT subscriptions, weekend outings.',
      icon: ShoppingBag,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={shoppingEntertainment ? shoppingEntertainment.toLocaleString('en-IN') : ''}
              onChange={(e) => setShoppingEntertainment(parseINR(e.target.value))}
              placeholder="e.g. 5,000"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[2000, 4000, 6000, 10000, 15000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setShoppingEntertainment(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  shoppingEntertainment === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // 8. Impulse purchases
    {
      id: 8,
      title: 'How much do you spend on unnecessary or impulse purchases?',
      subtitle: 'Late night flash sales, random accessories, extra café splurges.',
      icon: Zap,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {IMPULSE_OPTIONS.map((opt) => {
              const isSelected = impulseBracket === opt.bracket;
              return (
                <button
                  key={opt.bracket}
                  type="button"
                  onClick={() => {
                    setImpulseBracket(opt.bracket);
                    setImpulseValue(opt.value);
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-terracotta-50 border-2 border-terracotta-500 shadow-warm-sm font-bold text-warmtext'
                      : 'bg-sand-50/60 border-warmborder hover:bg-sand-100 text-warmtext'
                  }`}
                >
                  <span className="font-semibold text-base font-tabular">{opt.bracket}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-terracotta-600" />}
                </button>
              );
            })}
          </div>
          {impulseValue > 0 && (
            <div className="pt-2 flex items-center gap-2 text-xs text-warmmuted">
              <span>Exact planned amount:</span>
              <div className="relative inline-block w-36">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-warmmuted">₹</span>
                <input
                  type="text"
                  value={impulseValue ? impulseValue.toLocaleString('en-IN') : ''}
                  onChange={(e) => setImpulseValue(parseINR(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-warmborder bg-white text-warmtext font-bold text-xs focus:ring-1 focus:ring-terracotta-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ),
    },

    // 9. Gifts & Parties
    {
      id: 9,
      title: 'How much do you spend on gifts, parties & special occasions?',
      subtitle: 'Birthdays, festivals (Diwali/Eid), weddings, family dinners.',
      icon: Gift,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={giftsOccasions ? giftsOccasions.toLocaleString('en-IN') : ''}
              onChange={(e) => setGiftsOccasions(parseINR(e.target.value))}
              placeholder="e.g. 2,500"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1000, 2500, 5000, 8000, 12000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setGiftsOccasions(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  giftsOccasions === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // 10. Emergency Fund
    {
      id: 10,
      title: 'How much do you want to keep aside for unexpected expenses / emergency fund?',
      subtitle: 'Medical emergencies, sudden travel, buffer savings.',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-warmmuted">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={emergencyFund ? emergencyFund.toLocaleString('en-IN') : ''}
              onChange={(e) => setEmergencyFund(parseINR(e.target.value))}
              placeholder="e.g. 5,000"
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-warmborder bg-sand-50 text-warmtext focus:border-terracotta-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[2000, 5000, 10000, 15000, 20000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setEmergencyFund(amt)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  emergencyFund === amt
                    ? 'bg-terracotta-500 text-white font-bold border-terracotta-600'
                    : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentQ = questions[currentStep];
  const StepIcon = currentQ.icon;
  const isLastQuestion = currentStep === questions.length - 1;

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in pb-8">
      {/* Top Floating Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold text-warmmuted mb-1.5 px-1">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta-500 to-terracotta-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 sm:p-8 shadow-warm-lg transition-all">
        {/* Step Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 bg-terracotta-50 px-2.5 py-1 rounded-lg border border-terracotta-200">
              Step {currentStep + 1}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-warmtext tracking-tight leading-snug">
            {currentQ.title}
          </h2>
          <p className="text-xs sm:text-sm text-warmmuted mt-1 font-medium">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Question Interactive Content */}
        <div className="min-h-[160px] flex flex-col justify-center">
          {currentQ.content}
        </div>

        {/* Live Running Budget Tracker Footer */}
        <div className="mt-8 pt-4 border-t border-warmborder/80 flex items-center justify-between bg-sand-50/70 -mx-6 -mb-6 p-4 sm:-mx-8 sm:-mb-8 sm:p-6 rounded-b-3xl">
          <div>
            <span className="text-[11px] uppercase font-bold text-warmmuted block">Total Planned Spend</span>
            <span className="text-base font-bold text-warmtext font-tabular">
              {formatINR(totalPlannedSpend)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase font-bold text-warmmuted block">Remaining / Surplus</span>
            <span
              className={`text-base font-bold font-tabular flex items-center justify-end gap-1 ${
                remainingAmount >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {remainingAmount >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              {formatINR(remainingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else {
              onBack();
            }
          }}
          className="px-5 py-3.5 rounded-2xl border border-warmborder bg-white hover:bg-sand-100 text-warmtext font-bold text-sm flex items-center gap-2 shadow-warm-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 0 ? 'Back to Location' : 'Previous'}</span>
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm flex items-center gap-2 shadow-warm-md cursor-pointer transition-all active:scale-[0.99]"
          >
            <span>View Budget Results</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-6 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm flex items-center gap-2 shadow-warm-md cursor-pointer transition-all active:scale-[0.99]"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

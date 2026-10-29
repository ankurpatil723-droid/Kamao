import React, { useState, useEffect } from 'react';
import { BudgetPlan, Expense, MainTab, UserProfile } from './types';
import { StorageService, generateSampleData } from './services/storageService';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { BudgetWizard } from './components/budget/BudgetWizard';
import { ExpenseTracker } from './components/expenses/ExpenseTracker';
import { InsightsOverview } from './components/insights/InsightsOverview';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(() => StorageService.getUserProfile());
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(() => StorageService.getBudgetPlan());
  const [expenses, setExpenses] = useState<Expense[]>(() => StorageService.getExpenses());
  
  // Tab state: if budget plan exists, default to tracker; else default to planner
  const [activeTab, setActiveTab] = useState<MainTab>(() => {
    const hasPlan = !!StorageService.getBudgetPlan();
    return hasPlan ? 'tracker' : 'planner';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Reload data from storage
  const refreshState = () => {
    setUser(StorageService.getUserProfile());
    setBudgetPlan(StorageService.getBudgetPlan());
    setExpenses(StorageService.getExpenses());
  };

  const handlePlanSaved = (newPlan: BudgetPlan, newUser: UserProfile) => {
    setUser(newUser);
    setBudgetPlan(newPlan);
    showToast('Budget plan successfully saved!');
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense = StorageService.addExpense(expenseData);
    setExpenses(StorageService.getExpenses());
    showToast(`Logged: ${newExpense.description} (₹${newExpense.amount})`);
  };

  const handleUpdateExpense = (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    StorageService.updateExpense(id, updates);
    setExpenses(StorageService.getExpenses());
    showToast('Expense updated successfully');
  };

  const handleDeleteExpense = (id: string) => {
    StorageService.deleteExpense(id);
    setExpenses(StorageService.getExpenses());
    showToast('Expense removed');
  };

  const handleLoadSampleData = () => {
    const sampleUser: UserProfile = {
      id: 'usr_sample_1',
      name: 'Aarav Patel',
      pincode: '560034',
      city: 'Bengaluru',
      state: 'Karnataka',
      area: 'Koramangala, Bengaluru',
      tier: 'Tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveUserProfile(sampleUser);

    const { plan, expenses: sampleExpenses } = generateSampleData(sampleUser.id);
    StorageService.saveBudgetPlan(plan);
    StorageService.saveExpenses(sampleExpenses);

    setUser(sampleUser);
    setBudgetPlan(plan);
    setExpenses(sampleExpenses);
    setActiveTab('tracker');
    showToast('Loaded demo budget plan & sample expenses!');
  };

  const handleResetBudget = () => {
    setActiveTab('planner');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out and start fresh from the beginning?')) {
      StorageService.clearAllData();
      setUser(null);
      setBudgetPlan(null);
      setExpenses([]);
      setActiveTab('planner');
      showToast('Logged out! Starting fresh from location setup.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col selection:bg-terracotta-100 selection:text-terracotta-900">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-warmtext text-white px-4 py-2 rounded-2xl shadow-warm-lg text-xs font-bold animate-slide-up flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Header */}
      <Header
        user={user}
        budgetPlan={budgetPlan}
        onResetBudget={handleResetBudget}
        onLogout={handleLogout}
        onLoadSampleData={handleLoadSampleData}
      />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasBudgetPlan={!!budgetPlan}
        expenseCount={expenses.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 pb-12">
        {activeTab === 'planner' && (
          <BudgetWizard
            user={user}
            budgetPlan={budgetPlan}
            onPlanSaved={handlePlanSaved}
            onNavigateTracker={() => setActiveTab('tracker')}
          />
        )}

        {activeTab === 'tracker' && (
          <ExpenseTracker
            userId={user?.id || 'usr_default'}
            expenses={expenses}
            budgetPlan={budgetPlan}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsOverview
            user={user}
            budgetPlan={budgetPlan}
            expenses={expenses}
            onDataImported={refreshState}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="w-full border-t border-warmborder/80 bg-sand-100/50 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-1.5">
          <p className="text-xs font-semibold text-warmtext flex items-center justify-center gap-1.5">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by <strong className="text-terracotta-600 font-bold">Ankur Patil</strong></span>
          </p>
          <p className="text-[11px] text-warmmuted">
            Kamao — Smart Indian Personal Budget Planner & Expense Tracker
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

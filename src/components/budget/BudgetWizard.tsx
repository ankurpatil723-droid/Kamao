import React, { useState } from 'react';
import { BudgetPlan, PincodeInfo, UserProfile } from '../../types';
import { PincodeStep } from './PincodeStep';
import { QuestionnaireStep } from './QuestionnaireStep';
import { BudgetSummary } from './BudgetSummary';
import { StorageService } from '../../services/storageService';

interface BudgetWizardProps {
  user: UserProfile | null;
  budgetPlan: BudgetPlan | null;
  onPlanSaved: (plan: BudgetPlan, user: UserProfile) => void;
  onNavigateTracker: () => void;
}

export const BudgetWizard: React.FC<BudgetWizardProps> = ({
  user,
  budgetPlan,
  onPlanSaved,
  onNavigateTracker,
}) => {
  // If user & plan already exist, show Summary by default; otherwise start at step 1
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(
    budgetPlan && user ? 3 : 1
  );

  const [activeUser, setActiveUser] = useState<UserProfile | null>(user);
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo | null>(
    user
      ? {
          pincode: user.pincode,
          city: user.city,
          state: user.state,
          area: user.area,
          tier: user.tier,
          recommendedRentBracket: user.tier === 'Tier-1' ? '₹15,000–₹20,000' : user.tier === 'Tier-2' ? '₹10,000–₹15,000' : '₹5,000–₹10,000',
          description: '',
        }
      : null
  );
  const [activePlan, setActivePlan] = useState<BudgetPlan | null>(budgetPlan);

  React.useEffect(() => {
    setActiveUser(user);
    setActivePlan(budgetPlan);
    if (!user || !budgetPlan) {
      setCurrentStep(1);
      setPincodeInfo(null);
    } else {
      setPincodeInfo({
        pincode: user.pincode,
        city: user.city,
        state: user.state,
        area: user.area,
        tier: user.tier,
        recommendedRentBracket: user.tier === 'Tier-1' ? '₹15,000–₹20,000' : user.tier === 'Tier-2' ? '₹10,000–₹15,000' : '₹5,000–₹10,000',
        description: '',
      });
    }
  }, [user, budgetPlan]);

  const handlePincodeComplete = (newUser: UserProfile, info: PincodeInfo) => {
    setActiveUser(newUser);
    setPincodeInfo(info);
    StorageService.saveUserProfile(newUser);
    setCurrentStep(2);
  };

  const handleQuestionnaireComplete = (newPlan: BudgetPlan) => {
    setActivePlan(newPlan);
    StorageService.saveBudgetPlan(newPlan);
    if (activeUser) {
      onPlanSaved(newPlan, activeUser);
    }
    setCurrentStep(3);
  };

  const handleSaveAndTrack = () => {
    if (activePlan && activeUser) {
      StorageService.saveBudgetPlan(activePlan);
      StorageService.saveUserProfile(activeUser);
      onPlanSaved(activePlan, activeUser);
    }
    onNavigateTracker();
  };

  return (
    <div className="w-full">
      {currentStep === 1 && (
        <PincodeStep
          initialUser={activeUser}
          onComplete={handlePincodeComplete}
        />
      )}

      {currentStep === 2 && activeUser && pincodeInfo && (
        <QuestionnaireStep
          user={activeUser}
          pincodeInfo={pincodeInfo}
          initialPlan={activePlan}
          onBack={() => setCurrentStep(1)}
          onComplete={handleQuestionnaireComplete}
        />
      )}

      {currentStep === 3 && activeUser && activePlan && (
        <BudgetSummary
          user={activeUser}
          budgetPlan={activePlan}
          onEditBudget={() => setCurrentStep(2)}
          onSaveAndTrack={handleSaveAndTrack}
        />
      )}
    </div>
  );
};

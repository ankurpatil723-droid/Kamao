import React, { useState, useEffect } from 'react';
import { PincodeInfo, UserProfile } from '../../types';
import { lookupPincode } from '../../data/pincodeData';
import { MapPin, Sparkles, Building2, CheckCircle2, ArrowRight, Loader2, Info } from '../common/Icons';

interface PincodeStepProps {
  initialUser: UserProfile | null;
  onComplete: (user: UserProfile, pincodeInfo: PincodeInfo) => void;
}

const SAMPLE_PINCODES = [
  { label: 'Bengaluru (Tier-1)', pin: '560034' },
  { label: 'Mumbai (Tier-1)', pin: '400001' },
  { label: 'Jaipur (Tier-2)', pin: '302001' },
  { label: 'Lucknow (Tier-2)', pin: '226010' },
  { label: 'Shimla (Tier-3)', pin: '171001' },
];

export const PincodeStep: React.FC<PincodeStepProps> = ({ initialUser, onComplete }) => {
  const [name, setName] = useState(initialUser?.name || '');
  const [pincode, setPincode] = useState(initialUser?.pincode || '');
  const [loading, setLoading] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-resolve PIN code when 6 digits are typed
  useEffect(() => {
    const cleaned = pincode.replace(/\D/g, '').slice(0, 6);
    if (cleaned !== pincode) {
      setPincode(cleaned);
      return;
    }

    if (cleaned.length === 6) {
      let isCancelled = false;
      setLoading(true);
      setError(null);

      lookupPincode(cleaned)
        .then((info) => {
          if (isCancelled) return;
          if (info) {
            setPincodeInfo(info);
            setError(null);
          } else {
            setError('Could not locate postal info for this PIN. Please check the 6 digits.');
            setPincodeInfo(null);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setError('Network error resolving PIN code. Using offline estimate.');
          }
        })
        .finally(() => {
          if (!isCancelled) setLoading(false);
        });

      return () => {
        isCancelled = true;
      };
    } else {
      setPincodeInfo(null);
      setError(null);
    }
  }, [pincode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!pincodeInfo || pincode.length !== 6) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    const user: UserProfile = {
      id: initialUser?.id || `usr_${Date.now()}`,
      name: name.trim(),
      pincode: pincodeInfo.pincode,
      city: pincodeInfo.city,
      state: pincodeInfo.state,
      area: pincodeInfo.area || pincodeInfo.city,
      tier: pincodeInfo.tier,
      createdAt: initialUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onComplete(user, pincodeInfo);
  };

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Tier-1':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Tier-2':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="bg-warmcard rounded-3xl border border-warmborder p-6 sm:p-8 shadow-warm-lg">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 mb-3 shadow-warm-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-warmtext tracking-tight">
            Where do you live in India?
          </h2>
          <p className="text-sm text-warmmuted mt-1.5 max-w-md mx-auto">
            Living expenses in India vary drastically by location. Enter your 6-digit PIN code to calibrate your personalized budget benchmark.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted mb-2">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3.5 rounded-2xl border border-warmborder bg-sand-50 text-warmtext font-medium text-base focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all placeholder:text-warmmuted/50"
            />
          </div>

          {/* Question 2: PIN Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-warmmuted">
                Indian PIN Code (6 Digits)
              </label>
              <span className="text-[11px] text-warmmuted flex items-center gap-1">
                <MapPin className="w-3 h-3 text-terracotta-500" />
                Auto-derives City & State
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560034"
                className="w-full px-4 py-3.5 text-lg font-mono tracking-widest rounded-2xl border border-warmborder bg-sand-50 text-warmtext font-bold focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all placeholder:text-warmmuted/40"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-terracotta-500 animate-spin" />
                ) : pincodeInfo ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : null}
              </div>
            </div>

            {/* Quick Demo Pins */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-warmmuted font-medium mr-1">Quick pick:</span>
              {SAMPLE_PINCODES.map((item) => (
                <button
                  key={item.pin}
                  type="button"
                  onClick={() => setPincode(item.pin)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    pincode === item.pin
                      ? 'bg-terracotta-500 text-white border-terracotta-600 font-semibold'
                      : 'bg-sand-100/80 hover:bg-sand-200 border-warmborder text-warmtext'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resolved Location & Cost Tier Card */}
          {pincodeInfo && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sand-50 to-warmcard border border-warmborder/80 shadow-warm-sm animate-slide-up space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-warmmuted">
                    Resolved Location
                  </span>
                  <div className="text-base font-bold text-warmtext mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
                    <span>{pincodeInfo.area || pincodeInfo.city}, {pincodeInfo.state}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${getTierBadgeStyle(
                    pincodeInfo.tier
                  )}`}
                >
                  {pincodeInfo.tier}
                </span>
              </div>

              <div className="pt-2 border-t border-warmborder/60 text-xs text-warmmuted flex flex-col gap-1.5">
                <p className="font-medium text-warmtext/90">{pincodeInfo.description}</p>
                <div className="flex items-center gap-2 bg-terracotta-50/80 p-2 rounded-xl text-terracotta-900 border border-terracotta-200/60">
                  <Sparkles className="w-4 h-4 text-terracotta-600 shrink-0" />
                  <span>
                    Suggested Rent Bracket: <strong>{pincodeInfo.recommendedRentBracket}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim() || !pincodeInfo}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-warm-md transition-all duration-200 ${
              name.trim() && pincodeInfo
                ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white cursor-pointer active:scale-[0.99]'
                : 'bg-sand-200 text-warmmuted cursor-not-allowed'
            }`}
          >
            <span>Proceed to Budget Questionnaire</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

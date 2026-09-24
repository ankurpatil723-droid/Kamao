# Kamao (कमाओ) — Personal Budget Planner & Expense Tracker

A modern web application tailored for Indian living standards. **Kamao** calibrates realistic monthly budgets based on Indian PIN codes and tracks daily spending with live running totals.

---

## 🌟 Key Features

### Module 1: Budget Planner
1. **PIN Code Intelligence (Step 1)**:
   - Validates 6-digit Indian PIN codes.
   - Derives City, State, and District automatically (using real-time Postal API with comprehensive offline database fallback).
   - Classifies location into **Tier-1 (Metro)**, **Tier-2**, or **Tier-3 (Semi-Urban)**.
   - Dynamically pre-adjusts suggested rent brackets (e.g. Mumbai/Bengaluru PINs highlight ₹15,000–₹20,000+ vs. smaller towns).

2. **10-Step Guided Questionnaire (Step 2)**:
   - Monthly Income (in ₹)
   - Rent Bracket (pre-highlighted with cost-tier recommendation + custom override)
   - Food & Groceries
   - Travel & Transportation
   - Food Delivery Apps (Zomato, Swiggy, Zepto, Blinkit)
   - EMIs & Loan repayments
   - Shopping & Entertainment
   - Impulse / Unnecessary purchases
   - Gifts, Parties & Special Occasions
   - Emergency Fund Reserve
   - *Real-time running spend counter and leftover indicator throughout the questionnaire.*

3. **Budget Blueprint & Results (Step 3)**:
   - Total planned spend vs. monthly income.
   - Leftover surplus (Green) or budget deficit (Red).
   - **50 / 30 / 20 Rule Benchmark** breakdown (Needs vs. Wants vs. Savings).
   - Category-wise allocation percentage bars.
   - Persistent saving to user profile.

---

### Module 2: Expense Tracker
1. **Running Daily Spreadsheet Log**:
   - Time-stamped entries with Category, Description, Amount (₹), Date & Time.
   - Indian merchant quick presets (Zepto, Swiggy, Zomato, Uber, Metro card, Kirana store, Chai, etc.).
   - Prominent **Running Daily Total** indicator.
2. **Multi-View Analytics**:
   - **Day View**: Today's time-stamped entries, instant search, fast single-click day navigator.
   - **Month View**: Grouped by day, Month-to-Date total, and **Live Progress Bars per category vs. planned budget** with over-budget alerts.
   - **Year View**: Month-by-month spending bar chart, yearly grand total, and monthly averages.
3. **Full CRUD & Category Filters**:
   - Inline edit, delete, and category chip filtering (Rent, Food, Travel, Food Delivery, EMI, Shopping, Impulse, Gifts, Emergency, Other).

---

### Module 3: Analytics & Offline Storage
- **Daily burn rate** and monthly velocity.
- Top expense category detection.
- Contextual financial tips for Indian households.
- **JSON Export / Import** for full data backup.

---

## 🎨 Design System & Palette
- **Warm & Luxurious Aesthetic**: Soft cream/beige/sand backgrounds (`#FAF7F2`, `#F4EDE4`) paired with rich terracotta (`#D9531E`), emerald (`#15803D`), and deep slate (`#1C1917`).
- **Accessible & High-Contrast**: Compliant with WCAG AA standards.
- **Mobile-First**: Optimized for mobile screens and touch interactions.

---

## 🚀 Running the App Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

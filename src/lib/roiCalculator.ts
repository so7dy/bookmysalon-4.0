/**
 * ROI Calculator for Custom Plans
 * Calculates return on investment based on business metrics
 */

export interface ROIConfig {
  avgRevenuePerClient: number;
  missedCallsPerDay: number;
  conversionRate: number; // 0.0 to 1.0
  businessDaysPerMonth: number;
  monthlySubscriptionPrice: number;
}

export interface ROIResults {
  // Current situation
  missedCallsPerMonth: number;
  lostBookings: number;
  lostRevenue: number;
  
  // With BookMySalon AI
  capturedBookings: number;
  extraRevenue: number;
  
  // ROI metrics
  investment: number;
  netProfit: number;
  roiPercentage: number;
  paybackDays: number;
  annualImpact: number;
}

const AI_CAPTURE_RATE = 1.0; // 100% capture rate with AI

/**
 * Calculate ROI metrics
 */
export function calculateROI(config: ROIConfig): ROIResults {
  // Current situation (losing money)
  const missedCallsPerMonth = config.missedCallsPerDay * config.businessDaysPerMonth;
  const lostBookings = Math.round(missedCallsPerMonth * config.conversionRate);
  const lostRevenue = lostBookings * config.avgRevenuePerClient;
  
  // With BookMySalon AI (recovering revenue)
  const capturedBookings = Math.round(missedCallsPerMonth * AI_CAPTURE_RATE * config.conversionRate);
  const extraRevenue = capturedBookings * config.avgRevenuePerClient;
  
  // ROI calculations
  const investment = config.monthlySubscriptionPrice;
  const netProfit = extraRevenue - investment;
  const roiPercentage = investment > 0 ? Math.round((netProfit / investment) * 100) : 0;
  const paybackDays = extraRevenue > 0 ? Math.round((investment / extraRevenue) * 30) : 0;
  const annualImpact = extraRevenue * 12;
  
  return {
    missedCallsPerMonth,
    lostBookings,
    lostRevenue: Math.round(lostRevenue),
    capturedBookings,
    extraRevenue: Math.round(extraRevenue),
    investment,
    netProfit: Math.round(netProfit),
    roiPercentage,
    paybackDays,
    annualImpact: Math.round(annualImpact)
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
  return `${percentage}%`;
}

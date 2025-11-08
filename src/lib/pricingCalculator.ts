/**
 * Pricing Calculator for Custom Plans
 * Calculates monthly subscription price based on usage and configuration
 */

// Backend cost constants
const COST_PER_MINUTE = 0.13;
const PLATFORM_FEE_PER_LOCATION = 5;
const SMS_COST_PER_MESSAGE = 0.005;
const PHONE_NUMBER_COST_PER_LOCATION = 3;
const MULTI_LOCATION_FEE = 25; // Per additional location (first location included)
const PROFIT_MARGIN = 0.55; // 55% profit margin

export interface PricingConfig {
  callsPerMonth: number;
  avgCallDurationMinutes: number;
  locations: number;
  smsConfirmations: boolean;
  smsReminders: boolean;
}

export interface PricingBreakdown {
  voiceCost: number;
  platformCost: number;
  smsCost: number;
  phoneCost: number;
  multiLocationFee: number;
  totalBackendCost: number;
  clientPrice: number;
  annualPrice: number; // with 15% discount
  annualSavings: number;
}

/**
 * Calculate the monthly subscription price for a custom plan
 */
export function calculatePricing(config: PricingConfig): PricingBreakdown {
  // Calculate total minutes (calls are TOTAL across all locations, not per location)
  const totalMinutes = config.callsPerMonth * config.avgCallDurationMinutes;
  
  // Voice cost (based on total minutes, not multiplied by locations)
  const voiceCost = totalMinutes * COST_PER_MINUTE;
  
  // Platform cost (per location)
  const platformCost = PLATFORM_FEE_PER_LOCATION * config.locations;
  
  // SMS cost (count number of SMS features selected)
  // SMS cost is based on total calls, then multiplied by locations for multi-location
  const smsFeatureCount = (config.smsConfirmations ? 1 : 0) + (config.smsReminders ? 1 : 0);
  const smsCost = config.callsPerMonth * config.locations * SMS_COST_PER_MESSAGE * smsFeatureCount;
  
  // Phone cost (per location)
  const phoneCost = PHONE_NUMBER_COST_PER_LOCATION * config.locations;
  
  // Multi-location fee (first location free, $25 for each additional)
  const multiLocationFee = config.locations > 1 ? MULTI_LOCATION_FEE * (config.locations - 1) : 0;
  
  // Total backend cost
  const totalBackendCost = voiceCost + platformCost + smsCost + phoneCost + multiLocationFee;
  
  // Client price (with profit margin)
  const clientPrice = Math.round(totalBackendCost / (1 - PROFIT_MARGIN));
  
  // Annual pricing (15% discount)
  const monthlyPrice = clientPrice;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.85);
  const annualSavings = (monthlyPrice * 12) - annualPrice;
  
  return {
    voiceCost,
    platformCost,
    smsCost,
    phoneCost,
    multiLocationFee,
    totalBackendCost,
    clientPrice,
    annualPrice,
    annualSavings
  };
}

/**
 * Get a formatted price display
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

/**
 * Get the minimum starting price (for display on pricing page)
 */
export function getMinimumPrice(): number {
  // Calculate minimum configuration
  const minConfig: PricingConfig = {
    callsPerMonth: 50,
    avgCallDurationMinutes: 3,
    locations: 1,
    smsConfirmations: false,
    smsReminders: false
  };
  
  return calculatePricing(minConfig).clientPrice;
}

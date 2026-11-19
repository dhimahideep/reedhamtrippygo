import { PricingCommercials, MealPlanCode } from '../types/proposal';

/**
 * Format number into Indian Rupee currency format (e.g. ₹ 4,85,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount <= 0) {
    return '—';
  }
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);
  
  const str = absVal.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${res}`;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
}

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function computeEndDate(startDateStr: string, nights: number): string {
  if (!startDateStr) return '';
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + (nights || 0));
  return date.toISOString().split('T')[0];
}

export const MEAL_PLAN_MAP: Record<MealPlanCode, { name: string; desc: string }> = {
  EP: { name: 'European Plan', desc: 'Room Only' },
  CP: { name: 'Continental Plan', desc: 'Bed & Breakfast' },
  MAP: { name: 'Modified American Plan', desc: 'Breakfast & Dinner' },
  AP: { name: 'American Plan', desc: 'All Meals Included' }
};

export interface PricingBreakdownResult {
  supplierNetLand: number;
  internalPackageCost: number;
  agencyMarginPercent: number;
  agencyMarginAmount: number;
  sellingLandTotal: number;
  flightCostPerPax: number;
  totalFlightCost: number;
  subtotalSellingPrice: number;
  totalClientSellingPrice: number;
  totalPayingPax: number;
  pricePerAdult: number;
  pricePerChild: number;
  isMarginBelowFloor: boolean;
}

export function calculateCommercials(
  pricing: PricingCommercials,
  adults: number = 2,
  children: number = 0
): PricingBreakdownResult {
  const supplierNetLand = Math.max(0, pricing.supplierCostNetDMC || 0);
  const totalPayingPax = Math.max(1, adults + (children > 0 ? children : 0));
  const totalFlightCost = pricing.includeFlights
    ? (pricing.flightCostPerPax || 0) * totalPayingPax
    : 0;

  // Calculate internal package cost
  let internalPackageCost = 0;
  const hasComponents = 
    pricing.landPackage !== undefined || 
    pricing.flightAirfare !== undefined || 
    pricing.hotelStays !== undefined || 
    pricing.visaEntry !== undefined;

  if (hasComponents) {
    const land = (pricing.landPackage?.included !== false) ? (pricing.landPackage?.cost ?? supplierNetLand) : 0;
    const air = (pricing.flightAirfare?.included) ? (pricing.flightAirfare?.cost ?? totalFlightCost) : 0;
    const hotel = (pricing.hotelStays?.included) ? (pricing.hotelStays?.cost ?? 0) : 0;
    const visa = (pricing.visaEntry?.included) ? (pricing.visaEntry?.cost ?? 0) : 0;
    internalPackageCost = land + air + hotel + visa;
  } else {
    internalPackageCost = supplierNetLand + totalFlightCost;
  }

  if (internalPackageCost <= 0 && supplierNetLand > 0) {
    internalPackageCost = supplierNetLand + totalFlightCost;
  }

  // Margin calculation: flat amount vs percentage
  let agencyMarginAmount = 0;
  let marginPercent = Math.max(0, pricing.agencyMarginPercent ?? 12);

  if (pricing.agencyMarginType === 'flat') {
    agencyMarginAmount = Math.max(0, pricing.agencyMarginFlat || 0);
    marginPercent = internalPackageCost > 0 ? Math.round((agencyMarginAmount / internalPackageCost) * 100) : 0;
  } else {
    agencyMarginAmount = Math.round(internalPackageCost * (marginPercent / 100));
  }

  const totalClientSellingPrice = internalPackageCost + agencyMarginAmount;
  const sellingLandTotal = supplierNetLand + Math.round(supplierNetLand * (marginPercent / 100));
  const subtotalSellingPrice = sellingLandTotal;

  // Per pax split
  const childWeight = children > 0 ? 0.7 : 0;
  const weightedPax = adults + (children * childWeight);
  const pricePerAdult = pricing.adultRate && pricing.adultRate > 0
    ? pricing.adultRate
    : (weightedPax > 0 ? Math.round(totalClientSellingPrice / weightedPax) : totalClientSellingPrice);
  const pricePerChild = pricing.childRate && pricing.childRate > 0
    ? pricing.childRate
    : (children > 0 ? Math.round(pricePerAdult * 0.7) : 0);

  return {
    supplierNetLand,
    internalPackageCost,
    agencyMarginPercent: marginPercent,
    agencyMarginAmount,
    sellingLandTotal,
    flightCostPerPax: pricing.flightCostPerPax || 0,
    totalFlightCost,
    subtotalSellingPrice,
    totalClientSellingPrice,
    totalPayingPax,
    pricePerAdult,
    pricePerChild,
    isMarginBelowFloor: marginPercent < 8
  };
}

export type FlightDirection = 'onward' | 'return' | 'intercity';

export interface FlightSector {
  id: string;
  direction: FlightDirection;
  airline: string;
  flightNumber: string;
  date: string;
  depAirport: string;
  depCity: string;
  depTime: string;
  arrAirport: string;
  arrCity: string;
  arrTime: string;
  duration: string;
  stops: string;
  baggageCheckIn: string;
  baggageCabin: string;
  layoverNotes?: string;
  depCityOverride?: string;
  arrCityOverride?: string;
  depAirportFullName?: string;
  arrAirportFullName?: string;
  cabinClass?: string;
  pnr?: string;
  depTerminal?: string;
  arrTerminal?: string;
  arrDate?: string;
}

export type MealPlanCode = 'EP' | 'CP' | 'MAP' | 'AP';

export interface StayProperty {
  id: string;
  hotelName: string;
  city: string;
  roomCategory: string;
  mealPlan: MealPlanCode;
  nights: number;
  nightRangeStart: number;
  nightRangeEnd: number;
  rating?: number;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  overnightStay: string;
  bannerImage?: string;
  highlights?: string[];
}

export type PricingModel = 'package_flights' | 'custom_itemized' | 'total_only';
export type DistributionMode = 'total' | 'per_person';
export type QuoteDisplayFormat = 'all_inclusive' | 'itemized_per_pax' | 'per_person' | 'per_adult' | 'total_package';

export interface PricingComponent {
  included: boolean;
  cost: number;
  note: string;
}

export interface PricingCommercials {
  pricingModel: PricingModel;
  distributionMode: DistributionMode;
  useChildInfantRates?: boolean;
  adultRate?: number;
  childRate?: number;
  infantRate?: number;
  supplierCostNetDMC: number;
  agencyMarginPercent: number;
  agencyMarginType?: 'percentage' | 'flat';
  agencyMarginFlat?: number;
  includeFlights: boolean;
  flightCostPerPax: number;
  tcsPercent: number;
  quoteValidUntil: string;
  displayFormat: QuoteDisplayFormat;
  flightNote?: string;
  // Itemized Package Components
  flightAirfare?: PricingComponent;
  landPackage?: PricingComponent;
  hotelStays?: PricingComponent;
  visaEntry?: PricingComponent;
}

export type ProposalStatus = 'draft' | 'pdf_ready';

export interface Proposal {
  id: string;
  code: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  destinations: string[];
  nights: number;
  days: number;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  rooms: number;
  coverImage: string;
  status: ProposalStatus;
  updatedAt: string;
  flights: FlightSector[];
  stays: StayProperty[];
  daysList: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  pricing: PricingCommercials;
  agencyNotes?: string;
}

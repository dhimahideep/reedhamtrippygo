import { Proposal } from '../types/proposal';

const now = Date.now();

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-baku-001',
    code: 'TG-2026-AZ101',
    title: 'Baku, Azerbaijan Cultural Trail',
    clientName: 'Dhruv Trivedi',
    clientEmail: 'dhruv.trivedi@outlook.com',
    clientPhone: '+91 98201 55667',
    destinations: ['Baku', 'Destination 2'],
    nights: 5,
    days: 6,
    startDate: '2026-11-23',
    endDate: '2026-11-28',
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 44 * 60 * 1000).toISOString(),
    agencyNotes: 'Flame Towers view suite preferred.',
    flights: [
      {
        id: 'fl-bk-1',
        direction: 'onward',
        airline: 'Azerbaijan Airlines',
        flightNumber: 'J2 058',
        date: '2026-11-23',
        depAirport: 'BOM',
        depCity: 'Mumbai',
        depTime: '04:15',
        arrAirport: 'GYD',
        arrCity: 'Baku',
        arrTime: '07:50',
        duration: '4h 35m',
        stops: 'Non-stop',
        baggageCheckIn: '23 kg check-in',
        baggageCabin: '8 kg cabin',
        layoverNotes: 'Direct non-stop flight'
      }
    ],
    stays: [
      {
        id: 'st-bk-1',
        hotelName: 'Four Seasons Hotel Baku',
        city: 'Baku',
        roomCategory: 'Caspian Sea View Deluxe Room',
        mealPlan: 'CP',
        nights: 5,
        nightRangeStart: 1,
        nightRangeEnd: 5,
        rating: 5,
        notes: 'Complimentary boulevard promenade access & thermal pool'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Baku — VIP Airport Meet & Old City Icherisheher',
        description: 'Arrive at Heydar Aliyev International Airport. Private transfer to Four Seasons Hotel. Afternoon tour of the 12th-century Maiden Tower and Shirvanshahs Palace.',
        overnightStay: 'Four Seasons Hotel Baku',
        highlights: ['VIP Arrival', 'Maiden Tower', 'Old City Icherisheher']
      }
    ],
    inclusions: [
      '5 Nights luxury accommodation at Four Seasons Baku',
      'Daily international buffet breakfast',
      'Private airport transfers in executive Mercedes E-Class',
      'Certified English-speaking guide for full-day Old City tour'
    ],
    exclusions: [
      'International flights (quoted as optional line)',
      'Azerbaijan ASAN electronic visa fee',
      'Lunches, dinners, and personal tips'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 200000,
      agencyMarginPercent: 12,
      includeFlights: true,
      flightCostPerPax: 19000,
      tcsPercent: 5,
      quoteValidUntil: '2026-11-15',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-ch-002',
    code: 'TG-2026-CH884',
    title: 'Exquisite Swiss Alps & Scenic Glaciers',
    clientName: 'Dr. Vikram Singhania & Family',
    clientEmail: 'vikram.singhania@apexhealth.in',
    clientPhone: '+91 98201 44521',
    destinations: ['Zurich', 'Lucerne', 'Interlaken', 'Zermatt'],
    nights: 7,
    days: 8,
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    adults: 2,
    children: 1,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 1 * 3600 * 1000).toISOString(),
    agencyNotes: 'VIP high-net-worth clients. Prefer high floor rooms with Matterhorn view.',
    flights: [],
    stays: [
      {
        id: 'st-ch-1',
        hotelName: 'Schweizerhof Hotel & Spa',
        city: 'Lucerne',
        roomCategory: 'Lake View Junior Suite',
        mealPlan: 'CP',
        nights: 2,
        nightRangeStart: 1,
        nightRangeEnd: 2,
        rating: 5,
        notes: 'Includes lakeside breakfast and wellness pass'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Zurich — Scenic First Class Rail to Lucerne',
        description: 'Touch down at Zurich International Airport. Board the scenic Swiss rail to Lucerne. Check in at Hotel Schweizerhof overlooking Lake Lucerne.',
        overnightStay: 'Schweizerhof Hotel & Spa, Lucerne',
        highlights: ['First Class Swiss Pass', 'Lake Lucerne Cruise']
      }
    ],
    inclusions: [
      '7 Nights luxury 5-star accommodation in premium lake & mountain view rooms',
      'Daily international gourmet buffet breakfast',
      '8 Days Consecutive 1st Class Swiss Travel Pass'
    ],
    exclusions: [
      'International airfares',
      'Schengen visa processing fees and mandatory travel insurance'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 420000,
      agencyMarginPercent: 12,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 5,
      quoteValidUntil: '2026-06-30',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-bali-003',
    code: 'TG-2026-ID412',
    title: 'Bespoke Bali & Nusa Penida Private Retreat',
    clientName: 'Rohan & Priyadarshini Mehta',
    clientEmail: 'rohan.mehta@fintechcorp.com',
    clientPhone: '+91 97112 88390',
    destinations: ['Seminyak', 'Ubud', 'Nusa Dua'],
    nights: 6,
    days: 7,
    startDate: '2026-07-10',
    endDate: '2026-07-16',
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 3 * 3600 * 1000).toISOString(),
    agencyNotes: 'Honeymoon couple. Floral bath and beach dinner.',
    flights: [],
    stays: [
      {
        id: 'st-b1',
        hotelName: 'The Kayon Jungle Resort',
        city: 'Ubud',
        roomCategory: 'Kayon Royal Pool Villa',
        mealPlan: 'CP',
        nights: 3,
        nightRangeStart: 1,
        nightRangeEnd: 3,
        rating: 5,
        notes: 'Complimentary afternoon tea and daily yoga sessions'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Bali — VIP Airport Fast-Track to Ubud Highlands',
        description: 'Arrive at Ngurah Rai International Airport. Private transfer to Ubud private pool villa.',
        overnightStay: 'The Kayon Jungle Resort, Ubud',
        highlights: ['VIP Immigration Fast-Track', 'Private Chauffeur']
      }
    ],
    inclusions: [
      '6 Nights accommodation in 5-star pool villa and ocean suite',
      'Daily champagne breakfast',
      'Private dedicated air-conditioned vehicle with chauffeur'
    ],
    exclusions: [
      'International flights',
      'Indonesia Visa on Arrival'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 200000,
      agencyMarginPercent: 15,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 5,
      quoteValidUntil: '2026-07-01',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-raj-004',
    code: 'TG-2026-IN731',
    title: 'Royal Rajasthan Heritage & Palace Trail',
    clientName: 'Karan Johar & Family',
    clientEmail: 'karan.johar@dharmaproductions.com',
    clientPhone: '+91 98200 11223',
    destinations: ['Udaipur', 'Jodhpur', 'Jaipur'],
    nights: 5,
    days: 6,
    startDate: '2026-10-18',
    endDate: '2026-10-23',
    adults: 3,
    children: 1,
    infants: 0,
    rooms: 2,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 1 * 86400 * 1000).toISOString(),
    agencyNotes: 'Connecting suites requested.',
    flights: [],
    stays: [
      {
        id: 'st-r1',
        hotelName: 'Taj Lake Palace',
        city: 'Udaipur',
        roomCategory: 'Luxury Palace Lake View Room',
        mealPlan: 'CP',
        nights: 2,
        nightRangeStart: 1,
        nightRangeEnd: 2,
        rating: 5,
        notes: 'Private heritage palace tour'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Udaipur — Floating Palace on Lake Pichola',
        description: 'Private chauffeur transfer to jetty for escorted boat cruise to Taj Lake Palace.',
        overnightStay: 'Taj Lake Palace, Udaipur',
        highlights: ['Private Boat Arrival', 'Taj Lake Palace']
      }
    ],
    inclusions: [
      '5 Nights luxury palace accommodation',
      'Daily royal buffet breakfast throughout',
      'Dedicated private Toyota Innova HyCross with chauffeur'
    ],
    exclusions: [
      'Domestic airfares',
      'Still and video camera fees at monuments'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 300000,
      agencyMarginPercent: 14,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 0,
      quoteValidUntil: '2026-10-01',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-dxb-005',
    code: 'TG-2026-AE509',
    title: 'Dubai Marina, Desert Luxury & Abu Dhabi',
    clientName: 'Harish & Sunita Patel',
    clientEmail: 'harish.patel@patelchem.com',
    clientPhone: '+91 99040 33810',
    destinations: ['Dubai', 'Abu Dhabi'],
    nights: 5,
    days: 6,
    startDate: '2026-09-20',
    endDate: '2026-09-25',
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 2 * 86400 * 1000).toISOString(),
    agencyNotes: 'Burj Khalifa 148th floor At The Top SKY access.',
    flights: [],
    stays: [
      {
        id: 'st-d1',
        hotelName: 'Address Beach Resort',
        city: 'Dubai Marina',
        roomCategory: 'Marina & Sea View Deluxe Room',
        mealPlan: 'CP',
        nights: 3,
        nightRangeStart: 1,
        nightRangeEnd: 3,
        rating: 5,
        notes: 'Access to 77th floor infinity pool'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Dubai — Marina Luxury & Private Yacht Cruise',
        description: 'Morning arrival at DXB Terminal 3. Evening private 50ft luxury yacht cruise.',
        overnightStay: 'Address Beach Resort, Dubai',
        highlights: ['Private Yacht Cruise', 'Ain Dubai View']
      }
    ],
    inclusions: [
      '5 Nights luxury 5-star accommodation',
      'Daily international buffet breakfast',
      'Private 2-hour yacht cruise'
    ],
    exclusions: [
      'International flights',
      'Dubai Tourism Dirham fee'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 175000,
      agencyMarginPercent: 11,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 5,
      quoteValidUntil: '2026-09-01',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-mld-006',
    code: 'TG-2026-MV108',
    title: 'Paradise Unveiled — Maldives Private Water Villa',
    clientName: 'Aditya & Sanjana Kapoor',
    clientEmail: 'aditya.kapoor@kholdings.com',
    clientPhone: '+91 98199 00445',
    destinations: ['Male', 'Baa Atoll'],
    nights: 4,
    days: 5,
    startDate: '2026-11-05',
    endDate: '2026-11-09',
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 3 * 86400 * 1000).toISOString(),
    agencyNotes: 'Water villa with sunset orientation.',
    flights: [],
    stays: [
      {
        id: 'st-m1',
        hotelName: 'Anantara Kihavah Maldives Villas',
        city: 'Baa Atoll',
        roomCategory: 'Sunset Overwater Pool Villa',
        mealPlan: 'MAP',
        nights: 4,
        nightRangeStart: 1,
        nightRangeEnd: 4,
        rating: 5,
        notes: 'Complimentary private seaplane transfers'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Male — Scenic Seaplane to Baa Atoll',
        description: 'Arrive at Velana International Airport. 35-minute scenic seaplane transfer.',
        overnightStay: 'Anantara Kihavah Maldives Villas',
        highlights: ['Seaplane Flight', 'Sunset Overwater Villa']
      }
    ],
    inclusions: [
      '4 Nights in Sunset Overwater Pool Villa',
      'Daily gourmet breakfast and dinner',
      'Return scenic seaplane transfers'
    ],
    exclusions: [
      'International airfares',
      'Underwater restaurant vintage wine pairings'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 460000,
      agencyMarginPercent: 12,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 5,
      quoteValidUntil: '2026-10-25',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-fr-007',
    code: 'TG-2026-FR304',
    title: 'Paris & French Riviera Curated Escape',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    destinations: ['Paris', 'Nice', 'Cannes'],
    nights: 6,
    days: 7,
    startDate: '2026-09-12',
    endDate: '2026-09-18',
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 4 * 86400 * 1000).toISOString(),
    agencyNotes: 'Draft proposal awaiting client details.',
    flights: [],
    stays: [
      {
        id: 'st-p1',
        hotelName: 'Le Meurice',
        city: 'Paris',
        roomCategory: 'Prestige Room Tuileries Garden View',
        mealPlan: 'CP',
        nights: 3,
        nightRangeStart: 1,
        nightRangeEnd: 3,
        rating: 5,
        notes: 'Complimentary museum pass'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Paris — Private Transfer to Place de la Concorde',
        description: 'Meet your chauffeur at Charles de Gaulle Airport and transfer to Le Meurice.',
        overnightStay: 'Le Meurice, Paris',
        highlights: ['Chauffeur Transfer', 'Tuileries Gardens']
      }
    ],
    inclusions: [
      '6 Nights in luxury 5-star properties in Paris and Nice',
      'Daily French breakfast',
      'First Class TGV train tickets from Paris to Nice'
    ],
    exclusions: [
      'International flights',
      'Schengen visa fees'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 275000,
      agencyMarginPercent: 12,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 5,
      quoteValidUntil: '2026-09-01',
      displayFormat: 'all_inclusive'
    }
  },
  {
    id: 'prop-ks-008',
    code: 'TG-2026-KS219',
    title: 'Serene Kashmir Valley & Dal Lake Houseboat',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    destinations: ['Destination'],
    nights: 4,
    days: 5,
    startDate: '2026-10-04',
    endDate: '2026-10-08',
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80',
    status: 'draft',
    updatedAt: new Date(now - 5 * 86400 * 1000).toISOString(),
    agencyNotes: 'Unpriced itinerary draft.',
    flights: [],
    stays: [
      {
        id: 'st-k1',
        hotelName: 'Sukoon Luxury Houseboat',
        city: 'Srinagar',
        roomCategory: 'Royal Suite',
        mealPlan: 'MAP',
        nights: 2,
        nightRangeStart: 1,
        nightRangeEnd: 2,
        rating: 5,
        notes: 'Includes traditional shikara rides'
      }
    ],
    daysList: [
      {
        dayNumber: 1,
        title: 'Arrival in Srinagar — Shikara Transfer to Houseboat',
        description: 'Scenic transfer across Dal Lake to Sukoon Houseboat with sunset kahwa.',
        overnightStay: 'Sukoon Luxury Houseboat, Srinagar',
        highlights: ['Dal Lake Shikara', 'Sunset Kahwa']
      }
    ],
    inclusions: [
      '4 Nights luxury stay in Srinagar and Gulmarg',
      'Daily breakfast and dinner (MAP)',
      'Private vehicle for transfers'
    ],
    exclusions: [
      'Air tickets',
      'Gondola cable car phase 2 tickets'
    ],
    pricing: {
      pricingModel: 'package_flights',
      distributionMode: 'total',
      supplierCostNetDMC: 0,
      agencyMarginPercent: 10,
      includeFlights: false,
      flightCostPerPax: 0,
      tcsPercent: 0,
      quoteValidUntil: '2026-10-01',
      displayFormat: 'all_inclusive'
    }
  }
];

export const PRESET_COVER_IMAGES = [
  {
    name: 'Switzerland & Alps',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
    tags: 'Mountains, Snow, Glaciers'
  },
  {
    name: 'Bali & Tropical',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    tags: 'Villas, Beaches, Rice Terraces'
  },
  {
    name: 'Rajasthan & Palaces',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    tags: 'Royal, Heritage, Forts'
  },
  {
    name: 'Dubai & Skyline',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    tags: 'Modern, Luxury, Desert'
  },
  {
    name: 'Maldives & Overwater',
    url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80',
    tags: 'Turquoise Lagoon, Villas'
  },
  {
    name: 'Paris & Europe Classic',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    tags: 'Eiffel Tower, Romantic'
  },
  {
    name: 'Kashmir & Dal Lake',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80',
    tags: 'Shikara, Valley, Pine Trees'
  }
];

export const STANDARD_INCLUSIONS_LIBRARY = [
  'Luxury accommodation in handpicked 5-star properties',
  'Daily international buffet breakfast at hotel restaurants',
  'Private airport arrival and departure transfers with chauffeur',
  'Intercity and inter-destination private air-conditioned vehicle transfers',
  'Dedicated English-speaking certified local heritage guides',
  'All monument and attraction entrance tickets as per itinerary',
  'Complimentary high-speed Wi-Fi in rooms and private vehicles',
  '24/7 dedicated on-ground operations & emergency concierge helpline',
  'All prevailing local taxes, resort service fees, and VAT',
  'Baggage handling and bellhop assistance at all properties'
];

export const STANDARD_EXCLUSIONS_LIBRARY = [
  'International and domestic airfares unless explicitly specified',
  'Visa application, biometric fees, and mandatory international travel insurance',
  'Lunches and dinners not explicitly specified in the meal plan',
  'Personal expenses such as laundry, room service, telephone, and mini-bar',
  'Early check-in and late check-out charges',
  'Peak season, festival, and holiday surcharges if applicable',
  'Tips, porterage, and driver gratuities',
  'TCS (Tax Collected at Source) as per Government of India mandate'
];

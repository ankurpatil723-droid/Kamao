import { CostTier, PincodeInfo } from '../types';

interface PincodeMapEntry {
  city: string;
  state: string;
  tier: CostTier;
  area?: string;
}

// Prefix to city/tier mapping for instant offline lookups
const PINCODE_PREFIX_MAP: Record<string, PincodeMapEntry> = {
  // Tier-1 Metros
  '110': { city: 'New Delhi', state: 'Delhi', tier: 'Tier-1', area: 'Central / South Delhi' },
  '111': { city: 'New Delhi', state: 'Delhi', tier: 'Tier-1', area: 'North / West Delhi' },
  '122': { city: 'Gurugram', state: 'Haryana', tier: 'Tier-1', area: 'Cyber City / DLF' },
  '201': { city: 'Noida', state: 'Uttar Pradesh', tier: 'Tier-1', area: 'Sector Area / Expressway' },
  '400': { city: 'Mumbai', state: 'Maharashtra', tier: 'Tier-1', area: 'South / Western Mumbai' },
  '401': { city: 'Thane / Palghar', state: 'Maharashtra', tier: 'Tier-1', area: 'Mumbai Metropolitan' },
  '410': { city: 'Navi Mumbai', state: 'Maharashtra', tier: 'Tier-1', area: 'Vashi / Kharghar' },
  '411': { city: 'Pune', state: 'Maharashtra', tier: 'Tier-1', area: 'Kothrud / Hinjewadi / Baner' },
  '560': { city: 'Bengaluru', state: 'Karnataka', tier: 'Tier-1', area: 'Indiranagar / Koramangala / Whitefield' },
  '561': { city: 'Bengaluru Rural', state: 'Karnataka', tier: 'Tier-2', area: 'Greater Bengaluru' },
  '500': { city: 'Hyderabad', state: 'Telangana', tier: 'Tier-1', area: 'Hitec City / Gachibowli / Banjara Hills' },
  '600': { city: 'Chennai', state: 'Tamil Nadu', tier: 'Tier-1', area: 'OMR / Anna Nagar / T. Nagar' },
  '700': { city: 'Kolkata', state: 'West Bengal', tier: 'Tier-1', area: 'Salt Lake / Park Street / New Town' },
  '380': { city: 'Ahmedabad', state: 'Gujarat', tier: 'Tier-1', area: 'SG Highway / Satellite / Navrangpura' },

  // Tier-2 Cities
  '302': { city: 'Jaipur', state: 'Rajasthan', tier: 'Tier-2', area: 'Malviya Nagar / Vaishali Nagar' },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', tier: 'Tier-2', area: 'Gomti Nagar / Hazratganj' },
  '160': { city: 'Chandigarh', state: 'Chandigarh', tier: 'Tier-2', area: 'Sector 17 / 35' },
  '141': { city: 'Ludhiana', state: 'Punjab', tier: 'Tier-2', area: 'Model Town' },
  '143': { city: 'Amritsar', state: 'Punjab', tier: 'Tier-2', area: 'Ranjit Avenue' },
  '395': { city: 'Surat', state: 'Gujarat', tier: 'Tier-2', area: 'Adajan / Vesu' },
  '390': { city: 'Vadodara', state: 'Gujarat', tier: 'Tier-2', area: 'Alkapuri' },
  '452': { city: 'Indore', state: 'Madhya Pradesh', tier: 'Tier-2', area: 'Vijay Nagar' },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh', tier: 'Tier-2', area: 'MP Nagar' },
  '440': { city: 'Nagpur', state: 'Maharashtra', tier: 'Tier-2', area: 'Dharampeth' },
  '422': { city: 'Nashik', state: 'Maharashtra', tier: 'Tier-2', area: 'College Road' },
  '800': { city: 'Patna', state: 'Bihar', tier: 'Tier-2', area: 'Boring Road / Kankarbagh' },
  '682': { city: 'Kochi', state: 'Kerala', tier: 'Tier-2', area: 'Kakkanad / Marine Drive' },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala', tier: 'Tier-2', area: 'Kowdiar' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu', tier: 'Tier-2', area: 'RS Puram' },
  '625': { city: 'Madurai', state: 'Tamil Nadu', tier: 'Tier-2', area: 'Anna Nagar' },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh', tier: 'Tier-2', area: 'MVP Colony' },
  '520': { city: 'Vijayawada', state: 'Andhra Pradesh', tier: 'Tier-2', area: 'MG Road' },
  '208': { city: 'Kanpur', state: 'Uttar Pradesh', tier: 'Tier-2', area: 'Civil Lines' },
  '282': { city: 'Agra', state: 'Uttar Pradesh', tier: 'Tier-2', area: 'Fatehabad Road' },
  '221': { city: 'Varanasi', state: 'Uttar Pradesh', tier: 'Tier-2', area: 'Lanka' },
  '751': { city: 'Bhubaneswar', state: 'Odisha', tier: 'Tier-2', area: 'Patia / Saheed Nagar' },
  '781': { city: 'Guwahati', state: 'Assam', tier: 'Tier-2', area: 'GS Road / Panbazar' },
  '248': { city: 'Dehradun', state: 'Uttarakhand', tier: 'Tier-2', area: 'Rajpur Road' },
  '492': { city: 'Raipur', state: 'Chhattisgarh', tier: 'Tier-2', area: 'Shankar Nagar' },
  '834': { city: 'Ranchi', state: 'Jharkhand', tier: 'Tier-2', area: 'Doranda / Morabadi' },
  '831': { city: 'Jamshedpur', state: 'Jharkhand', tier: 'Tier-2', area: 'Bistupur' },
  ' Goa': { city: 'Panaji', state: 'Goa', tier: 'Tier-2', area: 'Miramar' },
  '403': { city: 'Goa', state: 'Goa', tier: 'Tier-2', area: 'Panaji / Margao' },
};

// State mapping for first digit of PIN
const REGION_ZONE_MAP: Record<string, { state: string; region: string }> = {
  '1': { state: 'Delhi, Haryana, Punjab, Himachal Pradesh, J&K', region: 'Northern Zone' },
  '2': { state: 'Uttar Pradesh, Uttarakhand', region: 'Northern Zone' },
  '3': { state: 'Rajasthan, Gujarat', region: 'Western Zone' },
  '4': { state: 'Maharashtra, Madhya Pradesh, Chhattisgarh, Goa', region: 'Western/Central Zone' },
  '5': { state: 'Andhra Pradesh, Telangana, Karnataka', region: 'Southern Zone' },
  '6': { state: 'Tamil Nadu, Kerala', region: 'Southern Zone' },
  '7': { state: 'West Bengal, Odisha, North Eastern States', region: 'Eastern Zone' },
  '8': { state: 'Bihar, Jharkhand', region: 'Eastern Zone' },
};

const TIER_1_CITIES = ['delhi', 'mumbai', 'bengaluru', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'gurugram', 'gurgaon', 'noida', 'navi mumbai', 'thane'];
const TIER_2_CITIES = [
  'jaipur', 'lucknow', 'chandigarh', 'surat', 'indore', 'nagpur', 'bhopal', 'patna', 'vadodara',
  'kochi', 'coimbatore', 'visakhapatnam', 'kanpur', 'agra', 'varanasi', 'ludhiana', 'bhubaneswar',
  'guwahati', 'dehradun', 'raipur', 'ranchi', 'jamshedpur', 'goa', 'nashik', 'amritsar', 'madurai',
  'vijayawada', 'thiruvananthapuram', 'mysore', 'mysuru', 'jodhpur', 'gwalior', 'allahabad', 'prayagraj'
];

export function determineTier(cityName: string, stateName: string, district?: string): CostTier {
  const c = cityName.toLowerCase().trim();
  const d = (district || '').toLowerCase().trim();
  
  if (TIER_1_CITIES.some(tc => c.includes(tc) || d.includes(tc))) {
    return 'Tier-1';
  }
  if (TIER_2_CITIES.some(tc => c.includes(tc) || d.includes(tc))) {
    return 'Tier-2';
  }
  return 'Tier-3';
}

export function getTierRentBracket(tier: CostTier): { bracket: string; value: number; label: string } {
  switch (tier) {
    case 'Tier-1':
      return { bracket: '₹15,000–₹20,000', value: 17500, label: '₹15,000–₹20,000 (Recommended for Tier-1 Metro)' };
    case 'Tier-2':
      return { bracket: '₹10,000–₹15,000', value: 12500, label: '₹10,000–₹15,000 (Recommended for Tier-2 City)' };
    case 'Tier-3':
    default:
      return { bracket: '₹5,000–₹10,000', value: 7500, label: '₹5,000–₹10,000 (Recommended for Tier-3 Town/Area)' };
  }
}

export function getTierDescription(tier: CostTier): string {
  switch (tier) {
    case 'Tier-1':
      return 'Major Metro Area (Higher living, rent, & dining costs)';
    case 'Tier-2':
      return 'Growing Urban City (Balanced living costs & affordable rent)';
    case 'Tier-3':
      return 'Emerging Town / Semi-Urban (Low cost of living & economical rent)';
  }
}

export async function lookupPincode(pincode: string): Promise<PincodeInfo | null> {
  const cleaned = pincode.replace(/\D/g, '').trim();
  if (cleaned.length !== 6) return null;

  // Try live API first with 3s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);
    const response = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const city = po.District || po.Block || po.Circle || 'Unknown City';
        const state = po.State || 'India';
        const area = po.Name ? `${po.Name}, ${po.District}` : po.District;
        const tier = determineTier(city, state, po.District);
        const rentInfo = getTierRentBracket(tier);

        return {
          pincode: cleaned,
          city,
          state,
          area,
          district: po.District,
          tier,
          recommendedRentBracket: rentInfo.bracket,
          description: getTierDescription(tier),
        };
      }
    }
  } catch (err) {
    // Graceful fallback to offline mapped database
    console.info('Using offline PIN code resolution', err);
  }

  // Offline Fallback Logic
  const prefix3 = cleaned.substring(0, 3);
  const prefix2 = cleaned.substring(0, 2);
  const prefix1 = cleaned.substring(0, 1);

  if (PINCODE_PREFIX_MAP[prefix3]) {
    const entry = PINCODE_PREFIX_MAP[prefix3];
    const rentInfo = getTierRentBracket(entry.tier);
    return {
      pincode: cleaned,
      city: entry.city,
      state: entry.state,
      area: entry.area || `${entry.city} Area`,
      tier: entry.tier,
      recommendedRentBracket: rentInfo.bracket,
      description: getTierDescription(entry.tier),
    };
  }

  // Fallback based on postal zone
  const zoneInfo = REGION_ZONE_MAP[prefix1] || { state: 'India', region: 'Semi-Urban Area' };
  const tier: CostTier = 'Tier-3';
  const rentInfo = getTierRentBracket(tier);

  return {
    pincode: cleaned,
    city: `Region (${prefix2}xxxx)`,
    state: zoneInfo.state.split(',')[0],
    area: `${zoneInfo.region} (PIN ${cleaned})`,
    tier,
    recommendedRentBracket: rentInfo.bracket,
    description: getTierDescription(tier),
  };
}

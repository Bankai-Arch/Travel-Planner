import { config } from '../config/env';

// ─── City name → IATA airport code map (covers major Indian destinations) ────
const CITY_TO_IATA: Record<string, string> = {
  'goa': 'GOI', 'panaji': 'GOI', 'panjim': 'GOI',
  'mumbai': 'BOM', 'bombay': 'BOM',
  'delhi': 'DEL', 'new delhi': 'DEL',
  'bangalore': 'BLR', 'bengaluru': 'BLR',
  'chennai': 'MAA', 'madras': 'MAA',
  'kolkata': 'CCU', 'calcutta': 'CCU',
  'hyderabad': 'HYD',
  'kochi': 'COK', 'cochin': 'COK', 'kerala': 'COK',
  'jaipur': 'JAI', 'rajasthan': 'JAI',
  'leh': 'IXL', 'ladakh': 'IXL',
  'manali': 'KUU', 'kullu': 'KUU',
  'rishikesh': 'DED', 'haridwar': 'DED', 'dehradun': 'DED',
  'shimla': 'SLV',
  'agra': 'AGR',
  'varanasi': 'VNS', 'banaras': 'VNS', 'benares': 'VNS',
  'pune': 'PNQ',
  'ahmedabad': 'AMD', 'gujarat': 'AMD',
  'amritsar': 'ATQ', 'punjab': 'ATQ',
  'chandigarh': 'IXC',
  'srinagar': 'SXR', 'kashmir': 'SXR',
  'udaipur': 'UDR',
  'jodhpur': 'JDH',
  'bhopal': 'BHO',
  'indore': 'IDR',
  'nagpur': 'NAG',
  'coimbatore': 'CJB',
  'madurai': 'IXM',
  'visakhapatnam': 'VTZ', 'vizag': 'VTZ',
  'bhubaneswar': 'BBI', 'odisha': 'BBI',
  'patna': 'PAT', 'bihar': 'PAT',
  'ranchi': 'IXR', 'jharkhand': 'IXR',
  'raipur': 'RPR',
  'jammu': 'IXJ',
  'port blair': 'IXZ', 'andaman': 'IXZ',
  'guwahati': 'GAU', 'assam': 'GAU',
};

export const getCityCode = (city: string): string | null =>
  CITY_TO_IATA[city.toLowerCase().trim()] ?? null;

// ─── Token cache ──────────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     config.AMADEUS_CLIENT_ID,
      client_secret: config.AMADEUS_CLIENT_SECRET,
    }),
  });

  if (!res.ok) throw new Error('Failed to get Amadeus access token');
  const data: any = await res.json();

  cachedToken  = data.access_token;
  tokenExpiry  = Date.now() + (data.expires_in - 60) * 1000;   // refresh 1 min before expiry
  return cachedToken!;
}

// ─── Hotel interfaces ─────────────────────────────────────────────────────────
export interface AmadeusHotel {
  hotelId:   string;
  name:      string;
  cityCode:  string;
  latitude:  number;
  longitude: number;
  distance?: number;
}

// ─── Fetch hotels by IATA city code ──────────────────────────────────────────
export async function fetchHotelsByCity(cityCode: string, radius = 50): Promise<AmadeusHotel[]> {
  const token = await getAccessToken();

  const url = new URL('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city');
  url.searchParams.set('cityCode',    cityCode);
  url.searchParams.set('radius',      String(radius));
  url.searchParams.set('radiusUnit',  'KM');
  url.searchParams.set('ratings',     '3,4,5');
  url.searchParams.set('hotelSource', 'ALL');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err: any = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.detail || 'Amadeus hotel search failed');
  }

  const json: any = await res.json();
  return (json.data || []).map((h: any) => ({
    hotelId:   h.hotelId,
    name:      h.name,
    cityCode:  h.iataCode,
    latitude:  h.geoCode?.latitude  ?? 0,
    longitude: h.geoCode?.longitude ?? 0,
    distance:  h.distance?.value    ?? 0,
  }));
}

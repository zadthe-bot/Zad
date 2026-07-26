import { Restaurant, Dish } from '../types';
import { saveRestaurantsToFirebase } from './firebase';

export interface UserCoordinates {
  lat: number;
  lng: number;
  addressName: string;
}

// Fallback high quality food photo URLs by cuisine
const CUISINE_PHOTOS: Record<string, string[]> = {
  African: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
  ],
  Pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
  ],
  Burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
  ],
  Cafe: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
  ],
  Asian: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80',
  ],
  General: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80',
  ],
};

function getRandomPhoto(cuisine: string): string {
  const pool = CUISINE_PHOTOS[cuisine] || CUISINE_PHOTOS.General;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Calculate distance between two lat/lng points in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Get current user GPS location using browser Geolocation API
 */
export async function getCurrentGpsLocation(): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Reverse geocode
        try {
          const addressName = await reverseGeocode(lat, lng);
          resolve({ lat, lng, addressName });
        } catch {
          resolve({ lat, lng, addressName: `${lat.toFixed(3)}, ${lng.toFixed(3)}` });
        }
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or type your city.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

/**
 * Reverse geocode lat/lng to city/address string using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
      { headers: { 'User-Agent': 'QuickBiteFoodDelivery/1.0' } }
    );
    if (!res.ok) throw new Error('Geocoding service unavailable');
    const data = await res.json();
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Your Location';
    const state = addr.state || addr.country || '';
    return state ? `${city}, ${state}` : city;
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  }
}

/**
 * Geocode text location (e.g. "Iringa, Tanzania" or "Dar es Salaam") to coordinates
 */
export async function geocodeCity(query: string): Promise<UserCoordinates> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'User-Agent': 'QuickBiteFoodDelivery/1.0' } }
    );
    if (!res.ok) throw new Error('Location lookup failed');
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      return {
        lat,
        lng,
        addressName: data[0].display_name.split(',').slice(0, 2).join(',').trim(),
      };
    }
  } catch (err) {
    console.warn('City geocode error:', err);
  }
  // Default to Iringa coordinates if string contains iringa
  if (query.toLowerCase().includes('iringa')) {
    return { lat: -7.7731, lng: 35.6994, addressName: 'Iringa, Tanzania' };
  }
  throw new Error(`Location "${query}" not found.`);
}

/**
 * Fetch real nearby restaurants around (lat, lng) using OpenStreetMap Overpass API
 */
export async function fetchNearbyRealRestaurants(
  userLat: number,
  userLng: number,
  locationName: string,
  radiusMeters: number = 15000
): Promise<{ restaurants: Restaurant[]; dishes: Record<string, Dish[]> }> {
  console.log(`Fetching real restaurants near ${locationName} (${userLat}, ${userLng})...`);

  // Overpass QL query searching for food places
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"~"restaurant|fast_food|cafe|pub|food_court"](around:${radiusMeters},${userLat},${userLng});
      way["amenity"~"restaurant|fast_food|cafe|pub|food_court"](around:${radiusMeters},${userLat},${userLng});
    );
    out center 25;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.ok) throw new Error('Overpass API query failed');
    const data = await response.json();

    const elements = data.elements || [];
    const validElements = elements.filter((el: any) => el.tags && (el.tags.name || el.tags['name:en']));

    if (validElements.length === 0) {
      console.warn('No OSM named restaurants found, using regional contextual data');
      return generateContextualRegionalRestaurants(userLat, userLng, locationName);
    }

    const fetchedRestaurants: Restaurant[] = [];
    const fetchedDishes: Record<string, Dish[]> = {};

    validElements.slice(0, 12).forEach((el: any, idx: number) => {
      const name = el.tags.name || el.tags['name:en'];
      const lat = el.lat || el.center?.lat || userLat;
      const lng = el.lon || el.center?.lon || userLng;
      const distanceKm = calculateDistanceKm(userLat, userLng, lat, lng);

      const amenity = el.tags.amenity || 'restaurant';
      const cuisineTag = el.tags.cuisine || amenity;
      const cuisinesList = parseCuisines(cuisineTag, name);

      const restId = `real-rest-${el.id || idx + 1}`;
      const address = el.tags['addr:street']
        ? `${el.tags['addr:street']}, ${locationName}`
        : `${locationName} (${distanceKm} km away)`;

      const deliveryTimeMins = Math.max(15, Math.min(50, Math.round(distanceKm * 6 + 15)));
      const rating = parseFloat((4.2 + (idx % 7) * 0.1).toFixed(1));

      const restaurant: Restaurant = {
        id: restId,
        name: name,
        tagline: el.tags.description || `${cuisinesList.join(' • ')} spot in ${locationName}`,
        rating: Math.min(5.0, rating),
        reviewCount: 30 + (idx * 23) % 400,
        deliveryTime: `${deliveryTimeMins}-${deliveryTimeMins + 10} min`,
        deliveryFee: distanceKm > 3 ? parseFloat((1.5 + distanceKm * 0.3).toFixed(2)) : 0,
        minOrder: 10,
        priceRange: idx % 3 === 0 ? '$' : idx % 3 === 1 ? '$$' : '$$$',
        cuisines: cuisinesList,
        bannerImage: getRandomPhoto(cuisinesList[0] || 'General'),
        logoImage: getRandomPhoto(cuisinesList[0] || 'General'),
        address: address,
        isFeatured: idx < 3,
        isFreeDelivery: distanceKm <= 3,
        lat: lat,
        lng: lng,
      };

      // Strict distance check: only include places within 25km of requested location
      if (distanceKm <= 25) {
        fetchedRestaurants.push(restaurant);
        fetchedDishes[restId] = generateDishesForRestaurant(restId, name, cuisinesList);
      }
    });

    // Save fetched real restaurants to Firebase Firestore
    saveRestaurantsToFirebase(fetchedRestaurants).catch((e) =>
      console.warn('Firestore sync background notice:', e)
    );

    return { restaurants: fetchedRestaurants, dishes: fetchedDishes };
  } catch (err) {
    console.warn('Overpass API error, falling back to regional data generator:', err);
    return generateContextualRegionalRestaurants(userLat, userLng, locationName);
  }
}

function parseCuisines(cuisineTag: string, name: string): string[] {
  const nameLower = name.toLowerCase();
  const cuisines: string[] = [];

  if (nameLower.includes('pizza')) cuisines.push('Pizza');
  if (nameLower.includes('burger') || nameLower.includes('bar')) cuisines.push('Burgers');
  if (nameLower.includes('cafe') || nameLower.includes('craft') || nameLower.includes('coffee')) cuisines.push('Drinks');
  if (nameLower.includes('sushi') || nameLower.includes('asian') || nameLower.includes('ramen')) cuisines.push('Asian');
  if (nameLower.includes('taco') || nameLower.includes('mexican')) cuisines.push('Tacos');

  if (cuisineTag) {
    const parts = cuisineTag.split(';').map((s) => s.trim().toLowerCase());
    parts.forEach((p) => {
      if (p.includes('african') || p.includes('swahili') || p.includes('tanzanian')) cuisines.push('African');
      if (p.includes('pizza')) cuisines.push('Pizza');
      if (p.includes('burger')) cuisines.push('Burgers');
      if (p.includes('asian') || p.includes('chinese') || p.includes('indian')) cuisines.push('Asian');
      if (p.includes('coffee') || p.includes('cafe')) cuisines.push('Drinks');
    });
  }

  if (cuisines.length === 0) {
    if (nameLower.includes('africa') || nameLower.includes('iringa') || nameLower.includes('hotel')) {
      cuisines.push('African', 'Healthy');
    } else {
      cuisines.push('General', 'Healthy');
    }
  }

  return Array.from(new Set(cuisines));
}

function generateDishesForRestaurant(restId: string, restName: string, cuisines: string[]): Dish[] {
  const isAfrican = cuisines.includes('African') || restName.toLowerCase().includes('iringa') || restName.toLowerCase().includes('africa') || restName.toLowerCase().includes('craft');

  if (isAfrican) {
    return [
      {
        id: `${restId}-d1`,
        restaurantId: restId,
        name: 'Special Grilled Nyama Choma & Chips',
        description: 'Tender marinated roasted meat served with kachumbari salad and seasoned fries.',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        category: 'Main Course',
        isPopular: true,
      },
      {
        id: `${restId}-d2`,
        restaurantId: restId,
        name: 'Fresh Tilapia Fish & Ugali Special',
        description: 'Pan-fried whole Lake tilapia served with traditional spinach greens and white corn ugali.',
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
        category: 'Seafood',
        isPopular: true,
      },
      {
        id: `${restId}-d3`,
        restaurantId: restId,
        name: 'Swahili Coconut Chicken Curry',
        description: 'Boneless chicken breast simmered in rich coconut milk, cardamom, turmeric, and fragrant rice.',
        price: 11.00,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
        category: 'Curries',
      },
      {
        id: `${restId}-d4`,
        restaurantId: restId,
        name: 'Fresh Passion & Ginger Juice',
        description: 'Chilled local passionfruit elixir infused with fresh ginger root.',
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        category: 'Drinks',
      },
    ];
  }

  return [
    {
      id: `${restId}-d1`,
      restaurantId: restId,
      name: `${restName} House Special Dish`,
      description: 'Chef signature recipe prepared fresh daily with premium local ingredients.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      category: 'Specials',
      isPopular: true,
    },
    {
      id: `${restId}-d2`,
      restaurantId: restId,
      name: 'Artisan Gourmet Burger Meal',
      description: 'Juicy patty served with golden fries and homemade dipping sauce.',
      price: 11.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      category: 'Main',
      isPopular: true,
    },
    {
      id: `${restId}-d3`,
      restaurantId: restId,
      name: 'Refreshing Tropical Smoothie',
      description: 'Fresh blend of mango, banana, and coconut water.',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
      category: 'Drinks',
    },
  ];
}

function generateContextualRegionalRestaurants(
  userLat: number,
  userLng: number,
  locationName: string
): { restaurants: Restaurant[]; dishes: Record<string, Dish[]> } {
  const isIringa = locationName.toLowerCase().includes('iringa');

  // Offset coordinates slightly from user center for realistic local map scatter
  const baseLat = isIringa ? -7.7731 : userLat;
  const baseLng = isIringa ? 35.6994 : userLng;

  const realIringaSpots: Restaurant[] = [
    {
      id: 'iringa-1',
      name: 'Neema Crafts Cafe & Bistro',
      tagline: 'Famous fair-trade cafe in Iringa serving fresh espresso, homemade cakes & organic meals',
      rating: 4.9,
      reviewCount: 310,
      deliveryTime: '15-25 min',
      deliveryFee: 0,
      minOrder: 8,
      priceRange: '$$',
      cuisines: ['Drinks', 'Healthy', 'African'],
      bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
      logoImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
      address: 'Boma Road, Iringa Town, Tanzania',
      isFeatured: true,
      isFreeDelivery: true,
      lat: baseLat + 0.005,
      lng: baseLng + 0.003,
    },
    {
      id: 'iringa-2',
      name: 'Sarafina Restaurant & Grill',
      tagline: 'Authentic local Nyama Choma, grilled chicken, Mishkaki, and Swahili dishes',
      rating: 4.8,
      reviewCount: 215,
      deliveryTime: '20-30 min',
      deliveryFee: 1.0,
      minOrder: 10,
      priceRange: '$',
      cuisines: ['African', 'Burgers'],
      bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      logoImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
      address: ' Uhuru Avenue, Iringa Centre',
      isFeatured: true,
      isFreeDelivery: false,
      lat: baseLat - 0.004,
      lng: baseLng - 0.006,
    },
    {
      id: 'iringa-3',
      name: 'Sunset Hotel & Garden Restaurant',
      tagline: 'Scenic garden view restaurant serving fresh tilapia, steaks & woodfired pizza',
      rating: 4.7,
      reviewCount: 180,
      deliveryTime: '25-35 min',
      deliveryFee: 1.5,
      minOrder: 12,
      priceRange: '$$',
      cuisines: ['Pizza', 'African'],
      bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
      logoImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
      address: 'Gangilonga Rock Road, Iringa',
      isFeatured: false,
      isFreeDelivery: false,
      lat: baseLat + 0.008,
      lng: baseLng - 0.004,
    },
    {
      id: 'iringa-4',
      name: 'Mama Africa Swahili Food Spot',
      tagline: 'Traditional Swahili rice, beans, wali wa nazi & fresh tropical juices',
      rating: 4.8,
      reviewCount: 140,
      deliveryTime: '15-20 min',
      deliveryFee: 0,
      minOrder: 5,
      priceRange: '$',
      cuisines: ['African', 'Healthy'],
      bannerImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1000&q=80',
      logoImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
      address: 'Dodoma Road Junction, Iringa',
      isFeatured: false,
      isFreeDelivery: true,
      lat: baseLat - 0.006,
      lng: baseLng + 0.007,
    },
  ];

  const dishes: Record<string, Dish[]> = {};
  realIringaSpots.forEach((r) => {
    dishes[r.id] = generateDishesForRestaurant(r.id, r.name, r.cuisines);
  });

  return { restaurants: realIringaSpots, dishes };
}

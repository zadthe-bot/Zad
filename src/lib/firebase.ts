import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Restaurant, Order } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Use the custom database ID specified in firebase-applet-config.json
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export const isFirebaseActive = true;
export const isFirebaseConfigured = true;

/**
 * Fetch orders once from Firebase
 */
export async function fetchOrdersFromFirebase(): Promise<any[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    const orders: any[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      });
    });
    return orders;
  } catch (err) {
    console.warn('Error fetching orders from Firestore:', err);
    return [];
  }
}

/**
 * Sync favorite restaurant IDs to Firestore
 */
export async function syncFavoritesWithFirebase(favorites: string[], userId: string = 'guest_user'): Promise<void> {
  try {
    const favDocRef = doc(db, 'user_favorites', userId);
    await setDoc(favDocRef, { favorites, updatedAt: serverTimestamp() });
  } catch (err) {
    console.warn('Error syncing favorites to Firestore:', err);
  }
}

/**
 * Save real restaurants to Firebase Firestore
 */
export async function saveRestaurantsToFirebase(restaurants: Restaurant[]): Promise<void> {
  try {
    for (const rest of restaurants) {
      await setDoc(doc(db, 'restaurants', rest.id), rest, { merge: true });
    }
  } catch (err) {
    console.warn('Error saving real restaurants to Firestore:', err);
  }
}

/**
 * Fetch all restaurants stored in Firebase Firestore
 */
export async function fetchRestaurantsFromFirebase(): Promise<Restaurant[]> {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);
    const results: Restaurant[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as Restaurant);
    });
    return results;
  } catch (err) {
    console.warn('Error fetching restaurants from Firestore:', err);
    return [];
  }
}

/**
 * Seed initial Google Maps restaurant data to Firestore if the 'restaurants' collection is empty
 */
export async function seedAndFetchRestaurants(initialRestaurants: Restaurant[]): Promise<Restaurant[]> {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);

    if (snapshot.empty) {
      console.log('Seeding initial Google Maps restaurant database to Firestore...');
      for (const rest of initialRestaurants) {
        await setDoc(doc(db, 'restaurants', rest.id), rest);
      }
      return initialRestaurants;
    } else {
      const dbRestaurants: Restaurant[] = [];
      snapshot.forEach((docSnap) => {
        dbRestaurants.push(docSnap.data() as Restaurant);
      });
      return dbRestaurants;
    }
  } catch (err) {
    console.warn('Firestore seed/fetch fallback to mock data:', err);
    return initialRestaurants;
  }
}

/**
 * Save an order to Firebase Firestore
 */
export async function saveOrderToFirebase(order: any): Promise<boolean> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
    return false;
  }
}

/**
 * Real-time listener for user orders from Firestore
 */
export function listenToOrdersFromFirebase(onOrdersUpdated: (orders: Order[]) => void) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Order);
      });
      onOrdersUpdated(orders);
    }, (err) => {
      console.warn('Orders listener error:', err);
    });
  } catch (err) {
    console.warn('Could not subscribe to Firestore orders:', err);
    return () => {};
  }
}

/**
 * Sync favorite restaurant IDs to Firestore
 */
export async function syncFavoritesToFirebase(userId: string = 'guest_user', favorites: string[]): Promise<void> {
  try {
    const favDocRef = doc(db, 'user_favorites', userId);
    await setDoc(favDocRef, { favorites, updatedAt: serverTimestamp() });
  } catch (err) {
    console.warn('Error syncing favorites to Firestore:', err);
  }
}

/**
 * Fetch favorite restaurant IDs from Firestore
 */
export async function fetchFavoritesFromFirebase(userId: string = 'guest_user'): Promise<string[]> {
  try {
    const favDocRef = doc(db, 'user_favorites', userId);
    const snap = await getDoc(favDocRef);
    if (snap.exists()) {
      return snap.data().favorites || [];
    }
  } catch (err) {
    console.warn('Error fetching favorites from Firestore:', err);
  }
  return [];
}

export interface CuisineCategory {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
}

export interface DishOption {
  id: string;
  name: string;
  price: number;
}

export interface DishOptionGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelections?: number;
  options: DishOption[];
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  optionGroups?: DishOptionGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  cuisines: string[];
  bannerImage: string;
  logoImage: string;
  address: string;
  isFeatured?: boolean;
  isFreeDelivery?: boolean;
  lat?: number;
  lng?: number;
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface DriverInfo {
  name: string;
  avatar: string;
  vehicle: string;
  plateNumber: string;
  phone: string;
  rating: number;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'picked_up' | 'on_the_way' | 'delivered';

export interface Order {
  id: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  createdAt: Date;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  driver?: DriverInfo;
  userLat?: number;
  userLng?: number;
  driverLat?: number;
  driverLng?: number;
}

export type ActiveTab = 'explore' | 'orders' | 'favorites';

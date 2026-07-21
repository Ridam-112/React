export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  shops: number;
};

export type Product = {
  id: string;
  name: string;
  weight: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: ReturnType<typeof require>;
};

export type Shop = {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  image: ReturnType<typeof require>;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  accentColor: string;
  image: ReturnType<typeof require>;
};

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Grocery', icon: 'cart-outline', color: '#4CAF50', shops: 120 },
  { id: '2', name: 'Medicines', icon: 'medical-bag', color: '#F44336', shops: 85 },
  { id: '3', name: 'Food', icon: 'food-fork-drink', color: '#FF9800', shops: 200 },
  { id: '4', name: 'Dairy', icon: 'cup-water', color: '#2196F3', shops: 45 },
  { id: '5', name: 'Fruits & Veg', icon: 'leaf', color: '#8BC34A', shops: 90 },
  { id: '6', name: 'Stationery', icon: 'pencil', color: '#9C27B0', shops: 30 },
  { id: '7', name: 'Electronics', icon: 'cellphone', color: '#00BCD4', shops: 65 },
  { id: '8', name: 'Fashion', icon: 'hanger', color: '#E91E63', shops: 110 },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Apples',
    weight: '1 kg',
    originalPrice: 120,
    discountedPrice: 89,
    discount: 26,
    image: require('@/assets/images/product1.png'),
  },
  {
    id: '2',
    name: 'Whole Milk',
    weight: '1 L',
    originalPrice: 65,
    discountedPrice: 52,
    discount: 20,
    image: require('@/assets/images/product2.png'),
  },
  {
    id: '3',
    name: 'Paracetamol 500mg',
    weight: '10 tabs',
    originalPrice: 35,
    discountedPrice: 28,
    discount: 20,
    image: require('@/assets/images/product3.png'),
  },
  {
    id: '4',
    name: 'Brown Bread',
    weight: '400 g',
    originalPrice: 55,
    discountedPrice: 42,
    discount: 24,
    image: require('@/assets/images/product4.png'),
  },
  {
    id: '5',
    name: 'Chicken Biryani',
    weight: '500 g',
    originalPrice: 220,
    discountedPrice: 176,
    discount: 20,
    image: require('@/assets/images/product5.png'),
  },
];

export const SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Fresh Mart',
    category: 'Grocery',
    rating: 4.8,
    deliveryTime: '8 min',
    image: require('@/assets/images/shop1.png'),
  },
  {
    id: '2',
    name: 'HealthPlus',
    category: 'Pharmacy',
    rating: 4.6,
    deliveryTime: '12 min',
    image: require('@/assets/images/shop2.png'),
  },
  {
    id: '3',
    name: 'QuickFood',
    category: 'Restaurant',
    rating: 4.5,
    deliveryTime: '15 min',
    image: require('@/assets/images/shop3.png'),
  },
];

export const OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Flat 20% OFF',
    subtitle: 'On your first order',
    code: 'SWIFT20',
    accentColor: '#FFC107',
    image: require('@/assets/images/product1.png'),
  },
  {
    id: '2',
    title: 'Buy 1 Get 1',
    subtitle: 'On selected grocery items',
    accentColor: '#4CAF50',
    image: require('@/assets/images/product2.png'),
  },
  {
    id: '3',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹199',
    accentColor: '#2196F3',
    image: require('@/assets/images/product5.png'),
  },
];

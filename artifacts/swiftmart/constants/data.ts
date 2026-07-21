export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  shops: number;
};

import { ImageSourcePropType } from 'react-native';

export type Product = {
  id: string;
  name: string;
  weight: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: ImageSourcePropType;
  category?: string;
  description?: string;
};

export type Shop = {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  image: ImageSourcePropType;
  productCategories: string[];
  description?: string;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  accentColor: string;
  image: ImageSourcePropType;
};

export type NotificationKind = 'order' | 'offer' | 'system' | 'delivery';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;       // human-readable relative time
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
};

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    kind: 'delivery',
    title: 'Out for delivery!',
    body: 'Your order #SM2041 is out for delivery. Expected in 12 minutes.',
    time: '5 min ago',
    read: false,
    actionLabel: 'Track Order',
    actionRoute: '/orders',
  },
  {
    id: 'n2',
    kind: 'order',
    title: 'Order confirmed',
    body: 'Your order #SM2040 from Fresh Basket has been confirmed and is being packed.',
    time: '1 hr ago',
    read: false,
    actionLabel: 'View Order',
    actionRoute: '/orders',
  },
  {
    id: 'n3',
    kind: 'offer',
    title: '🎉 Flash Deal is live!',
    body: 'Grab up to 40% off on Fresh Apples, Toned Milk and more. Hurry — ends in 2 hrs!',
    time: '2 hr ago',
    read: false,
    actionLabel: 'Shop Now',
    actionRoute: '/flash-deals',
  },
  {
    id: 'n4',
    kind: 'offer',
    title: 'Exclusive offer just for you',
    body: 'Use SWIFT20 to get ₹20 off your next order above ₹199. Valid till midnight.',
    time: 'Yesterday',
    read: true,
    actionLabel: 'See Offers',
    actionRoute: '/offers',
  },
  {
    id: 'n5',
    kind: 'order',
    title: 'Order delivered ✓',
    body: 'Order #SM2039 was delivered successfully. Rate your experience.',
    time: 'Yesterday',
    read: true,
    actionLabel: 'Rate Now',
    actionRoute: '/orders',
  },
  {
    id: 'n6',
    kind: 'system',
    title: 'New shops in your area',
    body: 'Meghna Dairy and 3 more shops just joined SwiftMart near Balurghat.',
    time: '2 days ago',
    read: true,
    actionLabel: 'Browse Shops',
    actionRoute: '/shops',
  },
  {
    id: 'n7',
    kind: 'offer',
    title: 'Weekend Super Saver',
    body: '15% off on all grocery orders this weekend. No minimum order value required.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 'n8',
    kind: 'system',
    title: 'App updated',
    body: 'SwiftMart has been updated with faster delivery tracking and new shop features.',
    time: '5 days ago',
    read: true,
  },
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Grocery',      icon: 'cart-outline',    color: '#4CAF50', shops: 120 },
  { id: '2', name: 'Medicines',    icon: 'medical-bag',     color: '#F44336', shops: 85  },
  { id: '3', name: 'Food',         icon: 'food-fork-drink', color: '#FF9800', shops: 200 },
  { id: '4', name: 'Dairy',        icon: 'cup-water',       color: '#2196F3', shops: 45  },
  { id: '5', name: 'Fruits & Veg', icon: 'leaf',            color: '#8BC34A', shops: 90  },
  { id: '6', name: 'Stationery',   icon: 'pencil',          color: '#9C27B0', shops: 30  },
  { id: '7', name: 'Electronics',  icon: 'cellphone',       color: '#00BCD4', shops: 65  },
  { id: '8', name: 'Fashion',      icon: 'hanger',          color: '#E91E63', shops: 110 },
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
    category: 'Fruits & Veg',
    description: 'Hand-picked fresh apples sourced from Himachal Pradesh orchards. Crisp, naturally sweet, and rich in dietary fibre, vitamin C, and antioxidants. Great for snacking, juicing, or baking. Store in a cool, dry place for best freshness.',
  },
  {
    id: '2',
    name: 'Whole Milk',
    weight: '1 L',
    originalPrice: 65,
    discountedPrice: 52,
    discount: 20,
    image: require('@/assets/images/product2.png'),
    category: 'Dairy',
    description: 'Full-cream whole milk pasteurised and packed fresh daily. A rich source of calcium, protein, and essential vitamins. Perfect for drinking, cooking, making chai, or adding to cereals. Best consumed before the printed best-before date.',
  },
  {
    id: '3',
    name: 'Paracetamol 500mg',
    weight: '10 tabs',
    originalPrice: 35,
    discountedPrice: 28,
    discount: 20,
    image: require('@/assets/images/product3.png'),
    category: 'Medicines',
    description: 'Paracetamol 500 mg tablets for fast, effective relief from fever, headaches, body aches, and mild to moderate pain. Suitable for adults and children above 12 years. Do not exceed the recommended dose. Keep out of reach of children.',
  },
  {
    id: '4',
    name: 'Brown Bread',
    weight: '400 g',
    originalPrice: 55,
    discountedPrice: 42,
    discount: 24,
    image: require('@/assets/images/product4.png'),
    category: 'Grocery',
    description: 'Wholesome brown bread baked with whole-wheat flour, high in fibre and essential nutrients. No artificial preservatives or colours. Soft texture with a slightly nutty flavour — perfect for sandwiches, toast, or a quick healthy breakfast.',
  },
  {
    id: '5',
    name: 'Chicken Biryani',
    weight: '500 g',
    originalPrice: 220,
    discountedPrice: 176,
    discount: 20,
    image: require('@/assets/images/product5.png'),
    category: 'Food',
    description: 'Restaurant-style chicken biryani made with long-grain basmati rice, tender chicken pieces, and a slow-cooked blend of whole spices and saffron. Ready to heat and serve in minutes. Best enjoyed with raita and sliced onions.',
  },
  {
    id: '6',
    name: 'Farm Fresh Eggs',
    weight: '12 pcs',
    originalPrice: 84,
    discountedPrice: 68,
    discount: 19,
    image: require('@/assets/images/product1.png'),
    category: 'Dairy',
    description: 'Free-range eggs from hens raised on natural grain feed. Each egg is washed, graded, and packed to ensure freshness. High in protein and essential amino acids. Ideal for boiling, scrambling, baking, or your morning omelette.',
  },
  {
    id: '7',
    name: 'Toor Dal',
    weight: '1 kg',
    originalPrice: 140,
    discountedPrice: 109,
    discount: 22,
    image: require('@/assets/images/product2.png'),
    category: 'Grocery',
    description: 'Premium quality toor (arhar) dal, machine cleaned and triple-sorted to remove impurities. A staple protein source in Indian households, packed with iron and fibre. Cooks quickly and has a mild, earthy flavour. Great for dal tadka and sambar.',
  },
  {
    id: '8',
    name: 'Aashirvaad Atta',
    weight: '5 kg',
    originalPrice: 280,
    discountedPrice: 219,
    discount: 22,
    image: require('@/assets/images/product4.png'),
    category: 'Grocery',
    description: 'Aashirvaad Select whole wheat atta made from the finest MP Sharbati wheat. Stone-ground to retain the natural goodness of the wheat grain — rich in fibre, vitamins, and minerals. Makes soft, fluffy rotis that stay fresh for longer.',
  },
];

/** Products shown in the Flash Deals section with steeper discounts */
export const FLASH_DEALS: Product[] = [
  {
    id: 'f1',
    name: 'Basmati Rice',
    weight: '5 kg',
    originalPrice: 450,
    discountedPrice: 299,
    discount: 34,
    image: require('@/assets/images/product1.png'),
    category: 'Grocery',
    description: 'Premium aged basmati rice with an extra-long grain and signature fragrance. Sourced from the foothills of the Himalayas and aged for 12 months for a fluffier texture. Ideal for biryani, pulao, or everyday meals. Each grain stays separate after cooking.',
  },
  {
    id: 'f2',
    name: 'Amul Butter',
    weight: '500 g',
    originalPrice: 280,
    discountedPrice: 168,
    discount: 40,
    image: require('@/assets/images/product2.png'),
    category: 'Dairy',
    description: 'Amul pasteurised butter made from fresh cream with a rich, creamy texture and a mild, pleasant flavour. Perfect for spreading on toast, cooking, baking, and finishing dal or vegetables. A trusted Indian household staple since 1946.',
  },
  {
    id: 'f3',
    name: 'Dettol Soap',
    weight: '3 bars',
    originalPrice: 120,
    discountedPrice: 72,
    discount: 40,
    image: require('@/assets/images/product3.png'),
    category: 'Grocery',
    description: 'Dettol Original antibacterial soap clinically proven to protect against 100 illness-causing germs. Contains the trusted Dettolene antiseptic ingredient. Leaves skin feeling clean, refreshed, and hygienically protected. Suitable for the whole family.',
  },
  {
    id: 'f4',
    name: 'Tata Tea Gold',
    weight: '250 g',
    originalPrice: 195,
    discountedPrice: 127,
    discount: 35,
    image: require('@/assets/images/product4.png'),
    category: 'Grocery',
    description: 'Tata Tea Gold is a blend of fine Assam tea leaves with a rich, bold flavour and a golden colour. Crafted with 15% long leaf tea for a superior brew. Brews a strong, aromatic cup that pairs perfectly with milk. Freshness-locked packaging.',
  },
  {
    id: 'f5',
    name: 'Lays Classic',
    weight: '3 × 26 g',
    originalPrice: 60,
    discountedPrice: 39,
    discount: 35,
    image: require('@/assets/images/product5.png'),
    category: 'Food',
    description: "Lays Classic salted potato chips — light, crispy, and perfectly salted for that irresistible crunch. Made from select quality potatoes, cooked in sunflower oil. A guilt-free snack for movies, parties, or anytime munchies. India's favourite chip since 1995.",
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
    productCategories: ['Grocery', 'Fruits & Veg'],
    description: 'Your neighbourhood grocery store stocked with fresh produce, pantry staples, and everyday essentials. We source directly from local farms and wholesale markets to bring you the best quality at the lowest prices. Open daily, 6 AM – 11 PM.',
  },
  {
    id: '2',
    name: 'HealthPlus',
    category: 'Pharmacy',
    rating: 4.6,
    deliveryTime: '12 min',
    image: require('@/assets/images/shop2.png'),
    productCategories: ['Medicines'],
    description: 'A fully licensed pharmacy staffed by qualified pharmacists. We carry prescription medicines, OTC drugs, health supplements, and personal care products. All items are sourced from certified distributors and stored at regulated temperatures.',
  },
  {
    id: '3',
    name: 'QuickFood',
    category: 'Restaurant',
    rating: 4.5,
    deliveryTime: '15 min',
    image: require('@/assets/images/shop3.png'),
    productCategories: ['Food'],
    description: 'Hot, freshly prepared meals delivered straight to your door. Our kitchen runs 7 days a week with an ever-changing menu of Indian favourites — biryanis, curries, rolls, and snacks. Every dish is prepared to order with no preservatives.',
  },
  {
    id: '4',
    name: 'DairyBest',
    category: 'Dairy',
    rating: 4.7,
    deliveryTime: '10 min',
    image: require('@/assets/images/shop1.png'),
    productCategories: ['Dairy'],
    description: 'Specialists in fresh dairy and farm produce. From pasteurised milk and artisan butter to free-range eggs, everything at DairyBest is collected daily and delivered chilled to preserve peak freshness. Trusted by 10,000+ families.',
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

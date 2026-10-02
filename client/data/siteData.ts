export type ProductSize = {
  size: string;
  quantity: string;
  price: number;
};

export type Product = {
  name: string;
  slug: string;
  category: string;
  short: string;
  description: string;
  uses: string;
  benefits: string;
  packaging: string;
  image: string;
  price: number;
  maxQty: number;
  sizes?: ProductSize[];
};

// Contact emails
export const SUPPORT_EMAIL = "support@earthrootagro.shop";
export const DISPUTE_EMAIL = "dispute@earthrootagro.shop";

// Bulk orders beyond a product's maxQty must go through this contact instead of self-checkout.
export const BULK_ORDER_CONTACT_EMAIL = SUPPORT_EMAIL;

// Orders below this subtotal cannot be checked out.
export const MIN_ORDER_AMOUNT = 100;

// Deterministic per-product "random" limit (5-10 inclusive) so the cap stays stable across reloads
// but is mixed/varied across products rather than one fixed number for everything.
const maxQtyForSlug = (slug: string) => {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  return 5 + (hash % 6); // 5-10 inclusive
};

export const fallbackProductImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85";

const categoryImages: Record<string, string> = {
  "Millet Products": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=85",
  "Natural Oils": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85",
};

const productNames: Array<[string, string]> = [
  ["Millet flour", "Millet Products"], ["Millet noodles", "Millet Products"], ["Millet pasta", "Millet Products"], ["Millet dosa mix", "Millet Products"], ["Millet pongal mix", "Millet Products"], ["Roasted millet", "Millet Products"], ["Flavoured millet", "Millet Products"], ["Instant millet", "Millet Products"], ["Millet snacks", "Millet Products"],
  ["Cold-pressed groundnut oil", "Natural Oils"], ["Cold-pressed sesame oil", "Natural Oils"], ["Mustard oil", "Natural Oils"], ["Coconut oil", "Natural Oils"], ["Sunflower oil", "Natural Oils"], ["Rice-bran oil", "Natural Oils"], ["Soybean oil", "Natural Oils"],
];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const productImages: Record<string, string> = {
  // Millet Products
  "millet-flour": "/millet flour.jpeg",
  "millet-noodles": "/millet noodles.jpeg",
  "millet-pasta": "/millet pasta.png",
  "millet-dosa-mix": "/millet dosa mix.png",
  "millet-pongal-mix": "/millet pongal mix.png",
  "roasted-millet": "/roasted millet.jpeg",
  "flavoured-millet": "/flavoured millet .jpg",
  "instant-millet": "/instant millet.jpeg",
  "millet-snacks": "/millet snacks.jpeg",

  // Natural Oils
  "cold-pressed-groundnut-oil": "/groundnutoil.jpeg",
  "cold-pressed-sesame-oil": "/sesameoil.jpeg",
  "mustard-oil": "/mjustard oil.jpeg",
  "coconut-oil": "/coconut oil.jpeg",
  "sunflower-oil": "/sunflower oil.jpeg",
  "rice-bran-oil": "/rice bran oil.jpeg",
  "soybean-oil": "/soybeen oil.jpeg",
};

// Indian market retail/wholesale rates - varied pricing (₹ per unit)
const productPrices: Record<string, number> = {
  // Millet Products (per kg)
  "millet-flour": 350,        // ₹350 (Premium)
  "millet-noodles": 200,      // ₹200 (Budget)
  "millet-pasta": 240,        // ₹240 (Mid-range)
  "millet-dosa-mix": 300,     // ₹300 (Mid-range)
  "millet-pongal-mix": 280,   // ₹280 (Mid-range)
  "roasted-millet": 150,      // ₹150 (Budget)
  "flavoured-millet": 320,    // ₹320 (Mid-range)
  "instant-millet": 200,      // ₹200 (Budget)
  "millet-snacks": 400,       // ₹400 (Premium)

  // Natural Oils (per liter)
  "cold-pressed-groundnut-oil": 300,  // ₹300 (Mid-range)
  "cold-pressed-sesame-oil": 400,     // ₹400 (Premium)
  "mustard-oil": 140,                 // ₹140 (Budget)
  "coconut-oil": 250,                 // ₹250 (Mid-range)
  "sunflower-oil": 120,               // ₹120 (Budget)
  "rice-bran-oil": 320,               // ₹320 (Mid-range)
  "soybean-oil": 100,                 // ₹100 (Budget)
};

const productSizes: Record<string, ProductSize[]> = {
  // Millet Products - 500g (half), 1kg (base), 5kg (5x) pricing
  "millet-flour": [
    { size: "Small", quantity: "500g", price: 175 },
    { size: "Medium", quantity: "1kg", price: 350 },
    { size: "Large", quantity: "5kg", price: 1750 },
  ],
  "millet-noodles": [
    { size: "Small", quantity: "500g", price: 100 },
    { size: "Medium", quantity: "1kg", price: 200 },
    { size: "Large", quantity: "5kg", price: 1000 },
  ],
  "millet-pasta": [
    { size: "Small", quantity: "500g", price: 120 },
    { size: "Medium", quantity: "1kg", price: 240 },
    { size: "Large", quantity: "5kg", price: 1200 },
  ],
  "millet-dosa-mix": [
    { size: "Small", quantity: "500g", price: 150 },
    { size: "Medium", quantity: "1kg", price: 300 },
    { size: "Large", quantity: "5kg", price: 1500 },
  ],
  "millet-pongal-mix": [
    { size: "Small", quantity: "500g", price: 140 },
    { size: "Medium", quantity: "1kg", price: 280 },
    { size: "Large", quantity: "5kg", price: 1400 },
  ],
  "roasted-millet": [
    { size: "Small", quantity: "500g", price: 75 },
    { size: "Medium", quantity: "1kg", price: 150 },
    { size: "Large", quantity: "5kg", price: 750 },
  ],
  "flavoured-millet": [
    { size: "Small", quantity: "500g", price: 160 },
    { size: "Medium", quantity: "1kg", price: 320 },
    { size: "Large", quantity: "5kg", price: 1600 },
  ],
  "instant-millet": [
    { size: "Small", quantity: "500g", price: 100 },
    { size: "Medium", quantity: "1kg", price: 200 },
    { size: "Large", quantity: "5kg", price: 1000 },
  ],
  "millet-snacks": [
    { size: "Small", quantity: "200g", price: 80 },
    { size: "Medium", quantity: "500g", price: 200 },
    { size: "Large", quantity: "1kg", price: 400 },
  ],

  // Natural Oils - 500ml (half), 1L (base), 5L (5x) pricing
  "cold-pressed-groundnut-oil": [
    { size: "Small", quantity: "500ml", price: 150 },
    { size: "Medium", quantity: "1L", price: 300 },
    { size: "Large", quantity: "5L", price: 1500 },
  ],
  "cold-pressed-sesame-oil": [
    { size: "Small", quantity: "500ml", price: 200 },
    { size: "Medium", quantity: "1L", price: 400 },
    { size: "Large", quantity: "5L", price: 2000 },
  ],
  "mustard-oil": [
    { size: "Small", quantity: "500ml", price: 70 },
    { size: "Medium", quantity: "1L", price: 140 },
    { size: "Large", quantity: "5L", price: 700 },
  ],
  "coconut-oil": [
    { size: "Small", quantity: "500ml", price: 125 },
    { size: "Medium", quantity: "1L", price: 250 },
    { size: "Large", quantity: "5L", price: 1250 },
  ],
  "sunflower-oil": [
    { size: "Small", quantity: "500ml", price: 60 },
    { size: "Medium", quantity: "1L", price: 120 },
    { size: "Large", quantity: "5L", price: 600 },
  ],
  "rice-bran-oil": [
    { size: "Small", quantity: "500ml", price: 160 },
    { size: "Medium", quantity: "1L", price: 320 },
    { size: "Large", quantity: "5L", price: 1600 },
  ],
  "soybean-oil": [
    { size: "Small", quantity: "500ml", price: 50 },
    { size: "Medium", quantity: "1L", price: 100 },
    { size: "Large", quantity: "5L", price: 500 },
  ],
};

export const products: Product[] = productNames.map(([name, category]) => {
  const slug = slugify(name);
  return {
    name,
    slug,
    category,
    short: `${name} sourced for dependable commercial supply.`,
    description: `Earth Root Agro supplies carefully selected ${name.toLowerCase()} for food businesses, distributors, manufacturers and export buyers. We coordinate procurement, quality checks and dispatch around your specification and volume.`,
    uses: `Suitable for food processing, wholesale distribution, institutional kitchens and value-added products that require consistent ${name.toLowerCase()}.`,
    benefits: "Reliable origin, practical quality checks, flexible commercial quantities and responsive order coordination.",
    packaging: "Bulk bags, food-grade sacks and buyer-specified packing formats are available on request.",
    image: productImages[slug] || categoryImages[category] || fallbackProductImage,
    price: productPrices[slug] ?? 500,
    maxQty: maxQtyForSlug(slug),
    sizes: productSizes[slug],
  };
});

export type Combo = {
  id: string;
  name: string;
  price: number;
  products: string[]; // product slugs
  description: string;
  image: string;
  savings: number;
};

export const combos: Combo[] = [
  {
    id: "combo-400",
    name: "Quick Millet Mix",
    price: 400,
    products: ["millet-noodles", "roasted-millet", "mustard-oil"],
    description: "Lunch & snack essentials - Total ₹490, Save ₹90",
    image: "/millet noodles.jpeg",
    savings: 90,
  },
  {
    id: "combo-500",
    name: "Breakfast Variety",
    price: 500,
    products: ["millet-flour", "mustard-oil", "soybean-oil"],
    description: "Daily staple + cooking oils - Total ₹590, Save ₹90",
    image: "/millet flour.jpeg",
    savings: 90,
  },
  {
    id: "combo-800",
    name: "Millet Premium",
    price: 800,
    products: ["millet-flour", "roasted-millet", "flavoured-millet"],
    description: "3-millet powerhouse - Total ₹820, Save ₹20",
    image: "/millet flour.jpeg",
    savings: 20,
  },
  {
    id: "combo-1000",
    name: "Family Bundle",
    price: 1000,
    products: ["millet-flour", "millet-dosa-mix", "millet-pasta", "cold-pressed-groundnut-oil"],
    description: "Complete kitchen essentials - Total ₹1190, Save ₹190",
    image: "/millet dosa mix.png",
    savings: 190,
  },
  {
    id: "combo-1200",
    name: "Kitchen Master",
    price: 1200,
    products: ["millet-flour", "millet-dosa-mix", "roasted-millet", "flavoured-millet", "cold-pressed-groundnut-oil"],
    description: "5-product nutrition combo - Total ₹1420, Save ₹220",
    image: "/millet dosa mix.png",
    savings: 220,
  },
  {
    id: "combo-1500",
    name: "Premium Selection",
    price: 1500,
    products: ["millet-flour", "millet-dosa-mix", "millet-pasta", "millet-noodles", "roasted-millet", "cold-pressed-sesame-oil"],
    description: "6-product family feast - Total ₹1640, Save ₹140",
    image: "/millet pasta.png",
    savings: 140,
  },
  {
    id: "combo-2000",
    name: "Ultimate Kitchen",
    price: 2000,
    products: ["millet-flour", "millet-dosa-mix", "millet-pasta", "millet-noodles", "roasted-millet", "flavoured-millet", "cold-pressed-sesame-oil", "cold-pressed-groundnut-oil"],
    description: "8-product ultimate combo - Total ₹2260, Save ₹260",
    image: "/millet flour.jpeg",
    savings: 260,
  },
];

export const legalPages = [
  ["Privacy Policy", "privacy-policy"],
  ["Terms & Conditions", "terms-conditions"],
  ["Refund Policy", "refund-policy"],
  ["Shipping Policy", "shipping-policy"],
  ["Cancellation Policy", "cancellation-policy"],
  ["Cookie Policy", "cookie-policy"],
] as const;

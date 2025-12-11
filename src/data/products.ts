// Centralized product data with images
import canvaLogo from "@/assets/canva-logo.webp";
import figmaLogo from "@/assets/figma-logo.png";
import chatgptLogo from "@/assets/chatgpt-logo.png";
import midjourneyLogo from "@/assets/midjourney-logo.webp";
import adobeLogo from "@/assets/adobe-cc-logo.png";
import capcutLogo from "@/assets/capcut-logo.jpeg";
import grammarlyLogo from "@/assets/grammarly-logo.png";
import notionLogo from "@/assets/notion-logo.png";
import hbomaxLogo from "@/assets/hbomax-logo.png";

export interface Product {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  downloads: string;
  prices: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
  originalPrices: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
  discount: number;
  popular: boolean;
}
export const products: Product[] = [
  { 
    id: "netflix-premium", 
    name: "Netflix Premium", 
    logo: "N", 
    logoColor: "from-red-600 to-red-500", 
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop",
    category: "Streaming",
    description: "Streaming film & series unlimited HD tanpa iklan",
    rating: 4.9, 
    downloads: "50K+", 
    prices: { weekly: 25000, monthly: 85000, yearly: 850000 },
    originalPrices: { weekly: 45000, monthly: 150000, yearly: 1500000 },
    discount: 45,
    popular: true 
  },
  { 
    id: "canva-pro", 
    name: "Canva Pro", 
    logo: "C", 
    logoColor: "from-cyan-500 to-blue-500", 
    image: canvaLogo,
    category: "Design",
    description: "Desain grafis profesional dengan ribuan template",
    rating: 4.8, 
    downloads: "45K+", 
    prices: { weekly: 20000, monthly: 75000, yearly: 750000 },
    originalPrices: { weekly: 35000, monthly: 130000, yearly: 1300000 },
    discount: 42,
    popular: true 
  },
  { 
    id: "chatgpt-plus", 
    name: "ChatGPT Plus", 
    logo: "G", 
    logoColor: "from-emerald-500 to-teal-500", 
    image: chatgptLogo,
    category: "AI Tools",
    description: "AI assistant cerdas untuk produktivitas maksimal",
    rating: 4.9, 
    downloads: "40K+", 
    prices: { weekly: 50000, monthly: 180000, yearly: 1800000 },
    originalPrices: { weekly: 85000, monthly: 320000, yearly: 3200000 },
    discount: 44,
    popular: true 
  },
  { 
    id: "spotify-premium", 
    name: "Spotify Premium", 
    logo: "S", 
    logoColor: "from-green-500 to-green-400", 
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop",
    category: "Musik",
    description: "Musik tanpa batas, offline mode, tanpa iklan",
    rating: 4.8, 
    downloads: "60K+", 
    prices: { weekly: 15000, monthly: 55000, yearly: 550000 },
    originalPrices: { weekly: 25000, monthly: 95000, yearly: 950000 },
    discount: 42,
    popular: true 
  },
  { 
    id: "capcut-pro", 
    name: "CapCut Pro", 
    logo: "CC", 
    logoColor: "from-slate-700 to-slate-600", 
    image: capcutLogo,
    category: "Editing",
    description: "Edit video profesional dengan efek premium",
    rating: 4.7, 
    downloads: "35K+", 
    prices: { weekly: 18000, monthly: 65000, yearly: 650000 },
    originalPrices: { weekly: 30000, monthly: 110000, yearly: 1100000 },
    discount: 40,
    popular: false 
  },
  { 
    id: "adobe-creative", 
    name: "Adobe CC", 
    logo: "Ai", 
    logoColor: "from-red-500 to-rose-500", 
    image: adobeLogo,
    category: "Design",
    description: "Suite lengkap untuk kreator profesional",
    rating: 4.9, 
    downloads: "30K+", 
    prices: { weekly: 75000, monthly: 280000, yearly: 2800000 },
    originalPrices: { weekly: 150000, monthly: 550000, yearly: 5500000 },
    discount: 50,
    popular: true 
  },
  { 
    id: "notion-pro", 
    name: "Notion Pro", 
    logo: "N", 
    logoColor: "from-slate-800 to-slate-700", 
    image: notionLogo,
    category: "Productivity",
    description: "Workspace all-in-one untuk tim produktif",
    rating: 4.8, 
    downloads: "25K+", 
    prices: { weekly: 15000, monthly: 55000, yearly: 550000 },
    originalPrices: { weekly: 25000, monthly: 95000, yearly: 950000 },
    discount: 42,
    popular: false 
  },
  { 
    id: "disney-plus", 
    name: "Disney+", 
    logo: "D+", 
    logoColor: "from-blue-600 to-indigo-600", 
    image: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&h=300&fit=crop",
    category: "Streaming",
    description: "Film Disney, Marvel, Star Wars dalam satu tempat",
    rating: 4.7, 
    downloads: "38K+", 
    prices: { weekly: 22000, monthly: 80000, yearly: 800000 },
    originalPrices: { weekly: 40000, monthly: 140000, yearly: 1400000 },
    discount: 43,
    popular: false 
  },
  { 
    id: "midjourney", 
    name: "Midjourney", 
    logo: "M", 
    logoColor: "from-indigo-500 to-purple-500", 
    image: midjourneyLogo,
    category: "AI Tools",
    description: "Generate gambar AI berkualitas tinggi",
    rating: 4.9, 
    downloads: "32K+", 
    prices: { weekly: 45000, monthly: 160000, yearly: 1600000 },
    originalPrices: { weekly: 80000, monthly: 290000, ylabel: 2900000 },
    discount: 45,
    popular: true 
  },
  { 
    id: "grammarly", 
    name: "Grammarly", 
    logo: "G", 
    logoColor: "from-green-600 to-emerald-500", 
    image: grammarlyLogo,
    category: "Productivity",
    description: "Koreksi tata bahasa & penulisan otomatis",
    rating: 4.7, 
    downloads: "28K+", 
    prices: { weekly: 18000, monthly: 65000, yearly: 650000 },
    originalPrices: { weekly: 32000, monthly: 115000, yearly: 1150000 },
    discount: 43,
    popular: false 
  },
  { 
    id: "figma-pro", 
    name: "Figma Pro", 
    logo: "F", 
    logoColor: "from-orange-500 to-pink-500", 
    image: figmaLogo,
    category: "Design",
    description: "Kolaborasi desain UI/UX real-time",
    rating: 4.9, 
    downloads: "42K+", 
    prices: { weekly: 22000, monthly: 80000, yearly: 800000 },
    originalPrices: { weekly: 40000, monthly: 140000, yearly: 1400000 },
    discount: 43,
    popular: true 
  },
  { 
    id: "hbo-max", 
    name: "HBO Max", 
    logo: "H", 
    logoColor: "from-purple-600 to-violet-600", 
    image: hbomaxLogo,
    category: "Streaming",
    description: "Series premium & film blockbuster terbaru",
    rating: 4.6, 
    downloads: "22K+", 
    prices: { weekly: 25000, monthly: 90000, yearly: 900000 },
    originalPrices: { weekly: 45000, monthly: 160000, yearly: 1600000 },
    discount: 44,
    popular: false 
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

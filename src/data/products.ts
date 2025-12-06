// Centralized product data with images
export interface Product {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  image: string;
  category: string;
  rating: number;
  downloads: string;
  prices: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
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
    rating: 4.9, 
    downloads: "50K+", 
    prices: { weekly: 25000, monthly: 85000, yearly: 850000 }, 
    popular: true 
  },
  { 
    id: "canva-pro", 
    name: "Canva Pro", 
    logo: "C", 
    logoColor: "from-cyan-500 to-blue-500", 
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    category: "Design", 
    rating: 4.8, 
    downloads: "45K+", 
    prices: { weekly: 20000, monthly: 75000, yearly: 750000 }, 
    popular: true 
  },
  { 
    id: "chatgpt-plus", 
    name: "ChatGPT Plus", 
    logo: "G", 
    logoColor: "from-emerald-500 to-teal-500", 
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    category: "AI Tools", 
    rating: 4.9, 
    downloads: "40K+", 
    prices: { weekly: 50000, monthly: 180000, yearly: 1800000 }, 
    popular: true 
  },
  { 
    id: "spotify-premium", 
    name: "Spotify Premium", 
    logo: "S", 
    logoColor: "from-green-500 to-green-400", 
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop",
    category: "Musik", 
    rating: 4.8, 
    downloads: "60K+", 
    prices: { weekly: 15000, monthly: 55000, yearly: 550000 }, 
    popular: true 
  },
  { 
    id: "capcut-pro", 
    name: "CapCut Pro", 
    logo: "CC", 
    logoColor: "from-slate-700 to-slate-600", 
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop",
    category: "Editing", 
    rating: 4.7, 
    downloads: "35K+", 
    prices: { weekly: 18000, monthly: 65000, yearly: 650000 }, 
    popular: false 
  },
  { 
    id: "adobe-creative", 
    name: "Adobe CC", 
    logo: "Ai", 
    logoColor: "from-red-500 to-rose-500", 
    image: "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=400&h=300&fit=crop",
    category: "Design", 
    rating: 4.9, 
    downloads: "30K+", 
    prices: { weekly: 75000, monthly: 280000, yearly: 2800000 }, 
    popular: true 
  },
  { 
    id: "notion-pro", 
    name: "Notion Pro", 
    logo: "N", 
    logoColor: "from-slate-800 to-slate-700", 
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop",
    category: "Productivity", 
    rating: 4.8, 
    downloads: "25K+", 
    prices: { weekly: 15000, monthly: 55000, yearly: 550000 }, 
    popular: false 
  },
  { 
    id: "disney-plus", 
    name: "Disney+", 
    logo: "D+", 
    logoColor: "from-blue-600 to-indigo-600", 
    image: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&h=300&fit=crop",
    category: "Streaming", 
    rating: 4.7, 
    downloads: "38K+", 
    prices: { weekly: 22000, monthly: 80000, yearly: 800000 }, 
    popular: false 
  },
  { 
    id: "midjourney", 
    name: "Midjourney", 
    logo: "M", 
    logoColor: "from-indigo-500 to-purple-500", 
    image: "https://images.unsplash.com/photo-1686191128892-3b37add4138b?w=400&h=300&fit=crop",
    category: "AI Tools", 
    rating: 4.9, 
    downloads: "32K+", 
    prices: { weekly: 45000, monthly: 160000, yearly: 1600000 }, 
    popular: true 
  },
  { 
    id: "grammarly", 
    name: "Grammarly", 
    logo: "G", 
    logoColor: "from-green-600 to-emerald-500", 
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    category: "Productivity", 
    rating: 4.7, 
    downloads: "28K+", 
    prices: { weekly: 18000, monthly: 65000, yearly: 650000 }, 
    popular: false 
  },
  { 
    id: "figma-pro", 
    name: "Figma Pro", 
    logo: "F", 
    logoColor: "from-orange-500 to-pink-500", 
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop",
    category: "Design", 
    rating: 4.9, 
    downloads: "42K+", 
    prices: { weekly: 22000, monthly: 80000, yearly: 800000 }, 
    popular: true 
  },
  { 
    id: "hbo-max", 
    name: "HBO Max", 
    logo: "H", 
    logoColor: "from-purple-600 to-violet-600", 
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
    category: "Streaming", 
    rating: 4.6, 
    downloads: "22K+", 
    prices: { weekly: 25000, monthly: 90000, yearly: 900000 }, 
    popular: false 
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

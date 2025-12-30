import { Link } from "react-router-dom";
import { Video, Tv, Briefcase, Sparkles, Music, Cloud, Palette, Code, ArrowRight, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { icon: Video, name: "Video Editing", description: "CapCut, VN, Adobe Premiere, DaVinci", count: 45, color: "from-rose-500 to-pink-500", trending: true, href: "/produk?kategori=editing" },
  { icon: Tv, name: "Streaming", description: "Netflix, Disney+, HBO Max, Viu", count: 32, color: "from-red-500 to-orange-500", trending: true, href: "/produk?kategori=streaming" },
  { icon: Music, name: "Musik", description: "Spotify, Apple Music, YouTube Music", count: 28, color: "from-green-500 to-emerald-500", trending: false, href: "/produk?kategori=musik" },
  { icon: Briefcase, name: "Productivity", description: "Canva, Notion, Grammarly, Evernote", count: 56, color: "from-blue-500 to-cyan-500", trending: true, href: "/produk?kategori=productivity" },
  { icon: Sparkles, name: "AI Tools", description: "ChatGPT, Midjourney, Claude, Jasper", count: 24, color: "from-purple-500 to-violet-500", trending: true, href: "/produk?kategori=ai tools" },
  { icon: Cloud, name: "Cloud Storage", description: "Google One, Dropbox, iCloud, OneDrive", count: 18, color: "from-sky-500 to-blue-500", trending: false, href: "/produk?kategori=cloud" },
  { icon: Palette, name: "Design", description: "Figma, Adobe CC, Sketch, Procreate", count: 38, color: "from-amber-500 to-yellow-500", trending: true, href: "/produk?kategori=design" },
  { icon: Code, name: "Development", description: "GitHub, JetBrains, Vercel, Railway", count: 42, color: "from-slate-600 to-zinc-600", trending: false, href: "/produk?kategori=development" },
];

export default function Categories() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Jelajahi <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Kategori</span>
            </h1>
            <p className="text-muted-foreground">Temukan aplikasi premium sesuai kebutuhan Anda</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.href}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <Card variant="glass" className="group p-5 h-full hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                  {category.trending && (
                    <Badge variant="premium" className="absolute top-3 right-3 text-xs flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Hot
                    </Badge>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">{category.count} Aplikasi</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

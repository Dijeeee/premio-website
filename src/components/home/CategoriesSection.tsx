import { Link } from "react-router-dom";
import { Video, Tv, Briefcase, Sparkles, Music, Cloud, Palette, Code } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  {
    icon: Video,
    name: "Video Editing",
    description: "CapCut, VN, Adobe Premiere",
    count: 45,
    color: "from-rose-500 to-pink-500",
    href: "/kategori/editing",
  },
  {
    icon: Tv,
    name: "Streaming",
    description: "Netflix, Disney+, HBO Max",
    count: 32,
    color: "from-red-500 to-orange-500",
    href: "/kategori/streaming",
  },
  {
    icon: Music,
    name: "Musik",
    description: "Spotify, Apple Music, YouTube",
    count: 28,
    color: "from-green-500 to-emerald-500",
    href: "/kategori/musik",
  },
  {
    icon: Briefcase,
    name: "Productivity",
    description: "Canva, Notion, Grammarly",
    count: 56,
    color: "from-blue-500 to-cyan-500",
    href: "/kategori/productivity",
  },
  {
    icon: Sparkles,
    name: "AI Tools",
    description: "ChatGPT, Midjourney, Claude",
    count: 24,
    color: "from-purple-500 to-violet-500",
    href: "/kategori/ai-tools",
  },
  {
    icon: Cloud,
    name: "Cloud Storage",
    description: "Google One, Dropbox, iCloud",
    count: 18,
    color: "from-sky-500 to-blue-500",
    href: "/kategori/cloud",
  },
  {
    icon: Palette,
    name: "Design",
    description: "Figma, Adobe CC, Sketch",
    count: 38,
    color: "from-amber-500 to-yellow-500",
    href: "/kategori/design",
  },
  {
    icon: Code,
    name: "Development",
    description: "GitHub, JetBrains, Vercel",
    count: 42,
    color: "from-slate-500 to-zinc-500",
    href: "/kategori/development",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
            Kategori <span className="premio-gradient-text">Populer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-100">
            Temukan aplikasi premium favorit Anda dari berbagai kategori terpopuler
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card
                variant="glass"
                className="group p-6 h-full hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                <span className="text-xs font-medium text-primary">
                  {category.count} Aplikasi
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

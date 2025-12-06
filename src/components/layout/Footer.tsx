import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Home, Grid3X3, Package, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/kategori", label: "Kategori", icon: Grid3X3 },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/review", label: "Review", icon: MessageSquare },
];

const footerLinks = {
  produk: [
    { label: "Aplikasi Editing", href: "/kategori?cat=editing" },
    { label: "Streaming", href: "/kategori?cat=streaming" },
    { label: "Productivity", href: "/kategori?cat=productivity" },
    { label: "AI Tools", href: "/kategori?cat=ai" },
  ],
  perusahaan: [
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Karir", href: "/karir" },
    { label: "Blog", href: "/blog" },
    { label: "Partner", href: "/partner" },
  ],
  dukungan: [
    { label: "Pusat Bantuan", href: "/bantuan" },
    { label: "FAQ", href: "/faq" },
    { label: "Kontak", href: "/kontak" },
    { label: "Live Chat", href: "/chat" },
  ],
  legal: [
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Kebijakan Privasi", href: "/privasi" },
    { label: "Kebijakan Refund", href: "/refund" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const location = useLocation();

  return (
    <footer className="bg-card border-t border-border">
      {/* Quick Navigation Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Premio</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">
              Marketplace aplikasi premium terpercaya dengan harga terbaik dan garansi resmi.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@premio.id</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Produk */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Produk</h4>
            <ul className="space-y-2">
              {footerLinks.produk.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Perusahaan</h4>
            <ul className="space-y-2">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dukungan */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Dukungan</h4>
            <ul className="space-y-2">
              {footerLinks.dukungan.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Premio. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

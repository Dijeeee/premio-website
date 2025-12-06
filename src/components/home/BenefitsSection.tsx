import { Zap, Shield, Award, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Zap,
    title: "Aktivasi Instan",
    description: "Proses aktivasi otomatis dalam hitungan detik setelah pembayaran berhasil",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Aman",
    description: "Transaksi terenkripsi dan data Anda terlindungi dengan sistem keamanan terbaik",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Award,
    title: "Lisensi Resmi",
    description: "Semua produk adalah lisensi asli dengan garansi penuh dari kami",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Tim support profesional siap membantu Anda kapan saja tanpa batas",
    color: "from-purple-500 to-violet-500",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
            Mengapa Memilih <span className="premio-gradient-text">Premio?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-100">
            Kami berkomitmen memberikan pengalaman terbaik untuk Anda
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              variant="glass"
              className="group p-8 text-center animate-slide-up hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300`}
              >
                <benefit.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sarah Wijaya",
    role: "Content Creator",
    avatar: "SW",
    avatarColor: "from-pink-500 to-rose-500",
    rating: 5,
    content: "Premio benar-benar mengubah cara saya bekerja. Akses ke aplikasi premium dengan harga terjangkau sangat membantu bisnis saya berkembang. Proses aktivasinya super cepat!",
  },
  {
    id: 2,
    name: "Andi Pratama",
    role: "Graphic Designer",
    avatar: "AP",
    avatarColor: "from-blue-500 to-cyan-500",
    rating: 5,
    content: "Sudah 2 tahun berlangganan Adobe CC melalui Premio. Harganya jauh lebih hemat dibanding langganan langsung. Customer service-nya juga sangat responsif.",
  },
  {
    id: 3,
    name: "Dina Kusuma",
    role: "Digital Marketer",
    avatar: "DK",
    avatarColor: "from-purple-500 to-violet-500",
    rating: 5,
    content: "Canva Pro dan ChatGPT Plus dengan harga terbaik! Tidak perlu ribet dengan pembayaran internasional. Semua bisa dibeli dengan mudah di Premio.",
  },
  {
    id: 4,
    name: "Reza Mahendra",
    role: "Software Developer",
    avatar: "RM",
    avatarColor: "from-emerald-500 to-teal-500",
    rating: 5,
    content: "JetBrains dan GitHub Pro dengan harga kompetitif. Yang paling saya suka adalah garansi seumur hidup untuk setiap pembelian. Highly recommended!",
  },
  {
    id: 5,
    name: "Maya Santoso",
    role: "Freelance Writer",
    avatar: "MS",
    avatarColor: "from-amber-500 to-orange-500",
    rating: 5,
    content: "Grammarly Premium membantu tulisan saya jadi lebih profesional. Terima kasih Premio untuk harga yang sangat bersahabat dan proses yang mudah!",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
            Apa Kata <span className="premio-gradient-text">Pelanggan Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-100">
            Ribuan pelanggan telah mempercayakan kebutuhan aplikasi premium mereka kepada kami
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex rounded-full shadow-lg"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex rounded-full shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Testimonials */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  variant="glass"
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] p-8 animate-fade-in"
                >
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center`}
                    >
                      <span className="text-white font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

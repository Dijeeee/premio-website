import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sarah Wijaya",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "Premio mengubah cara saya bekerja. Akses aplikasi premium dengan harga terjangkau sangat membantu!",
  },
  {
    id: 2,
    name: "Andi Pratama",
    role: "Graphic Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "2 tahun langganan Adobe CC via Premio. Hemat dan customer service responsif!",
  },
  {
    id: 3,
    name: "Dina Kusuma",
    role: "Digital Marketer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "Canva Pro dan ChatGPT Plus harga terbaik! Tidak ribet dengan pembayaran internasional.",
  },
  {
    id: 4,
    name: "Reza Mahendra",
    role: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "JetBrains dan GitHub Pro dengan garansi seumur hidup. Highly recommended!",
  },
  {
    id: 5,
    name: "Maya Santoso",
    role: "Freelance Writer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "Grammarly Premium membuat tulisan lebih profesional. Terima kasih Premio!",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            Apa Kata <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pelanggan Kami</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">Ribuan pelanggan mempercayakan kebutuhan aplikasi premium mereka</p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0 hidden sm:flex"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 rounded-2xl p-4 md:p-6 relative overflow-hidden">
                      <Quote className="absolute top-3 right-3 h-8 w-8 text-primary/10" />
                      
                      <div className="flex items-start gap-3 md:gap-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm md:text-base text-muted-foreground mb-3 leading-relaxed">
                            "{testimonial.content}"
                          </p>
                          <div>
                            <div className="font-semibold text-sm">{testimonial.name}</div>
                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0 hidden sm:flex"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

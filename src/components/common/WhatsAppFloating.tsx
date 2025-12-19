import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "6285878360051";

export function WhatsAppFloating() {
  const handleClick = () => {
    const message = encodeURIComponent("Halo, saya ingin bertanya tentang Premio.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-bounce-slow"
      aria-label="Chat di WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
      <span className="absolute right-16 bg-background border border-border text-foreground px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
        Chat WhatsApp
      </span>
    </button>
  );
}

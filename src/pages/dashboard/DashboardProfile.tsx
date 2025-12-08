import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Camera, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function DashboardProfile() {
  const { user } = useAuth();
  const userName = user?.email?.split("@")[0] || "User";
  
  const [formData, setFormData] = useState({
    fullName: userName,
    email: user?.email || "",
    phone: "+62 812-3456-7890",
    address: "Purwokerto, Banyumas, Jawa Tengah",
    bio: "Pengguna setia Premio sejak 2024",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    toast.success("Profil berhasil diperbarui");
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi pribadi Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture Card */}
        <Card variant="glass" className="p-6 text-center md:col-span-1">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-3xl">
                {userName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h3 className="font-semibold text-lg">{formData.fullName}</h3>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Bergabung Desember 2024
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card variant="glass" className="p-6 md:col-span-2">
          <h3 className="font-semibold mb-4">Informasi Pribadi</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Nama lengkap Anda"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Email Anda"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Nomor telepon"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Alamat</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 min-h-[80px]"
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bio</label>
              <Textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="min-h-[80px]"
                placeholder="Ceritakan tentang diri Anda"
              />
            </div>

            <Button variant="premium" className="w-full" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

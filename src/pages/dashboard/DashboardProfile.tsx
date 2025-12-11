import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function DashboardProfile() {
  const { user } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        full_name: user.email?.split("@")[0] || ""
      }));
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  const getJoinDate = () => {
    if (profile?.created_at) {
      return formatDistanceToNow(new Date(profile.created_at), {
        addSuffix: true,
        locale: id
      });
    }
    return "Baru bergabung";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto overflow-hidden cursor-pointer group"
              onClick={handleAvatarClick}
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
              ) : profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <span className="text-primary-foreground font-bold text-3xl">
                  {getInitials()}
                </span>
              )}
            </div>
            <button 
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h3 className="font-semibold text-lg">{formData.full_name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Bergabung {getJoinDate()}
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
                  name="full_name"
                  value={formData.full_name}
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

            <Button 
              variant="premium" 
              className="w-full" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Simpan Perubahan
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

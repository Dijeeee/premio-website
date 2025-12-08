import { useState } from "react";
import { Settings, Bell, Moon, Sun, Globe, Shield, Smartphone, Mail, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

export function DashboardSettings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    autoRenew: true,
    language: "id",
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan");
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Sesuaikan preferensi aplikasi Premio</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Tampilan</h3>
              <p className="text-sm text-muted-foreground">Sesuaikan tampilan aplikasi</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <div className="font-medium text-sm">Mode Gelap</div>
                  <div className="text-xs text-muted-foreground">Aktifkan tema gelap</div>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">Bahasa</div>
                  <div className="text-xs text-muted-foreground">Bahasa Indonesia</div>
                </div>
              </div>
              <Button variant="outline" size="sm">ID</Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Notifikasi</h3>
              <p className="text-sm text-muted-foreground">Atur preferensi notifikasi</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">Notifikasi Email</div>
                  <div className="text-xs text-muted-foreground">Terima notifikasi via email</div>
                </div>
              </div>
              <Switch 
                checked={settings.emailNotifications} 
                onCheckedChange={() => handleToggle("emailNotifications")} 
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">Push Notification</div>
                  <div className="text-xs text-muted-foreground">Terima notifikasi browser</div>
                </div>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={() => handleToggle("pushNotifications")} 
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">Email Marketing</div>
                  <div className="text-xs text-muted-foreground">Terima promo dan penawaran</div>
                </div>
              </div>
              <Switch 
                checked={settings.marketingEmails} 
                onCheckedChange={() => handleToggle("marketingEmails")} 
              />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Keamanan</h3>
              <p className="text-sm text-muted-foreground">Pengaturan keamanan akun</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">Autentikasi 2 Faktor</div>
                  <div className="text-xs text-muted-foreground">Tingkatkan keamanan akun</div>
                </div>
              </div>
              <Switch 
                checked={settings.twoFactorAuth} 
                onCheckedChange={() => handleToggle("twoFactorAuth")} 
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium text-sm">Ubah Password</div>
                <div className="text-xs text-muted-foreground">Perbarui password akun Anda</div>
              </div>
              <Button variant="outline" size="sm">Ubah</Button>
            </div>
          </div>
        </Card>

        {/* Subscription Settings */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Langganan</h3>
              <p className="text-sm text-muted-foreground">Pengaturan langganan otomatis</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium text-sm">Perpanjangan Otomatis</div>
                <div className="text-xs text-muted-foreground">Perpanjang langganan secara otomatis</div>
              </div>
              <Switch 
                checked={settings.autoRenew} 
                onCheckedChange={() => handleToggle("autoRenew")} 
              />
            </div>
          </div>
        </Card>

        <Button variant="premium" className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Simpan Semua Pengaturan
        </Button>
      </div>
    </>
  );
}

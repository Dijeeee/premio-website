import { Download, ExternalLink, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const downloads = [
  { name: "Netflix Premium", logo: "N", color: "from-red-600 to-red-500", downloadDate: "5 Des 2024", version: "v15.2.0", size: "45 MB" },
  { name: "Canva Pro", logo: "C", color: "from-cyan-500 to-blue-500", downloadDate: "3 Des 2024", version: "v2.240.0", size: "120 MB" },
  { name: "Spotify Premium", logo: "S", color: "from-green-500 to-green-400", downloadDate: "1 Des 2024", version: "v8.8.96", size: "35 MB" },
  { name: "Adobe Photoshop", logo: "Ps", color: "from-blue-600 to-blue-500", downloadDate: "28 Nov 2024", version: "v25.3.1", size: "2.5 GB" },
  { name: "ChatGPT Plus", logo: "G", color: "from-emerald-500 to-teal-500", downloadDate: "25 Nov 2024", version: "Web App", size: "-" },
];

export function DashboardDownloads() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Riwayat Download</h1>
        <p className="text-sm text-muted-foreground">Aplikasi yang telah Anda unduh</p>
      </div>

      {/* Stats */}
      <Card variant="glass" className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <Download className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">{downloads.length}</div>
            <div className="text-sm text-muted-foreground">Total Download</div>
          </div>
        </div>
      </Card>

      {/* Downloads List */}
      <Card variant="glass">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Riwayat Download</h2>
        </div>
        <div className="divide-y divide-border">
          {downloads.map((item, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                <span className="text-white font-bold text-sm">{item.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.downloadDate}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{item.version}</Badge>
                  {item.size !== "-" && (
                    <Badge variant="outline" className="text-xs">{item.size}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Update
                </Button>
                <Button variant="premium" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Buka
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {downloads.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <Download className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold mb-2">Belum ada download</h3>
          <p className="text-sm text-muted-foreground mb-4">Download aplikasi premium Anda di sini</p>
          <Button variant="premium">Jelajahi Produk</Button>
        </Card>
      )}
    </>
  );
}

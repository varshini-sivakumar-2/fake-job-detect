import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, ScanSearch, Search, BookOpen, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobScanner from "@/components/dashboard/JobScanner";
import SearchJobs from "@/components/dashboard/SearchJobs";
import Guidance from "@/components/dashboard/Guidance";
import AdminBoard from "@/components/dashboard/AdminBoard";
import type { PredictionResult } from "@/lib/prediction";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [scanHistory, setScanHistory] = useState<PredictionResult[]>([]);

  const handleScanComplete = (result: PredictionResult) => {
    setScanHistory((prev) => [...prev, result]);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="text-primary-foreground px-6 py-4 flex items-center justify-between" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3 font-bold text-lg">
          <Shield className="w-6 h-6" /> Fake Job Detector
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90">Welcome, {username}</span>
          <Button variant="outline" size="sm" onClick={onLogout} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="scanner" className="flex items-center gap-2 text-xs sm:text-sm">
              <ScanSearch className="w-4 h-4" /> <span className="hidden sm:inline">Job Scanner</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2 text-xs sm:text-sm">
              <Search className="w-4 h-4" /> <span className="hidden sm:inline">Search Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="guidance" className="flex items-center gap-2 text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Guidance</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4" /> <span className="hidden sm:inline">Admin Board</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <JobScanner onScanComplete={handleScanComplete} />
          </TabsContent>
          <TabsContent value="search">
            <SearchJobs />
          </TabsContent>
          <TabsContent value="guidance">
            <Guidance />
          </TabsContent>
          <TabsContent value="admin">
            <AdminBoard scanHistory={scanHistory} />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        AI-Based Fake Job Detection System | Final Year Project | © 2024
      </footer>
    </div>
  );
};

export default Dashboard;

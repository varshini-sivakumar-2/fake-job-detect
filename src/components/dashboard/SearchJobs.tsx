import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Building2, DollarSign, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  isSafe: boolean;
  safetyScore: number;
}

const sampleJobs: JobListing[] = [
  { id: 1, title: "Frontend Developer", company: "TechCorp Inc.", location: "San Francisco, CA", salary: "$90K - $130K", type: "Full-time", description: "Build and maintain web applications using React and TypeScript. 3+ years experience required.", isSafe: true, safetyScore: 95 },
  { id: 2, title: "Data Entry Operator", company: "", location: "Work from Home", salary: "$5000/week", type: "Part-time", description: "Easy money! No experience needed. Start earning immediately. Contact us on WhatsApp.", isSafe: false, safetyScore: 15 },
  { id: 3, title: "Product Manager", company: "InnovateTech", location: "New York, NY", salary: "$120K - $160K", type: "Full-time", description: "Lead product strategy and work with cross-functional teams. MBA preferred, 5+ years PM experience.", isSafe: true, safetyScore: 92 },
  { id: 4, title: "Online Form Filling", company: "Quick Cash Ltd", location: "Remote", salary: "$3000/day", type: "Contract", description: "Guaranteed income! Pay registration fee of $50 to start. Unlimited earning potential!!!", isSafe: false, safetyScore: 8 },
  { id: 5, title: "Backend Engineer", company: "CloudScale Systems", location: "Austin, TX", salary: "$100K - $145K", type: "Full-time", description: "Design and build scalable APIs using Node.js and PostgreSQL. Experience with AWS required.", isSafe: true, safetyScore: 97 },
  { id: 6, title: "Marketing Coordinator", company: "BrightMedia Agency", location: "Chicago, IL", salary: "$55K - $70K", type: "Full-time", description: "Coordinate marketing campaigns across digital channels. Bachelor's degree in Marketing required.", isSafe: true, safetyScore: 90 },
  { id: 7, title: "Copy Paste Job", company: "", location: "Anywhere", salary: "$500/hour", type: "Freelance", description: "Simple copy paste work. No skills needed. Act now! Limited spots. Send your details via Telegram.", isSafe: false, safetyScore: 5 },
  { id: 8, title: "UX Designer", company: "DesignHub Co.", location: "Seattle, WA", salary: "$85K - $115K", type: "Full-time", description: "Create intuitive user experiences for SaaS products. Proficiency in Figma and user research methods.", isSafe: true, safetyScore: 94 },
];

const SearchJobs = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "safe" | "suspicious">("all");

  const filtered = sampleJobs.filter((job) => {
    const matchesQuery = !query || job.title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase()) || job.location.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "safe" && job.isSafe) || (filter === "suspicious" && !job.isSafe);
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, company, or location..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              {(["all", "safe", "suspicious"] as const).map((f) => (
                <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}
                  className={filter === f ? "" : ""} style={filter === f ? { background: "var(--gradient-primary)" } : {}}>
                  {f === "all" ? "All" : f === "safe" ? "✅ Safe" : "⚠️ Suspicious"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((job) => (
          <Card key={job.id} className={`shadow-[var(--shadow-card)] border-l-4 transition-all hover:shadow-[var(--shadow-elevated)] ${job.isSafe ? "border-l-success" : "border-l-destructive"}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{job.title}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Building2 className="w-3 h-3" /> {job.company || "Unknown Company"}
                  </div>
                </div>
                <Badge variant={job.isSafe ? "default" : "destructive"} className={job.isSafe ? "bg-success text-success-foreground" : ""}>
                  {job.isSafe ? <><CheckCircle className="w-3 h-3 mr-1" /> Safe</> : <><AlertTriangle className="w-3 h-3 mr-1" /> Risky</>}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{job.type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Safety: {job.safetyScore}%</span>
                  <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${job.safetyScore > 70 ? "bg-success" : job.safetyScore > 40 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${job.safetyScore}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No jobs found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchJobs;

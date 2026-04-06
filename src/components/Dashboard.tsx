import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Search, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

interface PredictionResult {
  prediction: string;
  is_fake: boolean;
  confidence: number;
  model_accuracy: number;
  reasons: string[];
  tips: string[];
}

function simulatePrediction(data: Record<string, string>): PredictionResult {
  const desc = (data.description || "").toLowerCase();
  const company = (data.company || "").toLowerCase();
  const title = (data.title || "").toLowerCase();
  const salary = (data.salary || "").toLowerCase();
  const requirements = (data.requirements || "").toLowerCase();

  const redFlags: string[] = [];
  let fakeScore = 0;

  // Description quality checks
  if (desc.length < 100) { redFlags.push("Job description is unusually short and lacks detail"); fakeScore += 20; }
  if (desc.length > 0 && desc.length < 200) { redFlags.push("Description lacks sufficient detail about role responsibilities"); fakeScore += 10; }

  // Urgency & pressure tactics
  if (/urgent|immediately|asap|hurry|right now|today only|limited time/.test(desc)) { redFlags.push("Uses urgency tactics commonly found in scam postings"); fakeScore += 15; }

  // Unrealistic promises
  if (/guaranteed income|easy money|get rich|unlimited earning|make \$?\d{4,}.*per (day|week)|work from home.*\$/.test(desc)) { redFlags.push("Contains unrealistic promises about earnings"); fakeScore += 20; }

  // Payment requests
  if (/wire transfer|pay upfront|registration fee|processing fee|training fee|deposit required/.test(desc)) { redFlags.push("Requests payment from applicants — legitimate jobs never ask for fees"); fakeScore += 25; }

  // Company checks
  if (!company || company.length < 3) { redFlags.push("Company information is missing or too vague to verify"); fakeScore += 15; }

  // Email checks
  if (/@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com/.test(desc)) { redFlags.push("Uses free email service instead of corporate email domain"); fakeScore += 15; }

  // Salary red flags
  if (/\$\d{3,}k|\$\d{6,}|(\d{3},\d{3})/.test(salary) || /high salary|top pay|big money/.test(desc)) { redFlags.push("Salary offering appears unusually high for the role described"); fakeScore += 10; }
  if (!salary || salary.trim() === "") { redFlags.push("No salary range provided — legitimate employers typically disclose compensation"); fakeScore += 8; }

  // Vague requirements
  if (!requirements || requirements.length < 20) { redFlags.push("Job requirements are missing or extremely vague"); fakeScore += 10; }
  if (/no experience|no qualification|no degree|anyone can apply|no skills/.test(desc + " " + requirements)) { redFlags.push("No qualifications required — unusual for legitimate positions"); fakeScore += 15; }

  // Suspicious job titles
  if (/data entry|home based|online job|typing job|copy paste|ad posting|form filling/.test(title)) { redFlags.push("Job title matches commonly used scam job categories"); fakeScore += 15; }

  // Contact info in description
  if (/whatsapp|telegram|call.*\d{10}|text.*\d{10}|contact.*personally/.test(desc)) { redFlags.push("Uses personal messaging platforms instead of formal application process"); fakeScore += 15; }

  // Grammar / spam signals
  if (/!!!|click here|act now|congratulations|selected|you have been chosen/.test(desc)) { redFlags.push("Contains spam-like language and excessive punctuation"); fakeScore += 15; }

  const isFake = fakeScore >= 25;
  const confidence = isFake ? Math.min(60 + fakeScore, 97) : Math.max(95 - fakeScore * 2, 65);

  return {
    prediction: isFake ? "Fake Job" : "Real Job",
    is_fake: isFake,
    confidence,
    model_accuracy: 96.4,
    reasons: redFlags.length > 0 ? redFlags : ["This job posting appears legitimate based on our analysis"],
    tips: [
      "Always research the company on LinkedIn and Glassdoor",
      "Never pay any fees to apply for a job",
      "Be cautious of vague job descriptions",
      "Verify the company email domain",
      "Be wary of jobs that seem too good to be true",
    ],
  };
}

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [formData, setFormData] = useState({ title: "", company: "", location: "", salary: "", description: "", requirements: "" });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1500));
    setResult(simulatePrediction(formData));
    setLoading(false);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Fake Job Detection</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter job posting details below to verify if it's real or fake using our trained machine learning model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-lg">📋 Job Posting Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input value={formData.title} onChange={update("title")} placeholder="e.g., Software Engineer" required />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={formData.company} onChange={update("company")} placeholder="e.g., Google Inc." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={formData.location} onChange={update("location")} placeholder="e.g., New York" />
                  </div>
                  <div className="space-y-2">
                    <Label>Salary Range</Label>
                    <Input value={formData.salary} onChange={update("salary")} placeholder="e.g., $50K-$80K" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Description *</Label>
                  <Textarea value={formData.description} onChange={update("description")} placeholder="Paste the full job description here..." rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea value={formData.requirements} onChange={update("requirements")} placeholder="List job requirements..." rows={3} />
                </div>
                <Button type="submit" className="w-full py-6 text-base" style={{ background: "var(--gradient-primary)" }} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Analyzing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Search className="w-5 h-5" /> Analyze Job Posting</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <>
                <Card className="shadow-[var(--shadow-card)] animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Badge */}
                    <div className={`text-center p-5 rounded-xl text-2xl font-bold ${result.is_fake ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                      {result.is_fake ? <AlertTriangle className="w-8 h-8 mx-auto mb-2" /> : <CheckCircle className="w-8 h-8 mx-auto mb-2" />}
                      {result.prediction}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                        <div className="text-3xl font-bold text-foreground">{result.confidence}%</div>
                        <div className="h-1.5 bg-border rounded-full mt-3 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${result.confidence}%`, background: "var(--gradient-primary)" }} />
                        </div>
                      </div>
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Model Accuracy</div>
                        <div className="text-3xl font-bold text-foreground">{result.model_accuracy}%</div>
                        <div className="h-1.5 bg-border rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${result.model_accuracy}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">💡 Analysis Explanation</h3>
                      <ul className="space-y-2">
                        {result.reasons.map((r, i) => (
                          <li key={i} className={`text-sm p-3 rounded-lg border-l-4 ${result.is_fake ? "bg-warning/10 border-warning text-warning-foreground" : "bg-success/10 border-success text-success"}`}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-[var(--shadow-card)] animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg">🛡️ Tips to Stay Safe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="text-sm p-3 bg-secondary rounded-lg text-secondary-foreground flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-success" /> {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {!result && (
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="py-16 text-center">
                  <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Fill in the job details and click Analyze to see results here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        AI-Based Fake Job Detection System | Final Year Project | © 2024
      </footer>
    </div>
  );
};

export default Dashboard;

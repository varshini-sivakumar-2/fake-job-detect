import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { simulatePrediction, type PredictionResult } from "@/lib/prediction";

interface JobScannerProps {
  onScanComplete: (result: PredictionResult) => void;
}

const JobScanner = ({ onScanComplete }: JobScannerProps) => {
  const [formData, setFormData] = useState({ title: "", company: "", location: "", salary: "", description: "", requirements: "" });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const prediction = simulatePrediction(formData);
    setResult(prediction);
    onScanComplete(prediction);
    setLoading(false);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
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

      <div className="space-y-6">
        {result ? (
          <>
            <Card className="shadow-[var(--shadow-card)] animate-fade-in">
              <CardHeader><CardTitle className="text-lg">📊 Analysis Results</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className={`text-center p-5 rounded-xl text-2xl font-bold ${result.is_fake ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                  {result.is_fake ? <AlertTriangle className="w-8 h-8 mx-auto mb-2" /> : <CheckCircle className="w-8 h-8 mx-auto mb-2" />}
                  {result.prediction}
                </div>
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
                <div>
                  <h3 className="font-semibold text-foreground mb-3">💡 Analysis Explanation</h3>
                  <ul className="space-y-2">
                    {result.reasons.map((r, i) => (
                      <li key={i} className={`text-sm p-3 rounded-lg border-l-4 ${result.is_fake ? "bg-warning/10 border-warning text-warning-foreground" : "bg-success/10 border-success text-success"}`}>{r}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow-card)] animate-fade-in">
              <CardHeader><CardTitle className="text-lg">🛡️ Tips to Stay Safe</CardTitle></CardHeader>
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
        ) : (
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="py-16 text-center">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Fill in the job details and click Analyze to see results here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobScanner;

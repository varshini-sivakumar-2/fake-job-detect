import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, BookOpen, Eye, Mail, DollarSign, Globe, Users } from "lucide-react";


const redFlags = [
  "Job posting has many spelling and grammar errors",
  "Required to provide bank details or SSN upfront",
  "Interview conducted only through chat (no video/phone)",
  "Job offer given without a proper interview process",
  "Company has no online presence or reviews",
  "Posting uses urgency tactics ('Apply NOW!' or 'Limited spots!')",
  "Salary is significantly above market rate for the role",
  "Generic job titles like 'Data Entry' or 'Online Job'",
];

const greenFlags = [
  "Company has verifiable LinkedIn page with employees",
  "Clear job responsibilities and required qualifications",
  "Professional corporate email domain",
  "Transparent salary range and benefits",
  "Standard interview process (phone, video, onsite)",
  "Company registered on job boards like Indeed or Glassdoor",
  "Clear reporting structure and team information",
  "Office address that can be verified on Google Maps",
];

const Guidance = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]" style={{ background: "var(--gradient-hero)" }}>
        <CardContent className="py-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-primary-foreground" />
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Job Safety Guide</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            Learn how to identify fake job postings and protect yourself from employment scams.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Eye, title: "Research the Company", description: "Always verify the company exists on LinkedIn, Glassdoor, and official websites. Look for a professional web presence and employee reviews." },
          { icon: Mail, title: "Check the Email Domain", description: "Legitimate companies use corporate email domains (@company.com). Be suspicious of Gmail, Yahoo, or Hotmail for official communications." },
          { icon: DollarSign, title: "Never Pay to Apply", description: "Real employers never ask for money. If a job requires registration fees or training fees, it's likely a scam." },
          { icon: Shield, title: "Beware Vague Descriptions", description: "Legitimate postings detail responsibilities, qualifications, and company info. Scams use generic language like 'easy money'." },
          { icon: Globe, title: "Verify Contact Methods", description: "Professional recruiters use company email and phone. Be wary of WhatsApp or Telegram as primary contact." },
          { icon: Users, title: "Check Salary Expectations", description: "If the salary seems too good to be true for the role, research market rates for similar positions." },
        ].map((tip, i) => (
          <Card key={i} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all">
            <CardContent className="pt-6">
              <tip.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Red Flags 🚩
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {redFlags.map((flag, i) => (
                <li key={i} className="text-sm p-3 bg-destructive/5 rounded-lg border-l-4 border-destructive text-foreground flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" /> {flag}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" /> Green Flags ✅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {greenFlags.map((flag, i) => (
                <li key={i} className="text-sm p-3 bg-success/5 rounded-lg border-l-4 border-success text-foreground flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-success" /> {flag}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guidance;

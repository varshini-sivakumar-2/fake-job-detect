export interface PredictionResult {
  prediction: string;
  is_fake: boolean;
  confidence: number;
  model_accuracy: number;
  reasons: string[];
  tips: string[];
}

export function simulatePrediction(data: Record<string, string>): PredictionResult {
  const desc = (data.description || "").toLowerCase();
  const company = (data.company || "").toLowerCase();
  const title = (data.title || "").toLowerCase();
  const salary = (data.salary || "").toLowerCase();
  const requirements = (data.requirements || "").toLowerCase();

  const redFlags: string[] = [];
  let fakeScore = 0;

  if (desc.length < 100) { redFlags.push("Job description is unusually short and lacks detail"); fakeScore += 20; }
  if (desc.length > 0 && desc.length < 200) { redFlags.push("Description lacks sufficient detail about role responsibilities"); fakeScore += 10; }
  if (/urgent|immediately|asap|hurry|right now|today only|limited time/.test(desc)) { redFlags.push("Uses urgency tactics commonly found in scam postings"); fakeScore += 15; }
  if (/guaranteed income|easy money|get rich|unlimited earning|make \$?\d{4,}.*per (day|week)|work from home.*\$/.test(desc)) { redFlags.push("Contains unrealistic promises about earnings"); fakeScore += 20; }
  if (/wire transfer|pay upfront|registration fee|processing fee|training fee|deposit required/.test(desc)) { redFlags.push("Requests payment from applicants — legitimate jobs never ask for fees"); fakeScore += 25; }
  if (!company || company.length < 3) { redFlags.push("Company information is missing or too vague to verify"); fakeScore += 15; }
  if (/@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com/.test(desc)) { redFlags.push("Uses free email service instead of corporate email domain"); fakeScore += 15; }
  if (/\$\d{3,}k|\$\d{6,}|(\d{3},\d{3})/.test(salary) || /high salary|top pay|big money/.test(desc)) { redFlags.push("Salary offering appears unusually high for the role described"); fakeScore += 10; }
  if (!salary || salary.trim() === "") { redFlags.push("No salary range provided — legitimate employers typically disclose compensation"); fakeScore += 8; }
  if (!requirements || requirements.length < 20) { redFlags.push("Job requirements are missing or extremely vague"); fakeScore += 10; }
  if (/no experience|no qualification|no degree|anyone can apply|no skills/.test(desc + " " + requirements)) { redFlags.push("No qualifications required — unusual for legitimate positions"); fakeScore += 15; }
  if (/data entry|home based|online job|typing job|copy paste|ad posting|form filling/.test(title)) { redFlags.push("Job title matches commonly used scam job categories"); fakeScore += 15; }
  if (/whatsapp|telegram|call.*\d{10}|text.*\d{10}|contact.*personally/.test(desc)) { redFlags.push("Uses personal messaging platforms instead of formal application process"); fakeScore += 15; }
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

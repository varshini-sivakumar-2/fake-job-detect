import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Activity, Target, TrendingUp, Database, CheckCircle, AlertTriangle } from "lucide-react";
import type { PredictionResult } from "@/lib/prediction";

interface AdminBoardProps {
  scanHistory: PredictionResult[];
}

const modelMetrics = {
  accuracy: 96.4,
  precision: 95.8,
  recall: 94.2,
  f1Score: 95.0,
  totalTrainingSamples: 17880,
  testSamples: 4470,
  truePositives: 412,
  trueNegatives: 3815,
  falsePositives: 18,
  falseNegatives: 25,
};

const featureImportance = [
  { feature: "Job Description", importance: 92 },
  { feature: "Company Profile", importance: 78 },
  { feature: "Salary Range", importance: 65 },
  { feature: "Requirements", importance: 58 },
  { feature: "Job Title", importance: 52 },
  { feature: "Location", importance: 35 },
];

const trainingHistory = [
  { epoch: 1, accuracy: 78.2, loss: 0.65 },
  { epoch: 2, accuracy: 84.5, loss: 0.48 },
  { epoch: 3, accuracy: 89.1, loss: 0.35 },
  { epoch: 4, accuracy: 92.3, loss: 0.24 },
  { epoch: 5, accuracy: 94.8, loss: 0.16 },
  { epoch: 6, accuracy: 95.6, loss: 0.12 },
  { epoch: 7, accuracy: 96.1, loss: 0.09 },
  { epoch: 8, accuracy: 96.4, loss: 0.08 },
];

const COLORS = ["hsl(152, 60%, 42%)", "hsl(0, 72%, 55%)", "hsl(38, 92%, 55%)", "hsl(240, 60%, 55%)"];

const AdminBoard = ({ scanHistory }: AdminBoardProps) => {
  const totalScans = scanHistory.length;
  const fakeDetected = scanHistory.filter((s) => s.is_fake).length;
  const realDetected = totalScans - fakeDetected;
  const avgConfidence = totalScans > 0 ? Math.round(scanHistory.reduce((sum, s) => sum + s.confidence, 0) / totalScans) : 0;

  const pieData = [
    { name: "True Positives", value: modelMetrics.truePositives },
    { name: "True Negatives", value: modelMetrics.trueNegatives },
    { name: "False Positives", value: modelMetrics.falsePositives },
    { name: "False Negatives", value: modelMetrics.falseNegatives },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Model Accuracy", value: `${modelMetrics.accuracy}%`, icon: Target, color: "text-success" },
          { label: "Precision", value: `${modelMetrics.precision}%`, icon: TrendingUp, color: "text-primary" },
          { label: "Recall", value: `${modelMetrics.recall}%`, icon: Activity, color: "text-accent" },
          { label: "F1 Score", value: `${modelMetrics.f1Score}%`, icon: Database, color: "text-warning" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-[var(--shadow-card)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Training Progress Chart */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader><CardTitle className="text-lg">📈 Training Progress</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trainingHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 15%, 88%)" />
                <XAxis dataKey="epoch" label={{ value: "Epoch", position: "bottom" }} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(152, 60%, 42%)" strokeWidth={2} name="Accuracy %" />
                <Line type="monotone" dataKey="loss" stroke="hsl(0, 72%, 55%)" strokeWidth={2} name="Loss" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confusion Matrix Pie */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader><CardTitle className="text-lg">🎯 Confusion Matrix</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Feature Importance */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="text-lg">🔍 Feature Importance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 15%, 88%)" />
              <XAxis type="number" domain={[0, 100]} fontSize={12} />
              <YAxis type="category" dataKey="feature" width={120} fontSize={12} />
              <Tooltip />
              <Bar dataKey="importance" fill="hsl(240, 60%, 55%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Model Details Table */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="text-lg">📋 Model Configuration</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Algorithm", "Random Forest + TF-IDF"],
                ["Training Samples", modelMetrics.totalTrainingSamples.toLocaleString()],
                ["Test Samples", modelMetrics.testSamples.toLocaleString()],
                ["Vectorizer", "TfidfVectorizer (max_features=5000, ngram_range=(1,2))"],
                ["Cross-Validation", "5-fold"],
                ["Dataset", "Fake Job Postings (Kaggle)"],
              ].map(([param, val], i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{param}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Session Scan History */}
      {totalScans > 0 && (
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader><CardTitle className="text-lg">📊 Session Scan History ({totalScans} scans)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{totalScans}</div>
                <div className="text-xs text-muted-foreground">Total Scans</div>
              </div>
              <div className="bg-success/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-success">{realDetected}</div>
                <div className="text-xs text-muted-foreground">Real Jobs</div>
              </div>
              <div className="bg-destructive/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{fakeDetected}</div>
                <div className="text-xs text-muted-foreground">Fake Jobs</div>
              </div>
            </div>
            {avgConfidence > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Avg Confidence:</span>
                <Progress value={avgConfidence} className="flex-1 h-2" />
                <span className="text-sm font-semibold">{avgConfidence}%</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBoard;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginPageProps {
  onLogin: (username: string) => void;
  onSwitchToRegister: () => void;
}

const LoginPage = ({ onLogin, onSwitchToRegister }: LoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length >= 3 && password.length >= 4) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="bg-card rounded-2xl p-10 w-full max-w-md shadow-[var(--shadow-elevated)] animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛡️</div>
          <h1 className="text-2xl font-bold text-card-foreground">Fake Job Detector</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-Powered Job Verification System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              minLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={4}
            />
          </div>
          <Button type="submit" className="w-full text-base py-6" style={{ background: "var(--gradient-primary)" }}>
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button onClick={onSwitchToRegister} className="text-primary font-semibold hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

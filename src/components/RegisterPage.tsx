import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterPageProps {
  onRegister: (username: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterPage = ({ onRegister, onSwitchToLogin }: RegisterPageProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length >= 3 && password.length >= 4) {
      onRegister(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="bg-card rounded-2xl p-10 w-full max-w-md shadow-[var(--shadow-elevated)] animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛡️</div>
          <h1 className="text-2xl font-bold text-card-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join the Fake Job Detection System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reg-username">Username</Label>
            <Input id="reg-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required minLength={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required minLength={4} />
          </div>
          <Button type="submit" className="w-full text-base py-6" style={{ background: "var(--gradient-primary)" }}>
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

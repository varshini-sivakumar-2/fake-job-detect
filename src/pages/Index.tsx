import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import Dashboard from "@/components/Dashboard";

type Page = "login" | "register" | "dashboard";

const Index = () => {
  const [page, setPage] = useState<Page>("login");
  const [username, setUsername] = useState("");

  const handleLogin = (name: string) => {
    setUsername(name);
    setPage("dashboard");
  };

  if (page === "register") {
    return <RegisterPage onRegister={handleLogin} onSwitchToLogin={() => setPage("login")} />;
  }

  if (page === "dashboard") {
    return <Dashboard username={username} onLogout={() => setPage("login")} />;
  }

  return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setPage("register")} />;
};

export default Index;

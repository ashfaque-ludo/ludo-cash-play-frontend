import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dice5, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const r = await login(email.trim(), password);
    setLoading(false);
    if (r.ok) {
      toast.success("Welcome back!");
      const to = r.user.role === "super_admin" ? "/super-admin" :
                 ["admin", "staff_manager", "support_agent"].includes(r.user.role) ? "/admin" :
                 (loc.state?.from || "/dashboard");
      nav(to, { replace: true });
    } else setError(r.error);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0A0A0E] grid place-items-center px-4">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <Card className="w-full max-w-md glass-strong border-white/10 text-white relative">
        <CardHeader className="text-center">
          <div className="flex justify-center"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 grid place-items-center"><Dice5 className="w-6 h-6 text-white" /></div></div>
          <CardTitle className="text-2xl mt-3 text-white">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">Login to continue your winning streak</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" data-testid="login-form">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="login-email" />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="login-password" />
            </div>
            {error && <div className="text-red-400 text-sm" data-testid="login-error">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold h-11" data-testid="login-submit">
              <LogIn className="w-4 h-4 mr-2" /> {loading ? "Logging in…" : "Login"}
            </Button>
          </form>
          <div className="mt-5 text-center text-sm text-slate-400">
            New here? <Link to="/register" className="text-purple-300 hover:text-white" data-testid="login-register-link">Create account</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

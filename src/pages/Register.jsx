import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dice5, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    referral_code: params.get("ref") || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      password: form.password,
      referral_code: form.referral_code.trim() || null,
    };
    const r = await register(payload);
    setLoading(false);
    if (r.ok) {
      toast.success("Welcome to Ludo Cash Play!");
      nav("/dashboard");
    } else setError(r.error);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0A0A0E] grid place-items-center px-4">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <Card className="w-full max-w-md glass-strong border-white/10 text-white relative">
        <CardHeader className="text-center">
          <div className="flex justify-center"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 grid place-items-center"><Dice5 className="w-6 h-6 text-white" /></div></div>
          <CardTitle className="text-2xl mt-3 text-white">Create account</CardTitle>
          <CardDescription className="text-slate-400">Sign up and get ₹50 bonus on referral signup</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3" data-testid="register-form">
            <div>
              <Label className="text-slate-300">Name</Label>
              <Input value={form.name} onChange={(e)=>set("name", e.target.value)} required minLength={2}
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="register-name" />
            </div>
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input type="email" value={form.email} onChange={(e)=>set("email", e.target.value)} required
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="register-email" />
            </div>
            <div>
              <Label className="text-slate-300">Phone (optional)</Label>
              <Input value={form.phone} onChange={(e)=>set("phone", e.target.value)}
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="register-phone" />
            </div>
            <div>
              <Label className="text-slate-300">Password</Label>
              <Input type="password" value={form.password} onChange={(e)=>set("password", e.target.value)} required minLength={6}
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="register-password" />
            </div>
            <div>
              <Label className="text-slate-300">Referral code (optional)</Label>
              <Input value={form.referral_code} onChange={(e)=>set("referral_code", e.target.value.toUpperCase())}
                className="bg-black/40 border-white/10 text-white mt-1" data-testid="register-referral" />
            </div>
            {error && <div className="text-red-400 text-sm" data-testid="register-error">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold h-11" data-testid="register-submit">
              <UserPlus className="w-4 h-4 mr-2" /> {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <div className="mt-5 text-center text-sm text-slate-400">
            Already a member? <Link to="/login" className="text-purple-300 hover:text-white" data-testid="register-login-link">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

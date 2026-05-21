import React, { useEffect, useState } from "react";
import { api, fmtINR } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Gift, Users } from "lucide-react";
import { toast } from "sonner";

export default function Referral() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(()=>{ api.get("/referral").then(r=>setData(r.data)).catch(()=>{}); }, []);
  if (!user || user === false) return null;

  const link = `${window.location.origin}/register?ref=${data?.code || ""}`;
  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(()=>setCopied(false), 1500);
    toast.success("Copied!");
  };
  const share = async () => {
    if (navigator.share) await navigator.share({ title: "Ludo Cash Play", text: `Join me on Ludo Cash Play with my code ${data?.code}`, url: link });
    else copy(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0A0A0E] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-purple-400 font-bold">Invite & earn</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2"><span className="grad-text">Refer friends</span>, earn ₹25 each</h1>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">Friends who join with your code get a ₹50 welcome bonus. You earn ₹25 instantly.</p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Card className="glass-strong border-white/10 text-white"><CardContent className="py-5">
            <div className="text-xs uppercase tracking-widest text-slate-400">Your code</div>
            <div className="text-2xl font-black mt-1 grad-text" data-testid="referral-code">{data?.code || "—"}</div>
          </CardContent></Card>
          <Card className="glass-strong border-white/10 text-white"><CardContent className="py-5">
            <div className="text-xs uppercase tracking-widest text-slate-400">Friends joined</div>
            <div className="text-2xl font-black mt-1" data-testid="referral-count">{data?.referred_count ?? 0}</div>
          </CardContent></Card>
          <Card className="glass-strong border-white/10 text-white"><CardContent className="py-5">
            <div className="text-xs uppercase tracking-widest text-slate-400">Total earnings</div>
            <div className="text-2xl font-black mt-1 text-emerald-400" data-testid="referral-earnings">{fmtINR(data?.total_earnings ?? 0)}</div>
          </CardContent></Card>
        </div>

        <Card className="mt-6 glass-strong border-white/10 text-white">
          <CardContent className="py-5 flex flex-wrap items-center justify-between gap-3">
            <div className="font-mono text-sm text-slate-300 truncate" data-testid="referral-link">{link}</div>
            <div className="flex gap-2">
              <Button onClick={()=>copy(link)} variant="outline" className="rounded-full border-white/20 bg-white/5 text-white" data-testid="copy-referral">
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />} Copy
              </Button>
              <Button onClick={share} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="share-referral">
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 glass-strong border-white/10 text-white">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /> Friends you've referred</CardTitle></CardHeader>
          <CardContent>
            {data?.referrals?.length ? data.referrals.map(r=>(
              <div key={r.id} className="py-2 flex justify-between text-sm border-b border-white/5 last:border-0">
                <span>{r.name}</span>
                <span className="text-slate-400">{new Date(r.created_at).toLocaleDateString("en-IN")}</span>
              </div>
            )) : <div className="text-slate-400 text-sm">No referrals yet.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

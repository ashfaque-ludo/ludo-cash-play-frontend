import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, fmtINR, formatApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Dice5, Copy, Check, Upload, Trophy, X } from "lucide-react";
import { toast } from "sonner";

export default function MatchRoom() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, refresh } = useAuth();
  const [match, setMatch] = useState(null);
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try { const r = await api.get(`/matches/${id}`); setMatch(r.data); }
    catch (e) { toast.error("Match not found"); nav("/play"); }
  };
  useEffect(()=>{ load(); const i = setInterval(load, 4000); return ()=>clearInterval(i); }, [id]);

  if (!match) return <div className="min-h-screen pt-24 bg-[#0A0A0E]" />;

  const isVip = match.tier === "vip";
  const me = user && match.players?.find(p => p.id === user.id);
  const myResult = user && match.results?.[user.id];
  const opp = user && match.players?.find(p => p.id !== user.id);

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setScreenshot(reader.result);
    reader.readAsDataURL(f);
  };
  const copyRoom = async () => {
    await navigator.clipboard.writeText(match.room_code);
    setCopied(true); setTimeout(()=>setCopied(false), 1500);
  };
  const submit = async (result) => {
    if (result === "won" && !screenshot) return toast.error("Please upload a winning screenshot");
    setBusy(true);
    try {
      const r = await api.post(`/matches/${id}/submit-result`, { result, screenshot_b64: screenshot || null, note });
      if (r.data.auto_resolved) toast.success(r.data.winner_id === user.id ? "You won!" : r.data.cancelled ? "Match cancelled" : "Match finalized");
      else if (r.data.status === "disputed") toast("Conflict detected — admin will review", { description: "You'll be notified shortly." });
      else toast.success("Result submitted");
      await refresh(); await load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
    finally { setBusy(false); }
  };

  const statusColor =
    match.status === "ended" ? "text-emerald-400" :
    match.status === "cancelled" ? "text-red-400" :
    match.status === "disputed" ? "text-amber-300" :
    match.status === "awaiting_review" ? "text-blue-300" :
    "text-purple-300";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0A0A0E] text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <Card className={`text-white ${isVip ? "bg-gradient-to-br from-amber-500/10 to-amber-900/20 border-amber-500/40 glow-ring-gold" : "glass-strong border-white/10"}`} data-testid="match-room">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              {isVip ? <Crown className="w-7 h-7 text-amber-300" /> : <Dice5 className="w-7 h-7 text-purple-300" />}
              <div>
                <CardTitle className="text-xl">{match.label} · {fmtINR(match.stake)}</CardTitle>
                <div className="text-xs text-slate-400 mt-0.5">Prize <span className="text-emerald-300 font-semibold">{fmtINR(match.prize)}</span></div>
              </div>
            </div>
            <Badge variant="outline" className={`${statusColor} border-current`} data-testid="match-status">{match.status.replace("_", " ")}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 flex items-center justify-between" data-testid="room-code-box">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Room code (use in Ludo King)</div>
                <div className="text-3xl font-black tracking-wider mt-1 grad-text">{match.room_code}</div>
              </div>
              <Button onClick={copyRoom} variant="outline" className="rounded-full border-white/20 bg-white/5 text-white" data-testid="copy-room-code">
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />} {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <PlayerCard p={me} label="You" isMe />
              <PlayerCard p={opp} label="Opponent" />
            </div>

            {match.status === "waiting" && (
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-4 text-sm">
                Waiting for opponent to join… Share the room code with a friend or wait for someone from the lobby.
              </div>
            )}

            {(match.status === "in_progress" || match.status === "awaiting_review" || match.status === "disputed") && me && (
              <div className="rounded-2xl glass border-white/10 p-5" data-testid="submit-result-form">
                <div className="font-semibold">Submit result</div>
                <div className="text-xs text-slate-400 mt-1">Play the match on Ludo King with code <b>{match.room_code}</b>. Then submit your result with a winning screenshot.</div>
                {myResult ? (
                  <div className="mt-3 text-sm text-slate-300">You submitted: <span className={`font-bold ${myResult.result === "won" ? "text-emerald-400" : myResult.result === "lost" ? "text-red-400" : "text-amber-300"}`}>{myResult.result}</span></div>
                ) : (
                  <>
                    <div className="mt-4">
                      <Label className="text-slate-300">Winning screenshot</Label>
                      <input type="file" accept="image/*" onChange={onFile} className="block mt-1 text-slate-300 text-sm" data-testid="result-screenshot" />
                      {screenshot && <img src={screenshot} alt="ss" className="mt-2 w-24 h-24 rounded-md object-cover border border-white/10" />}
                    </div>
                    <div className="mt-3">
                      <Label className="text-slate-300">Note (optional)</Label>
                      <Input value={note} onChange={(e)=>setNote(e.target.value)} className="bg-black/40 border-white/10 text-white mt-1" data-testid="result-note" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button disabled={busy} onClick={()=>submit("won")} className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold" data-testid="submit-won">
                        <Trophy className="w-4 h-4 mr-1" /> I won
                      </Button>
                      <Button disabled={busy} onClick={()=>submit("lost")} variant="outline" className="rounded-full border-white/20 bg-white/5 text-white" data-testid="submit-lost">
                        I lost
                      </Button>
                      <Button disabled={busy} onClick={()=>submit("cancel")} variant="outline" className="rounded-full border-red-500/30 bg-red-500/10 text-red-300" data-testid="submit-cancel">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {match.status === "ended" && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm">
                Match ended. Winner: <b className="text-emerald-300">{(match.players || []).find(p => p.id === match.winner_id)?.name || "—"}</b>.
                Prize <b>{fmtINR(match.prize)}</b> credited to winner's wallet.
              </div>
            )}
            {match.status === "cancelled" && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm">Match cancelled. Entry refunded.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlayerCard({ p, label, isMe }) {
  return (
    <div className={`rounded-2xl p-4 border ${isMe ? "bg-purple-500/10 border-purple-500/30" : "bg-white/[0.03] border-white/10"}`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
      {p ? (
        <div className="mt-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 grid place-items-center text-white font-bold">{(p.name || "?").slice(0,1).toUpperCase()}</div>
          <div className="text-white font-semibold">{p.name}</div>
        </div>
      ) : (
        <div className="mt-2 text-slate-500 text-sm">waiting…</div>
      )}
    </div>
  );
}

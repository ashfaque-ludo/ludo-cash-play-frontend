import React, { useEffect, useState } from "react";
import { api, fmtINR, formatApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Users, Wallet as WalletIcon, ArrowDownToLine, Trophy, Tag, Megaphone, BarChart3, FileText, Lock, Ban, KeyRound, Settings, Layers, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["user", "support_agent", "staff_manager", "admin", "super_admin"];

export default function Admin() {
  const { user } = useAuth();
  if (!user || user === false) return null;
  const role = user.role;
  const can = (min) => ({ user:0, support_agent:1, staff_manager:2, admin:3, super_admin:4 }[role] >= { user:0, support_agent:1, staff_manager:2, admin:3, super_admin:4 }[min]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0A0A0E] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> {user.is_master_owner ? "MASTER OWNER" : role.replace("_"," ").toUpperCase()}</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1"><span className="grad-text-gold">Owner</span> Panel</h1>
          </div>
          <Badge variant="outline" className="border-amber-500/40 text-amber-300">{user.email}</Badge>
        </div>

        <Tabs defaultValue="analytics" className="mt-6">
          <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto">
            {can("staff_manager") && <TabsTrigger value="analytics" data-testid="tab-analytics"><BarChart3 className="w-3.5 h-3.5 mr-1" /> Analytics</TabsTrigger>}
            <TabsTrigger value="users" data-testid="tab-users"><Users className="w-3.5 h-3.5 mr-1" /> Users</TabsTrigger>
            {can("staff_manager") && <TabsTrigger value="deposits" data-testid="tab-deposits"><WalletIcon className="w-3.5 h-3.5 mr-1" /> Deposits</TabsTrigger>}
            {can("staff_manager") && <TabsTrigger value="withdrawals" data-testid="tab-withdrawals"><ArrowDownToLine className="w-3.5 h-3.5 mr-1" /> Withdrawals</TabsTrigger>}
            <TabsTrigger value="matches" data-testid="tab-matches"><Trophy className="w-3.5 h-3.5 mr-1" /> Matches</TabsTrigger>
            {can("admin") && <TabsTrigger value="promos" data-testid="tab-promos"><Tag className="w-3.5 h-3.5 mr-1" /> Promos</TabsTrigger>}
            {can("admin") && <TabsTrigger value="broadcasts" data-testid="tab-broadcasts"><Megaphone className="w-3.5 h-3.5 mr-1" /> Broadcasts</TabsTrigger>}
            {can("admin") && <TabsTrigger value="logs" data-testid="tab-logs"><FileText className="w-3.5 h-3.5 mr-1" /> Logs</TabsTrigger>}
            {can("super_admin") && <TabsTrigger value="tables" data-testid="tab-tables"><Layers className="w-3.5 h-3.5 mr-1" /> Tables</TabsTrigger>}
            {can("super_admin") && <TabsTrigger value="staff" data-testid="tab-staff"><UserPlus className="w-3.5 h-3.5 mr-1" /> Staff</TabsTrigger>}
            {can("super_admin") && <TabsTrigger value="settings" data-testid="tab-settings"><Settings className="w-3.5 h-3.5 mr-1" /> Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
          <TabsContent value="users"><UsersTab actor={user} /></TabsContent>
          <TabsContent value="deposits"><DepositsTab /></TabsContent>
          <TabsContent value="withdrawals"><WithdrawalsTab /></TabsContent>
          <TabsContent value="matches"><MatchesTab actor={user} /></TabsContent>
          <TabsContent value="promos"><PromosTab /></TabsContent>
          <TabsContent value="broadcasts"><BroadcastsTab /></TabsContent>
          <TabsContent value="logs"><LogsTab /></TabsContent>
          <TabsContent value="tables"><TablesTab /></TabsContent>
          <TabsContent value="staff"><StaffTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [a, setA] = useState(null);
  useEffect(()=>{ api.get("/admin/analytics").then(r=>setA(r.data)).catch(()=>{}); }, []);
  if (!a) return <div className="text-slate-400 mt-6">Loading…</div>;
  const cards = [
    {l:"Total users", v:a.users, c:"text-purple-300"},
    {l:"Admin staff", v:a.admins, c:"text-amber-300"},
    {l:"Active matches", v:a.active_matches, c:"text-blue-300"},
    {l:"Completed", v:a.completed_matches, c:"text-emerald-400"},
    {l:"Pending deposits", v:a.pending_deposits, c:"text-amber-300"},
    {l:"Pending withdrawals", v:a.pending_withdrawals, c:"text-amber-300"},
    {l:"Total deposit (₹)", v:fmtINR(a.total_deposit), c:"text-blue-300"},
    {l:"Total withdraw (₹)", v:fmtINR(a.total_withdraw), c:"text-red-300"},
    {l:"Commission earned", v:fmtINR(a.platform_commission_earned), c:"text-emerald-400"},
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      {cards.map(c => (
        <Card key={c.l} className="glass-strong border-white/10 text-white">
          <CardContent className="py-5">
            <div className="text-xs uppercase tracking-widest text-slate-400">{c.l}</div>
            <div className={`text-2xl font-extrabold mt-1 ${c.c}`}>{c.v}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersTab({ actor }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [walletUser, setWalletUser] = useState(null);
  const [pwUser, setPwUser] = useState(null);

  const load = async () => {
    try { const r = await api.get(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`); setRows(r.data.users); } catch {}
  };
  useEffect(()=>{ load(); /* eslint-disable-line */ }, []);

  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader className="flex flex-row gap-2 items-center">
        <CardTitle>Users</CardTitle>
        <div className="ml-auto flex gap-2">
          <Input placeholder="search email / name" value={q} onChange={e=>setQ(e.target.value)} className="bg-black/40 border-white/10 text-white w-56" data-testid="user-search" />
          <Button onClick={load} className="rounded-full bg-purple-600 text-white" data-testid="user-search-btn">Search</Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Email</TableHead>
              <TableHead className="text-slate-400">Role</TableHead>
              <TableHead className="text-slate-400">Wallet</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(u => {
              const w = u.wallet || {deposit:0,winning:0,bonus:0};
              const total = (w.deposit||0)+(w.winning||0)+(w.bonus||0);
              return (
                <TableRow key={u.id} className="border-white/10" data-testid={`user-row-${u.email}`}>
                  <TableCell className="font-medium">{u.name} {u.is_master_owner && <Badge className="ml-1 bg-amber-500 text-black text-[10px]"><Lock className="w-3 h-3 mr-0.5" />MASTER</Badge>}</TableCell>
                  <TableCell className="text-slate-400">{u.email}</TableCell>
                  <TableCell><Badge variant="outline" className="border-purple-500/30 text-purple-300">{u.role}</Badge></TableCell>
                  <TableCell>{fmtINR(total)}</TableCell>
                  <TableCell>{u.banned ? <Badge variant="destructive">Banned</Badge> : <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">Active</Badge>}</TableCell>
                  <TableCell className="space-x-1">
                    <Button size="sm" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white" onClick={()=>setEditUser(u)} data-testid={`edit-${u.email}`}>Edit</Button>
                    <Button size="sm" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white" onClick={()=>setPwUser(u)} data-testid={`pw-${u.email}`}><KeyRound className="w-3 h-3" /></Button>
                    {actor.role === "super_admin" && (
                      <Button size="sm" variant="outline" className="rounded-full border-amber-500/30 bg-amber-500/10 text-amber-300" onClick={()=>setWalletUser(u)} data-testid={`wallet-${u.email}`}><WalletIcon className="w-3 h-3" /></Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      <EditUserDialog open={!!editUser} user={editUser} actor={actor} onClose={()=>{setEditUser(null); load();}} />
      <WalletDialog open={!!walletUser} user={walletUser} onClose={()=>{setWalletUser(null); load();}} />
      <ResetPwDialog open={!!pwUser} user={pwUser} onClose={()=>setPwUser(null)} />
    </Card>
  );
}

function EditUserDialog({ open, user, actor, onClose }) {
  const [role, setRole] = useState("user");
  const [banned, setBanned] = useState(false);
  useEffect(()=>{ if (user){ setRole(user.role); setBanned(!!user.banned); } }, [user]);
  if (!user) return null;
  const protectedTarget = user.is_master_owner;
  const submit = async () => {
    try {
      await api.patch(`/admin/users/${user.id}`, { role, banned });
      toast.success("User updated"); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Dialog open={open} onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="bg-[#0F0F14] border-white/10 text-white">
        <DialogHeader><DialogTitle>Edit {user.email}</DialogTitle></DialogHeader>
        {protectedTarget ? (
          <div className="text-amber-300 text-sm flex items-center gap-2"><Lock className="w-4 h-4" /> Master owner is permanently protected and cannot be modified.</div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-slate-300">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white mt-1" data-testid="edit-role-select"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
                  {ROLES.map(r => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Banned</Label>
              <Switch checked={banned} onCheckedChange={setBanned} data-testid="edit-ban-switch" />
            </div>
          </div>
        )}
        {!protectedTarget && (
          <DialogFooter>
            <Button onClick={submit} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="edit-submit">Save</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WalletDialog({ open, user, onClose }) {
  const [w, setW] = useState({deposit:"", winning:"", bonus:""});
  const [reason, setReason] = useState("");
  useEffect(()=>{ if (user) setW({deposit: user.wallet.deposit, winning: user.wallet.winning, bonus: user.wallet.bonus}); setReason(""); }, [user]);
  if (!user) return null;
  const submit = async () => {
    try {
      await api.post(`/admin/users/${user.id}/wallet`, { deposit: Number(w.deposit), winning: Number(w.winning), bonus: Number(w.bonus), reason });
      toast.success("Wallet updated"); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Dialog open={open} onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="bg-[#0F0F14] border-white/10 text-white">
        <DialogHeader><DialogTitle>Edit wallet · {user.email}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-3 gap-2">
          <Field label="Deposit" value={w.deposit} onChange={v=>setW({...w, deposit:v})} />
          <Field label="Winnings" value={w.winning} onChange={v=>setW({...w, winning:v})} />
          <Field label="Bonus" value={w.bonus} onChange={v=>setW({...w, bonus:v})} />
        </div>
        <div>
          <Label className="text-slate-300">Reason (required)</Label>
          <Input value={reason} onChange={e=>setReason(e.target.value)} className="bg-black/40 border-white/10 text-white mt-1" data-testid="wallet-reason" />
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={reason.length < 3} className="rounded-full bg-amber-500 text-black font-bold" data-testid="wallet-submit">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({label, value, onChange}){
  return (
    <div>
      <Label className="text-slate-300 text-xs">{label}</Label>
      <Input type="number" value={value} onChange={e=>onChange(e.target.value)} className="bg-black/40 border-white/10 text-white mt-1" />
    </div>
  );
}

function ResetPwDialog({ open, user, onClose }) {
  const [pw, setPw] = useState("");
  useEffect(()=>{ setPw(""); }, [user]);
  if (!user) return null;
  const submit = async () => {
    try {
      await api.post(`/admin/users/${user.id}/reset-password`, { new_password: pw });
      toast.success("Password reset"); onClose();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Dialog open={open} onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="bg-[#0F0F14] border-white/10 text-white">
        <DialogHeader><DialogTitle>Reset password · {user.email}</DialogTitle></DialogHeader>
        <Input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="new password" className="bg-black/40 border-white/10 text-white" data-testid="pw-input" />
        <DialogFooter><Button disabled={pw.length < 6} onClick={submit} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="pw-submit">Reset</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DepositsTab(){
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("pending");
  const load = async () => { try { const r = await api.get(`/admin/deposits?status=${status}`); setRows(r.data.deposits); } catch {} };
  useEffect(()=>{ load(); /* eslint-disable-line */ }, [status]);
  const act = async (id, action) => {
    try { await api.post(`/admin/deposits/${id}/${action}`); toast.success(`Deposit ${action}d`); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader className="flex flex-row items-center"><CardTitle>Deposits</CardTitle>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="ml-auto bg-black/40 border-white/10 text-white w-40" data-testid="deposit-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
            {["pending","approved","rejected"].map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="border-white/10"><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>UPI</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(d => (
              <TableRow key={d.id} className="border-white/10" data-testid={`deposit-row-${d.id}`}>
                <TableCell className="text-slate-300">{d.user_email}</TableCell>
                <TableCell className="font-bold text-emerald-400">{fmtINR(d.amount)}</TableCell>
                <TableCell>{d.method}</TableCell>
                <TableCell className="text-xs text-slate-400">{d.upi_id || "—"}</TableCell>
                <TableCell className="text-xs text-slate-400">{new Date(d.created_at).toLocaleString("en-IN")}</TableCell>
                <TableCell className="space-x-1">
                  {d.status === "pending" && <>
                    <Button size="sm" onClick={()=>act(d.id, "approve")} className="rounded-full bg-emerald-500 text-black font-bold" data-testid={`approve-deposit-${d.id}`}>Approve</Button>
                    <Button size="sm" onClick={()=>act(d.id, "reject")} variant="outline" className="rounded-full border-red-500/30 text-red-300" data-testid={`reject-deposit-${d.id}`}>Reject</Button>
                  </>}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-6">No deposits.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function WithdrawalsTab(){
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("pending");
  const load = async () => { try { const r = await api.get(`/admin/withdrawals?status=${status}`); setRows(r.data.withdrawals); } catch {} };
  useEffect(()=>{ load(); /* eslint-disable-line */ }, [status]);
  const act = async (id, action) => {
    try { await api.post(`/admin/withdrawals/${id}/${action}`); toast.success(`Withdrawal ${action}d`); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader className="flex flex-row items-center"><CardTitle>Withdrawals</CardTitle>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="ml-auto bg-black/40 border-white/10 text-white w-40" data-testid="withdraw-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
            {["pending","approved","rejected"].map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="border-white/10"><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>UPI</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(d => (
              <TableRow key={d.id} className="border-white/10" data-testid={`withdraw-row-${d.id}`}>
                <TableCell className="text-slate-300">{d.user_email}</TableCell>
                <TableCell className="font-bold text-red-300">{fmtINR(d.amount)}</TableCell>
                <TableCell>{d.upi_id}</TableCell>
                <TableCell className="text-xs text-slate-400">{new Date(d.created_at).toLocaleString("en-IN")}</TableCell>
                <TableCell className="space-x-1">
                  {d.status === "pending" && <>
                    <Button size="sm" onClick={()=>act(d.id, "approve")} className="rounded-full bg-emerald-500 text-black font-bold" data-testid={`approve-w-${d.id}`}>Approve</Button>
                    <Button size="sm" onClick={()=>act(d.id, "reject")} variant="outline" className="rounded-full border-red-500/30 text-red-300" data-testid={`reject-w-${d.id}`}>Reject</Button>
                  </>}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-6">No withdrawals.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MatchesTab({ actor }){
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("disputed");
  const load = async () => { try { const r = await api.get(`/admin/matches${status && status !== "any" ? `?status=${status}` : ""}`); setRows(r.data.matches); } catch {} };
  useEffect(()=>{ load(); /* eslint-disable-line */ }, [status]);
  const canDecide = ["admin","super_admin"].includes(actor.role);
  const decide = async (m, winner_id, cancel) => {
    try { await api.post(`/admin/matches/${m.id}/decide`, { winner_id, cancel }); toast.success("Match resolved"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader className="flex flex-row items-center"><CardTitle>Matches</CardTitle>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="ml-auto bg-black/40 border-white/10 text-white w-44" data-testid="match-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
            {["", "waiting","in_progress","awaiting_review","disputed","ended","cancelled"].map(s=> <SelectItem key={s||"any"} value={s||"any"}>{s || "any"}</SelectItem>)}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="border-white/10"><TableHead>Table</TableHead><TableHead>Stake</TableHead><TableHead>Players</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(m => (
              <TableRow key={m.id} className="border-white/10" data-testid={`match-row-${m.id}`}>
                <TableCell>{m.label}</TableCell>
                <TableCell className="font-bold">{fmtINR(m.stake)}</TableCell>
                <TableCell className="text-slate-300 text-xs">{(m.players || []).map(p=>p.name).join(" vs ")}</TableCell>
                <TableCell><Badge variant="outline" className="border-purple-500/30 text-purple-300">{m.status}</Badge></TableCell>
                <TableCell className="text-xs text-slate-400">{new Date(m.created_at).toLocaleString("en-IN")}</TableCell>
                <TableCell className="space-x-1">
                  {canDecide && !["ended","cancelled"].includes(m.status) && (m.players || []).map(p => (
                    <Button key={p.id} size="sm" onClick={()=>decide(m, p.id, false)} variant="outline" className="rounded-full border-emerald-500/30 text-emerald-300" data-testid={`decide-${m.id}-${p.id}`}>{p.name} won</Button>
                  ))}
                  {canDecide && !["ended","cancelled"].includes(m.status) && (
                    <Button size="sm" onClick={()=>decide(m, null, true)} variant="outline" className="rounded-full border-red-500/30 text-red-300" data-testid={`cancel-match-${m.id}`}>Cancel</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-6">No matches.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PromosTab(){
  const [rows, setRows] = useState([]);
  const [code, setCode] = useState("WELCOME50");
  const [amount, setAmount] = useState(50);
  const [maxR, setMaxR] = useState(1000);
  const load = async () => { try { const r = await api.get("/admin/promos"); setRows(r.data.promos); } catch {} };
  useEffect(()=>{ load(); }, []);
  const create = async () => {
    try { await api.post("/admin/promos", { code, amount: Number(amount), max_redemptions: Number(maxR) }); toast.success("Promo created"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  const del = async (c) => { try { await api.delete(`/admin/promos/${c}`); toast.success("Deleted"); load(); } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); } };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader><CardTitle>Promo codes</CardTitle></CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-4 gap-2">
          <Input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} className="bg-black/40 border-white/10 text-white" placeholder="CODE" data-testid="promo-code-input" />
          <Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="bg-black/40 border-white/10 text-white" placeholder="Amount" data-testid="promo-amount-input" />
          <Input type="number" value={maxR} onChange={e=>setMaxR(e.target.value)} className="bg-black/40 border-white/10 text-white" placeholder="Max redemptions" data-testid="promo-max-input" />
          <Button onClick={create} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="promo-create-btn">Create</Button>
        </div>
        <div className="mt-5 divide-y divide-white/5">
          {rows.map(p => (
            <div key={p.code} className="py-3 flex items-center justify-between" data-testid={`promo-row-${p.code}`}>
              <div>
                <div className="font-semibold">{p.code} <Badge variant="outline" className="ml-2 border-emerald-500/30 text-emerald-300">{fmtINR(p.amount)}</Badge></div>
                <div className="text-xs text-slate-400">{(p.redeemed_by||[]).length}/{p.max_redemptions} redeemed</div>
              </div>
              <Button onClick={()=>del(p.code)} size="sm" variant="outline" className="rounded-full border-red-500/30 text-red-300" data-testid={`promo-delete-${p.code}`}>Delete</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BroadcastsTab(){
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [aud, setAud] = useState("all");
  const load = async () => { try { const r = await api.get("/admin/broadcasts"); setRows(r.data.broadcasts); } catch {} };
  useEffect(()=>{ load(); }, []);
  const send = async () => {
    try { await api.post("/admin/broadcasts", { title, message: msg, audience: aud }); toast.success("Broadcast sent"); setTitle(""); setMsg(""); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader><CardTitle>Broadcasts</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="bg-black/40 border-white/10 text-white" data-testid="bc-title" />
        <Textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Message" className="bg-black/40 border-white/10 text-white min-h-[80px]" data-testid="bc-msg" />
        <div className="flex items-center gap-2">
          <Select value={aud} onValueChange={setAud}>
            <SelectTrigger className="w-44 bg-black/40 border-white/10 text-white" data-testid="bc-aud"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="vip">vip</SelectItem>
              <SelectItem value="admins">admins</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={send} disabled={!title || !msg} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="bc-send">Send</Button>
        </div>
        <div className="mt-5 divide-y divide-white/5">
          {rows.map(b=>(
            <div key={b.id} className="py-3">
              <div className="font-semibold">{b.title} <Badge variant="outline" className="ml-2 border-purple-500/30 text-purple-300">{b.audience}</Badge></div>
              <div className="text-sm text-slate-300 mt-1">{b.message}</div>
              <div className="text-xs text-slate-500 mt-1">{new Date(b.created_at).toLocaleString("en-IN")}</div>
            </div>
          ))}
          {rows.length === 0 && <div className="text-slate-400 text-sm py-4">No broadcasts.</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function LogsTab(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ api.get("/admin/activity-logs").then(r=>setRows(r.data.logs)).catch(()=>{}); }, []);
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader><CardTitle>Activity & security logs</CardTitle></CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto divide-y divide-white/5" data-testid="logs-list">
        {rows.map(l=>(
          <div key={l.id} className="py-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{l.action}</span>
              <span className="text-xs text-slate-400">{new Date(l.created_at).toLocaleString("en-IN")}</span>
            </div>
            <div className="text-xs text-slate-400">{l.actor_email} ({l.actor_role}) → target: {l.target || "—"}</div>
            {l.meta && Object.keys(l.meta).length > 0 && <div className="text-xs text-slate-500 mt-0.5 font-mono">{JSON.stringify(l.meta)}</div>}
          </div>
        ))}
        {rows.length === 0 && <div className="text-slate-400 text-sm py-4">No activity yet.</div>}
      </CardContent>
    </Card>
  );
}

function SettingsTab(){
  const [maint, setMaint] = useState({enabled:false, message:""});
  useEffect(()=>{ api.get("/public/config").then(r=>setMaint(r.data.maintenance)).catch(()=>{}); }, []);
  const save = async () => {
    try { await api.post("/admin/maintenance", maint); toast.success("Maintenance updated"); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader><CardTitle>Master settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between glass border-white/10 p-4 rounded-2xl">
          <div>
            <div className="font-semibold">Maintenance mode</div>
            <div className="text-xs text-slate-400">Disable site for non-admin users</div>
          </div>
          <Switch checked={maint.enabled} onCheckedChange={(v)=>setMaint({...maint, enabled:v})} data-testid="maintenance-switch" />
        </div>
        <div>
          <Label className="text-slate-300">Public message</Label>
          <Input value={maint.message} onChange={e=>setMaint({...maint, message:e.target.value})} className="bg-black/40 border-white/10 text-white mt-1" data-testid="maintenance-message" />
        </div>
        <Button onClick={save} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="maintenance-save">Save</Button>
      </CardContent>
    </Card>
  );
}


function TablesTab(){
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ stake: "", tier: "standard", label: "", active: true });
  const load = async () => { try { const r = await api.get("/admin/stake-tables"); setRows(r.data.tables); } catch {} };
  useEffect(()=>{ load(); }, []);
  const seedDefaults = async () => {
    try { await api.post("/admin/stake-tables/seed-defaults"); toast.success("Defaults seeded"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  const create = async () => {
    try {
      await api.post("/admin/stake-tables", { stake: Number(form.stake), tier: form.tier, label: form.label, active: form.active });
      toast.success("Table created");
      setForm({ stake: "", tier: "standard", label: "", active: true });
      load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  const update = async (t, patch) => {
    try {
      await api.patch(`/admin/stake-tables/${t.stake}`, { stake: t.stake, tier: patch.tier ?? t.tier, label: patch.label ?? t.label, active: patch.active ?? t.active });
      toast.success("Updated"); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  const del = async (stake) => {
    try { await api.delete(`/admin/stake-tables/${stake}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader className="flex flex-row items-center"><CardTitle>Match tables</CardTitle>
        <Button onClick={seedDefaults} className="ml-auto rounded-full bg-amber-500 text-black font-bold" data-testid="seed-defaults-btn">Seed 8 defaults</Button>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-5 gap-2 mb-4">
          <Input type="number" placeholder="Stake (₹)" value={form.stake} onChange={e=>setForm({...form, stake:e.target.value})} className="bg-black/40 border-white/10 text-white" data-testid="table-stake" />
          <Input placeholder="Label" value={form.label} onChange={e=>setForm({...form, label:e.target.value})} className="bg-black/40 border-white/10 text-white" data-testid="table-label" />
          <Select value={form.tier} onValueChange={v=>setForm({...form, tier:v})}>
            <SelectTrigger className="bg-black/40 border-white/10 text-white" data-testid="table-tier"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
              {["standard","premium","vip"].map(t=> <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 px-3 glass border-white/10 rounded-md">
            <Label className="text-slate-300 text-xs">Active</Label>
            <Switch checked={form.active} onCheckedChange={v=>setForm({...form, active:v})} />
          </div>
          <Button onClick={create} disabled={!form.stake || !form.label} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="table-create">Create</Button>
        </div>
        <Table>
          <TableHeader><TableRow className="border-white/10"><TableHead>Stake</TableHead><TableHead>Label</TableHead><TableHead>Tier</TableHead><TableHead>Active</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(t => (
              <TableRow key={t.stake} className="border-white/10" data-testid={`table-row-${t.stake}`}>
                <TableCell className="font-bold">{fmtINR(t.stake)}</TableCell>
                <TableCell>{t.label}</TableCell>
                <TableCell><Badge variant="outline" className={`border-white/10 ${t.tier === "vip" ? "text-amber-300" : "text-purple-300"}`}>{t.tier}</Badge></TableCell>
                <TableCell>
                  <Switch checked={!!t.active} onCheckedChange={v=>update(t, { active: v })} data-testid={`table-toggle-${t.stake}`} />
                </TableCell>
                <TableCell>
                  <Button onClick={()=>del(t.stake)} size="sm" variant="outline" className="rounded-full border-red-500/30 text-red-300" data-testid={`table-delete-${t.stake}`}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-6">No custom tables. Seed defaults or create one above.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StaffTab(){
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "support_agent" });
  const load = async () => {
    try {
      const r = await api.get("/admin/users?limit=500");
      setRows(r.data.users.filter(u => u.role !== "user"));
    } catch {}
  };
  useEffect(()=>{ load(); }, []);
  const create = async () => {
    try {
      await api.post("/admin/staff/create", form);
      toast.success("Staff account created");
      setForm({ email: "", password: "", name: "", role: "support_agent" });
      load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  const demote = async (u) => {
    try { await api.patch(`/admin/users/${u.id}`, { role: "user" }); toast.success("Access revoked"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail) || e.message); }
  };
  return (
    <Card className="glass-strong border-white/10 text-white mt-5">
      <CardHeader><CardTitle>Staff & roles</CardTitle></CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-5 gap-2 mb-4">
          <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="bg-black/40 border-white/10 text-white" data-testid="staff-name" />
          <Input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="bg-black/40 border-white/10 text-white" data-testid="staff-email" />
          <Input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="bg-black/40 border-white/10 text-white" data-testid="staff-password" />
          <Select value={form.role} onValueChange={v=>setForm({...form, role:v})}>
            <SelectTrigger className="bg-black/40 border-white/10 text-white" data-testid="staff-role"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#0F0F14] border-white/10 text-white">
              {["support_agent","staff_manager","admin"].map(r=> <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={create} disabled={!form.email || form.password.length < 6 || form.name.length < 2} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="staff-create">Create staff</Button>
        </div>
        <Table>
          <TableHeader><TableRow className="border-white/10"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(u => (
              <TableRow key={u.id} className="border-white/10" data-testid={`staff-row-${u.email}`}>
                <TableCell>{u.name} {u.is_master_owner && <Badge className="ml-1 bg-amber-500 text-black text-[10px]"><Lock className="w-3 h-3 mr-0.5" />MASTER</Badge>}</TableCell>
                <TableCell className="text-slate-400">{u.email}</TableCell>
                <TableCell><Badge variant="outline" className="border-amber-500/30 text-amber-300">{u.role}</Badge></TableCell>
                <TableCell>
                  {!u.is_master_owner && (
                    <Button onClick={()=>demote(u)} size="sm" variant="outline" className="rounded-full border-red-500/30 text-red-300" data-testid={`revoke-${u.email}`}>Revoke access</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-6">No staff yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

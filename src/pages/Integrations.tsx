import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Settings,
  Plug,
  ExternalLink,
  Activity,
  ShieldCheck,
  Plus,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

type Health = "healthy" | "degraded" | "disconnected";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  health: Health;
  connected: boolean;
  account?: string;
  scopes: string[];
  lastSync: string;
  latencyMs: number;
  uptime: number;
  events24h: number;
  webhook?: string;
}

const initial: Integration[] = [
  {
    id: "cvent",
    name: "Cvent",
    category: "Sourcing",
    description: "Pulls RFPs, attendee counts, and event briefs into the inbox.",
    icon: "C",
    health: "healthy",
    connected: true,
    account: "proposals-sales@cvent.com",
    scopes: ["rfps.read", "rfps.write", "events.read"],
    lastSync: "2 min ago",
    latencyMs: 184,
    uptime: 99.98,
    events24h: 142,
    webhook: "https://hooks.pamhotels.com/cvent",
  },
  {
    id: "direct-portal",
    name: "Direct Web Portal",
    category: "Sourcing",
    description: "Captures RFPs submitted directly through the corporate booking site.",
    icon: "D",
    health: "healthy",
    connected: true,
    account: "pamhotels.com/groups",
    scopes: ["leads.read", "leads.write"],
    lastSync: "4 min ago",
    latencyMs: 132,
    uptime: 99.95,
    events24h: 76,
  },
  {
    id: "opera",
    name: "Opera PMS",
    category: "Property",
    description: "Real-time inventory, BAR and group rates across managed properties.",
    icon: "O",
    health: "degraded",
    connected: true,
    account: "OPERA Cloud · 3 properties",
    scopes: ["inventory.read", "rates.read", "blocks.write"],
    lastSync: "live",
    latencyMs: 612,
    uptime: 98.41,
    events24h: 2104,
  },
];

const available: Integration[] = [
  {
    id: "marketo",
    name: "Marketo",
    category: "Marketing",
    description: "Sync attendee lists and post-event lead nurture campaigns.",
    icon: "M",
    health: "disconnected",
    connected: false,
    scopes: [],
    lastSync: "—",
    latencyMs: 0,
    uptime: 0,
    events24h: 0,
  },
  {
    id: "docusign",
    name: "DocuSign",
    category: "Contracts",
    description: "Send proposals for signature and track contract status.",
    icon: "D",
    health: "disconnected",
    connected: false,
    scopes: [],
    lastSync: "—",
    latencyMs: 0,
    uptime: 0,
    events24h: 0,
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Collect deposits and final balances on confirmed bookings.",
    icon: "$",
    health: "disconnected",
    connected: false,
    scopes: [],
    lastSync: "—",
    latencyMs: 0,
    uptime: 0,
    events24h: 0,
  },
];

const healthMeta: Record<Health, { label: string; cls: string; dot: string; Icon: any }> = {
  healthy: { label: "Healthy", cls: "text-success bg-success-soft border-success/20", dot: "bg-success", Icon: CheckCircle2 },
  degraded: { label: "Degraded", cls: "text-warning bg-warning-soft border-warning/30", dot: "bg-warning", Icon: AlertTriangle },
  disconnected: { label: "Disconnected", cls: "text-muted-foreground bg-muted border-border", dot: "bg-muted-foreground", Icon: XCircle },
};

export default function Integrations() {
  const [items, setItems] = useState<Integration[]>(initial);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const sel = items.find((i) => i.id === drawerId) ?? null;

  const handleSync = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, lastSync: "just now", health: "healthy", latencyMs: Math.max(120, Math.round(i.latencyMs * 0.7)) } : i)));
    toast({ title: "Sync triggered", description: `${items.find((i) => i.id === id)?.name} is re-syncing.` });
  };

  const handleDisconnect = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false, health: "disconnected", lastSync: "—", account: undefined, scopes: [] } : i)));
    toast({ title: "Disconnected", description: "Credentials revoked and webhooks paused." });
  };

  const handleReconnect = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, connected: true, health: "healthy", lastSync: "just now" } : i)));
    toast({ title: "Reconnected", description: "Connection re-authorized." });
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* Hero */}
        <section className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Settings</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">Integrations</h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Manage the systems PAM Hotels connects to. Monitor health, rotate credentials, and pause syncs.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Add integration
          </button>
        </section>

        {/* Body */}
        <div className="space-y-6">
          <section className="card-surface overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border">
              <h2 className="font-serif text-2xl">Connected systems</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Per-connection health and KPIs</p>
            </div>
            <ul>
              {items.map((i) => {
                const meta = healthMeta[i.health];
                return (
                  <li
                    key={i.id}
                    className="px-5 sm:px-6 py-5 border-b border-border last:border-0"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-md bg-primary/5 border border-border grid place-items-center font-serif text-primary shrink-0">
                          {i.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-medium truncate">{i.name}</div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i.category}</span>
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${meta.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} ${i.health === "healthy" ? "animate-pulse" : ""}`} />
                              {meta.label}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">{i.account ?? i.description}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 lg:px-2">
                        <KPI label="Last sync" value={i.lastSync} Icon={Clock} />
                        <KPI label="Uptime" value={`${i.uptime.toFixed(2)}%`} tone={i.uptime > 99 ? "success" : "warning"} />
                        <KPI label="Latency" value={`${i.latencyMs}ms`} tone={i.latencyMs < 300 ? "success" : "warning"} />
                        <KPI label="Events 24h" value={i.events24h.toLocaleString()} Icon={Activity} />
                      </div>

                      <div className="flex items-center gap-2 lg:shrink-0">
                        <button
                          onClick={() => handleSync(i.id)}
                          className="h-9 px-3 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Sync now
                        </button>
                        <button
                          onClick={() => setDrawerId(i.id)}
                          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 inline-flex items-center gap-1.5"
                        >
                          Manage <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card-surface overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl">Available</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Add more systems to your workspace</p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {available.map((i) => (
                  <li key={i.id} className="flex items-center gap-4 px-5 sm:px-6 py-4">
                    <div className="w-10 h-10 rounded-md bg-muted border border-border grid place-items-center font-serif text-muted-foreground shrink-0">
                      {i.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{i.name}</div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i.category}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{i.description}</div>
                    </div>
                    <button
                      onClick={() => toast({ title: `Connect ${i.name}`, description: "OAuth flow would start here." })}
                      className="h-9 px-3 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted inline-flex items-center gap-1.5"
                    >
                      <Plug className="w-3.5 h-3.5" /> Connect
                    </button>
                  </li>
                ))}
              </ul>
            </section>
        </div>
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setDrawerId(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {sel && (
            <>
              <SheetHeader className="text-left">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md bg-primary/5 border border-border grid place-items-center font-serif text-primary text-lg">
                    {sel.icon}
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="font-serif text-2xl">{sel.name}</SheetTitle>
                    <SheetDescription className="text-xs">{sel.category} integration</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <p className="text-sm text-muted-foreground">{sel.description}</p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleReconnect(sel.id)}
                    className="h-9 px-3 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted inline-flex items-center gap-1.5"
                  >
                    <Plug className="w-3.5 h-3.5" /> Reconnect
                  </button>
                  <button className="h-9 px-3 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted inline-flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" /> Configure
                  </button>
                  <button
                    onClick={() => { handleDisconnect(sel.id); setDrawerId(null); }}
                    className="h-9 px-3 rounded-md border border-destructive/30 bg-card text-xs font-medium text-destructive hover:bg-destructive/5 inline-flex items-center gap-1.5 ml-auto"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Disconnect
                  </button>
                </div>

                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground pt-4">Connection</div>
                  <DetailRow label="Account" value={sel.account ?? "—"} />
                  {sel.webhook && (
                    <DetailRow
                      label="Webhook"
                      value={
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <code className="text-xs">{sel.webhook}</code>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </span>
                      }
                    />
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authorized scopes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sel.scopes.map((s) => (
                      <code key={s} className="text-[11px] px-2 py-1 rounded bg-muted text-foreground border border-border">
                        {s}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Recent activity</div>
                  <ol className="space-y-3">
                    {[
                      { what: "Inbound sync completed", when: "2 min ago", ok: true },
                      { what: "Webhook delivered (202)", when: "14 min ago", ok: true },
                      { what: sel.health === "degraded" ? "Slow response (612ms)" : "Token refreshed", when: "1 h ago", ok: sel.health !== "degraded" },
                      { what: "Scheduled health check", when: "3 h ago", ok: true },
                    ].map((a, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${a.ok ? "bg-success" : "bg-warning"}`} />
                        <div className="flex-1">
                          <div className="text-foreground">{a.what}</div>
                          <div className="text-xs text-muted-foreground">{a.when}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function KPI({ label, value, tone, Icon }: { label: string; value: string; tone?: "success" | "warning"; Icon?: any }) {
  const toneCls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </div>
      <div className={`text-sm font-medium mt-0.5 truncate ${toneCls}`}>{value}</div>
    </div>
  );
}

function DetailRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "success" | "warning" }) {
  const toneCls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium text-right ${toneCls}`}>{value}</span>
    </div>
  );
}
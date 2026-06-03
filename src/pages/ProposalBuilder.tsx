import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { SourceBadge, StatusPill } from "@/components/StatusPill";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  rfps,
  properties,
  buildAvailability,
  currency,
  fmtDate,
  fmtShortDate,
} from "@/data/mockData";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Building2,
  Sparkles,
  FileText,
  Send,
  AlertTriangle,
  Calendar,
  Users,
  DollarSign,
  Wand2,
  Download,
  RefreshCw,
  CheckCircle2,
  Mail,
  Presentation,
  MessageSquare,
  Loader2,
  History,
  Eye,
  GitCompare,
  Trophy,
  Award,
  Star,
} from "lucide-react";
import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Bookmark,
  Zap,
  Target,
  Layers,
  UtensilsCrossed,
  Mic2,
  Camera,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import nobuBallroom from "@/assets/nobu-venue-ballroom.jpg";
import nobuBeach from "@/assets/nobu-venue-beach.jpg";
import nobuTerrace from "@/assets/nobu-venue-terrace.jpg";
import nobuCulinary from "@/assets/nobu-culinary.jpg";
import miceGala from "@/assets/mice-gala.jpg";
import miceMeetings from "@/assets/mice-meetings.jpg";
import miceConferences from "@/assets/mice-conferences.jpg";
import miceIncentives from "@/assets/mice-incentives.jpg";
import miceExhibitions from "@/assets/mice-exhibitions.jpg";
import miceWorkshops from "@/assets/mice-workshops.jpg";

const steps = [
  { id: 1, label: "RFP intake", icon: Database },
  { id: 2, label: "Find properties", icon: Building2 },
  { id: 3, label: "Review proposal", icon: FileText },
  { id: 4, label: "Submit", icon: Send },
];

export default function ProposalBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rfp = rfps.find((r) => r.id === id) ?? rfps[0];
  const isRevision = rfp.status === "revision_requested";
  const [step, setStep] = useState(1);
  const [showPrevious, setShowPrevious] = useState(false);
  const [propertyId, setPropertyId] = useState("p1");
  const [scenario, setScenario] = useState<"primary" | "alt-dates" | "alt-property">("primary");
  const [submitted, setSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; role: "assistant" | "user"; text: string }[]>([
    {
      id: "intro",
      role: "assistant",
      text: "Hi Sloane — I'm your proposal co-pilot. Ask me anything about this RFP or the current step.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatExpanded, setChatExpanded] = useState(true);

  function sendChat(text?: string) {
    const value = (text ?? chatInput).trim();
    if (!value) return;
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, text: value };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: `Got it — I'll factor that into the ${steps[step - 1].label.toLowerCase()} step.`,
        },
      ]);
    }, 400);
  }

  const availability = useMemo(() => buildAvailability(rfp, propertyId), [rfp, propertyId]);
  const property = properties.find((p) => p.id === propertyId)!;
  const totalRoomRevenue = availability.reduce((s, n) => s + n.requested * n.groupRate, 0);
  const totalRevenue = totalRoomRevenue + rfp.fbBudget + 28500; // + AV/meeting space

  const canFulfill = availability.every((n) => n.available >= n.requested);

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left tracker */}
        <aside className="w-full lg:w-[260px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col h-full overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
              Step {step} of {steps.length} · {steps[step - 1].label}
            </div>
            <h2 className="font-serif text-base leading-tight">Proposal Workflow</h2>
          </div>

          <ol className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {steps.map((s) => {
              const done = s.id < step;
              const active = s.id === step;
              const Icon = s.icon;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setStep(s.id)}
                    className={`w-full flex gap-2.5 px-3 py-2 rounded-md text-left transition-colors ${
                      active ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-6 w-6 shrink-0 grid place-items-center rounded-full text-[11px] font-semibold ${
                        done
                          ? "bg-success text-white"
                          : active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : s.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`text-[13px] ${active ? "font-medium text-foreground" : "text-foreground/80"}`}>
                          {s.label}
                        </div>
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {stepHint(s.id)}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Center main content */}
        <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 py-4 lg:py-5">
            <div className="max-w-[1180px] mx-auto">
              {/* Header */}
            <button
              onClick={() => navigate("/inbox")}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Back to inbox
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-5 mb-4">
              <div className="flex gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-lg bg-primary/5 border border-border grid place-items-center font-serif text-xl text-primary">
                  {rfp.clientLogo}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-xs text-muted-foreground">{rfp.id}</span>
                    <SourceBadge source={rfp.source} />
                    <StatusPill status={rfp.status} />
                  </div>
                  <h1 className="font-serif text-xl sm:text-2xl lg:text-[28px] leading-tight">
                    {rfp.eventName}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {rfp.client} · {rfp.contact.name}, {rfp.contact.title}
                  </p>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Response due
                </div>
                <div className="font-serif text-xl">{fmtDate(rfp.responseDue)}</div>
                <div className="text-xs text-warning mt-0.5">In 6 days</div>
              </div>
            </div>

            {/* Revision requested banner */}
            {isRevision && rfp.revisionRequest && rfp.previousProposal && (
              <div className="mb-4">
                <RevisionBanner
                  rfp={rfp}
                  onViewPrevious={() => setShowPrevious(true)}
                />
              </div>
            )}

            <div className="space-y-4 min-w-0">
              {step === 1 && <IntakeStep rfp={rfp} />}
            {step === 2 && (
              <AvailabilityStep
                rfp={rfp}
                propertyId={propertyId}
                onChange={setPropertyId}
                availability={availability}
                canFulfill={canFulfill}
                property={property}
                totalRevenue={totalRevenue}
              />
            )}
            {step === 3 && (
              <ReviewStep
                rfp={rfp}
                property={property}
                availability={availability}
                totalRevenue={totalRevenue}
              />
            )}
            {step === 4 && (
              <SubmitStep rfp={rfp} submitted={submitted} onSubmit={() => {
                setSubmitted(true);
                toast({ title: "Proposal submitted", description: rfp.source === "Cvent" ? `Uploaded to Cvent ${rfp.cventId ?? "—"} and client notified.` : `Delivered to ${rfp.contact.name} via client portal.` });
              }} />
            )}
            </div>
            </div>
          </div>

          {/* Fixed footer nav */}
          {/* Always-on chat */}
          <ChatBar
            messages={chatMessages}
            input={chatInput}
            onInput={setChatInput}
            onSend={() => sendChat()}
            onQuickReply={(t) => sendChat(t)}
            expanded={chatExpanded}
            onToggle={() => setChatExpanded((v) => !v)}
            step={step}
          />

          {!submitted && (
            <div className="border-t border-border bg-card px-4 sm:px-5 lg:px-6 py-3">
              <div className="max-w-[1180px] mx-auto flex items-center justify-between">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="h-9 px-4 rounded-md border border-border bg-card text-sm font-medium disabled:opacity-40 hover:bg-muted inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {step < 4 ? (
                  <button
                    onClick={() => setStep(Math.min(4, step + 1))}
                    className="h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </main>
      </div>

      {isRevision && rfp.previousProposal && rfp.revisionRequest && (
        <PreviousProposalSheet
          open={showPrevious}
          onOpenChange={setShowPrevious}
          rfp={rfp}
        />
      )}
    </AppShell>
  );
}

function stepHint(id: number) {
  switch (id) {
    case 1:
      return "Review the incoming event brief.";
    case 2:
      return "Match properties & confirm availability.";
    case 3:
      return "Tune the proposal before sending.";
    case 4:
      return "Push to Cvent + Salesforce.";
    default:
      return "";
  }
}

function ChatBar({
  messages,
  input,
  onInput,
  onSend,
  onQuickReply,
  expanded,
  onToggle,
  step,
}: {
  messages: { id: string; role: "assistant" | "user"; text: string }[];
  input: string;
  onInput: (v: string) => void;
  onSend: () => void;
  onQuickReply: (v: string) => void;
  expanded: boolean;
  onToggle: () => void;
  step: number;
}) {
  const quickRepliesByStep: Record<number, string[]> = {
    1: [
      "Summarize this RFP brief",
      "Flag any missing details",
      "What are the key client priorities?",
    ],
    2: [
      "Which property best fits this brief?",
      "Are there date conflicts to flag?",
      "Suggest an alternate property",
    ],
    3: [
      "Tighten the welcome paragraph",
      "Add a thank-you note from the GM",
      "Swap closing dinner for a beach gala",
      "Make the tone more formal",
    ],
    4: [
      "Draft the client send-off email",
      "What should I double-check before submitting?",
      "Summarize what's being submitted",
    ],
  };
  const quickReplies = quickRepliesByStep[step] ?? quickRepliesByStep[1];
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (expanded) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, expanded]);
  return (
    <div className="border-t border-border bg-card">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-5 lg:px-6 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </div>
          <button
            onClick={onToggle}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
            aria-label={expanded ? "Collapse chat" : "Expand chat"}
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
        {expanded && (
          <>
            <div
              ref={scrollRef}
              className="max-h-28 overflow-y-auto space-y-2 mb-2 pr-1"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-1.5 rounded-md text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => onQuickReply(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 border border-border rounded-md bg-background px-3 py-1.5">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <input
                value={input}
                onChange={(e) => onInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder="Ask about this RFP…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={onSend}
                className="h-7 w-7 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step components ---------------- */

function IntakeStep({ rfp }: { rfp: typeof rfps[number] }) {
  const arr = new Date(rfp.arrival);
  const monthName = arr.toLocaleString("en-US", { month: "long" });

  // Derive abstract space needs (venue requirements) from total sqft
  const spaceNeeds: string[] = ["Ballroom"];
  if (rfp.meetingSpaceSqft >= 2500) spaceNeeds.push("3–4 breakout rooms");
  spaceNeeds.push("Outdoor reception space");
  if (rfp.fbBudget > 80000) spaceNeeds.push("Private dining room");

  // F&B / AV requirements
  const fbAvNeeds = [
    "Daily breakfast & breaks",
    "Plated welcome dinner",
    "Open bar reception",
    "Full AV + stage package",
    "Dual screens & wireless mics",
  ];

  // Media requirements
  const mediaNeeds = [
    "Event photography",
    "Highlight videography",
    "Keynote live stream",
  ];

  // Special requests
  const specialReqs = [
    "ADA compliance",
    "Dietary restrictions",
    "VIP accommodations",
    "Executive security",
  ];

  // Budget range bucket from estimated total
  const v = rfp.estValue;
  const round = (n: number) => Math.round(n / 50000) * 50000;
  const low = round(v * 0.9);
  const high = round(v * 1.1);
  const budgetRange = `${currency(low)} – ${currency(high)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl">Event brief</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Read-only summary synced from {rfp.source} RFP.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground shrink-0">
          {rfp.nights} nights · {rfp.totalRoomNights} room nights
        </span>
      </div>
      <div className="card-surface p-6">
        <dl className="divide-y divide-border">
          <ReadField label="Preferred timing" value={`${monthName} ${arr.getFullYear()}`} />
          <ReadField label="Total attendance" value="300 attendees" />
          <ReadField label="Total event budget" value={budgetRange} />
          <ReadField label="Space needs" value={spaceNeeds.join(", ")} />
          <ReadField label="Food & beverage / AV" value={fbAvNeeds.join(", ")} />
          <ReadField label="Media requirements" value={mediaNeeds.join(", ")} />
          <ReadField
            label="Special requests"
            value={specialReqs.join(", ")}
            note={rfp.specialRequests?.join(" · ")}
          />
        </dl>
      </div>
    </div>
  );
}

function ReadField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="grid grid-cols-12 gap-4 py-3.5">
      <dt className="col-span-12 sm:col-span-4 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="col-span-12 sm:col-span-8 text-sm text-foreground">
        {value}
        {note && (
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground/70">Planner note:</span> {note}
          </div>
        )}
      </dd>
    </div>
  );
}

function SyncedBanner({ rfp }: any) {
  return (
    <div className="rounded-lg border border-success/30 bg-success-soft/60 p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-success text-white grid place-items-center">
        <RefreshCw className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-success">Data synced 2 minutes ago</div>
        <div className="text-xs text-success/80">
          {rfp.source === "Cvent" ? `Cvent #${rfp.cventId ?? "—"} linked` : `Direct portal #${rfp.directPortalRef ?? "—"} linked`} · 12 fields parsed automatically
        </div>
      </div>
      <button className="text-xs font-medium text-success underline-offset-2 hover:underline">Re-sync</button>
    </div>
  );
}

function Field({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="flex gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-1" />
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-base font-medium text-foreground">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function BriefStat({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-md bg-muted/60 grid place-items-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-lg font-medium text-foreground leading-tight mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function BriefSection({ icon: Icon, title, items, note }: { icon: any; title: string; items: string[]; note?: string }) {
  return (
    <div className="mt-5 pt-5 border-t border-border">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div className="text-[11px] uppercase tracking-wider font-semibold text-foreground">{title}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground border border-border">
            {s}
          </span>
        ))}
      </div>
      {note && (
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Planner note:</span> {note}
        </div>
      )}
    </div>
  );
}

function AvailabilityStep({ rfp, propertyId, onChange, availability, canFulfill, property, totalRevenue }: any) {
  // ─── Top 3 matching engine (moved from intake) ────────────────────
  const ELITE_FIRMS = ["mckinsey", "bcg", "bain", "goldman", "blackstone", "kkr", "google", "apple", "meta"];
  const isElite = ELITE_FIRMS.some((f) => rfp.client.toLowerCase().includes(f));
  const clientTier: "Elite" | "Premium" | "Standard" = isElite
    ? "Elite"
    : rfp.estValue > 400000
      ? "Premium"
      : "Standard";
  const HISTORICAL: Record<string, string[]> = {
    default: ["Nobu"],
    mckinsey: ["Nobu", "UNICO"],
    bcg: ["Nobu"],
    bain: ["Nobu", "UNICO"],
    google: ["Ava", "Hard Rock"],
    apple: ["Nobu"],
  };
  const historyKey = Object.keys(HISTORICAL).find((k) => rfp.client.toLowerCase().includes(k)) ?? "default";
  const historicalBrands = HISTORICAL[historyKey];
  const PREMIUM_BRANDS = ["Nobu", "UNICO"];
  const arr = new Date(rfp.arrival);
  const quarter = `Q${Math.floor(arr.getMonth() / 3) + 1} ${arr.getFullYear()}`;

  const ranked = properties
    .map((p) => {
      const reasons: string[] = [];
      let score = 50;
      if (clientTier === "Elite") {
        if (PREMIUM_BRANDS.includes(p.brand)) { score += 25; reasons.push("Elite tier · premium brand only"); }
        else { score -= 30; }
      } else if (clientTier === "Premium" && PREMIUM_BRANDS.includes(p.brand)) {
        score += 12; reasons.push("Matches premium positioning");
      }
      if (historicalBrands.includes(p.brand)) {
        score += 20; reasons.push(`Previously booked by ${rfp.client.split(" ")[0]}`);
      }
      const capRatio = p.rooms / rfp.peakRooms;
      if (capRatio >= 1.2 && capRatio <= 2.5) { score += 15; reasons.push("Right-sized room block"); }
      else if (capRatio < 1) { score -= 20; reasons.push("Tight on capacity"); }
      if (p.meetingSqft >= rfp.meetingSpaceSqft * 1.1) { score += 10; reasons.push("Ample meeting space"); }
      score += 5;
      return { property: p, score: Math.min(99, score), reasons };
    })
    .filter((m) => clientTier !== "Elite" || PREMIUM_BRANDS.includes(m.property.brand))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // ─── AI-recommended date windows per property within the requested month ───
  // The original RFP is treated as a flexible month-long window. The AI surfaces
  // 2–3 best date options per property that fit the client's total budget.
  const monthName = arr.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const budgetCap = rfp.estValue;
  const propertyWindows: Record<string, { start: string; end: string; groupRate: number; peakAvail: number; note: string }[]> = {
    p1: [
      { start: "2026-09-10", end: "2026-09-13", groupRate: 689, peakAvail: 145, note: "Full buyout possible · Nobu omakase available" },
      { start: "2026-09-14", end: "2026-09-17", groupRate: 719, peakAvail: 132, note: "Originally requested window" },
      { start: "2026-09-21", end: "2026-09-24", groupRate: 629, peakAvail: 168, note: "Best Nobu availability in September" },
    ],
    p2: [
      { start: "2026-09-08", end: "2026-09-11", groupRate: 489, peakAvail: 310, note: "All-inclusive · beachfront block open" },
      { start: "2026-09-15", end: "2026-09-18", groupRate: 509, peakAvail: 285, note: "Mid-month shoulder, strong F&B" },
      { start: "2026-09-22", end: "2026-09-25", groupRate: 459, peakAvail: 332, note: "Shoulder week, easy hold" },
    ],
    p3: [
      { start: "2026-09-07", end: "2026-09-10", groupRate: 569, peakAvail: 290, note: "Adults-only · pre-festival pricing" },
      { start: "2026-09-14", end: "2026-09-17", groupRate: 549, peakAvail: 320, note: "Requested dates fit as-is" },
      { start: "2026-09-28", end: "2026-10-01", groupRate: 519, peakAvail: 360, note: "Swim-up suite upgrades included" },
    ],
    p4: [
      { start: "2026-09-12", end: "2026-09-15", groupRate: 419, peakAvail: 820, note: "Heaven adults wing available" },
      { start: "2026-09-19", end: "2026-09-22", groupRate: 399, peakAvail: 880, note: "Mid-month value window" },
      { start: "2026-09-26", end: "2026-09-29", groupRate: 389, peakAvail: 950, note: "Concert venue + ballroom combo" },
    ],
  };
  const estimateCost = (rate: number, nights: number) =>
    Math.round(rate * rfp.peakRooms * nights + rfp.fbBudget);

  // ─── Pre-populated filters from the brief ────────────────────────────
  const arrDate = new Date(rfp.arrival);
  const preferredTiming = `${arrDate.toLocaleString("en-US", { month: "long" })} ${arrDate.getFullYear()}`;
  const initialSpaceNeeds: string[] = ["Ballroom"];
  if (rfp.meetingSpaceSqft >= 2500) initialSpaceNeeds.push("Breakout rooms");
  initialSpaceNeeds.push("Outdoor reception");
  if (rfp.fbBudget > 80000) initialSpaceNeeds.push("Private dining");
  const allSpaceOptions = ["Ballroom", "Breakout rooms", "Outdoor reception", "Private dining", "Exhibit hall", "Boardroom"];
  const allFbOptions = ["Plated dinner", "Open bar reception", "Daily breakfast", "Coffee breaks", "Chef's table", "Vegan menu"];
  const allSpecialOptions = ["ADA accessibility", "VIP suites", "EV charging", "Branded keys", "Executive security", "Live stream"];
  const initialFb = ["Plated dinner", "Daily breakfast", "Coffee breaks"];
  const initialSpecial = (rfp.specialRequests ?? []).length ? ["ADA accessibility", "VIP suites"] : ["ADA accessibility"];

  const [attendees, setAttendees] = useState<number>(300);
  const [budget, setBudget] = useState<number>(Math.round(rfp.estValue / 1000) * 1000);
  const [timing, setTiming] = useState<string>(preferredTiming);
  const [sleepingRooms, setSleepingRooms] = useState<number>(rfp.peakRooms);
  const [meetingSqft, setMeetingSqft] = useState<number>(rfp.meetingSpaceSqft);
  const [spaceNeeds, setSpaceNeeds] = useState<string[]>(initialSpaceNeeds);
  const [fbNeeds, setFbNeeds] = useState<string[]>(initialFb);
  const [specialNeeds, setSpecialNeeds] = useState<string[]>(initialSpecial);
  const [searchState, setSearchState] = useState<"idle" | "loading" | "results">("idle");

  const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const handleSearch = () => {
    setSearchState("loading");
    setTimeout(() => setSearchState("results"), 1600);
  };

  const handleReset = () => {
    setAttendees(300);
    setBudget(Math.round(rfp.estValue / 1000) * 1000);
    setTiming(preferredTiming);
    setSleepingRooms(rfp.peakRooms);
    setMeetingSqft(rfp.meetingSpaceSqft);
    setSpaceNeeds(initialSpaceNeeds);
    setFbNeeds(initialFb);
    setSpecialNeeds(initialSpecial);
  };

  return (
    <div className="grid grid-cols-12 gap-3 lg:gap-4">
      {/* Filters column */}
      <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
        <div className="card-surface p-5 lg:p-6 lg:sticky lg:top-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg">Requirements</h3>
            <button
              onClick={handleReset}
              className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            Pre-populated from the brief. Adjust before searching.
          </p>

          <div className="space-y-5">
            <FilterField label="Total attendance">
              <input
                type="number"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </FilterField>

            <FilterField label="Total budget (USD)">
              <input
                type="number"
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
              <div className="text-[11px] text-muted-foreground mt-1.5">{currency(budget)}</div>
            </FilterField>

            <FilterField label="Preferred timing">
              <input
                type="text"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </FilterField>

            <FilterChips
              label="Space needs"
              options={allSpaceOptions}
              selected={spaceNeeds}
              onToggle={(v) => setSpaceNeeds((s) => toggleIn(s, v))}
            />

            <FilterChips
              label="F&B / AV"
              options={allFbOptions}
              selected={fbNeeds}
              onToggle={(v) => setFbNeeds((s) => toggleIn(s, v))}
            />

            <FilterChips
              label="Special requests"
              options={allSpecialOptions}
              selected={specialNeeds}
              onToggle={(v) => setSpecialNeeds((s) => toggleIn(s, v))}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={searchState === "loading"}
            className="w-full mt-7 h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {searchState === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Searching…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Find properties
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Results column */}
      <div className="col-span-12 lg:col-span-8 xl:col-span-9 min-w-0 space-y-4">
        {searchState === "idle" && (
          <div className="card-surface p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted grid place-items-center mb-3">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg mb-1">Ready when you are</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Review the requirements on the left — pre-populated from the brief — and click{" "}
              <span className="font-medium text-foreground">Find properties</span> to surface
              AI-matched availability across the portfolio.
            </p>
          </div>
        )}

        {searchState === "loading" && (
          <div className="card-surface p-16 text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-primary/10 grid place-items-center">
                <Sparkles className="w-7 h-7 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="font-serif text-xl mb-1">Searching with AI…</h3>
            <p className="text-sm text-muted-foreground">
              Matching {sleepingRooms} peak rooms · {currency(budget)} · {timing} across the portfolio.
            </p>
            <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cross-referencing client history & availability
            </div>
          </div>
        )}

        {searchState === "results" && (
          <>
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-serif text-2xl flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold" /> Top 3 property matches
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ranked by client tier, booking history, and flexibility. Dates are flexible within {quarter}.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${
                    clientTier === "Elite" ? "bg-gold-soft text-gold" :
                    clientTier === "Premium" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {clientTier === "Elite" && <Award className="w-3 h-3 inline mr-1" />}
                    {clientTier} client
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ranked.map((m, i) => (
                  <div
                    key={m.property.id}
                    className="relative rounded-lg border border-border bg-card p-4 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                        #{i + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        {m.score}
                      </span>
                    </div>
                    <div className="font-serif text-lg leading-tight">{m.property.name}</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {m.property.brand} · {m.property.rooms} rms · {(m.property.meetingSqft / 1000).toFixed(0)}k sqft
                    </div>
                    <ul className="space-y-1.5 flex-1">
                      {m.reasons.slice(0, 3).map((r) => (
                        <li key={r} className="flex items-start gap-1.5 text-xs text-foreground/80">
                          <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <PropertyAvailabilityList
              propertyId={propertyId}
              onChange={onChange}
              rfp={rfp}
              monthName={monthName}
              budgetCap={budgetCap}
              propertyWindows={propertyWindows}
              estimateCost={estimateCost}
            />

            {SHOW_SCENARIO_PLANNER && (
              <ScenarioPlanner
                rfp={rfp}
                property={property}
                availability={availability}
                baselineRevenue={totalRevenue}
                variant="page"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterChips({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                on
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/80 border-border hover:bg-muted"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PropertyAvailabilityList({
  propertyId,
  onChange,
  rfp,
  monthName,
  budgetCap,
  propertyWindows,
  estimateCost,
}: any) {
  const [activeTab, setActiveTab] = useState<string>(propertyId ?? properties[0].id);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const keyFor = (pid: string, start: string, end: string) => `${pid}|${start}|${end}`;
  const activeProperty = properties.find((p) => p.id === activeTab) ?? properties[0];
  const activeWindows = (propertyWindows[activeProperty.id] ?? []) as any[];
  const pricedWindows = activeWindows.map((w) => {
    const nights = Math.max(
      1,
      Math.round((+new Date(w.end) - +new Date(w.start)) / 86400000),
    );
    const cost = estimateCost(w.groupRate, nights);
    return { ...w, nights, cost, withinBudget: cost <= budgetCap };
  });
  const bestActive = pricedWindows.reduce(
    (acc, w) => (w.withinBudget && (!acc || w.cost < acc.cost) ? w : acc),
    null as any,
  );
  // Highlight all suggested window dates on the calendar
  const suggestedDates: Date[] = pricedWindows.flatMap((w: any) => {
    const out: Date[] = [];
    const s = new Date(w.start);
    const e = new Date(w.end);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) out.push(new Date(d));
    return out;
  });
  const defaultMonth = pricedWindows[0] ? new Date(pricedWindows[0].start) : new Date(rfp.arrival);
  // Match selected range to a window (exact or overlap)
  const matchedWindow = selectedRange?.from
    ? pricedWindows.find((w: any) => {
        const s = +new Date(w.start);
        const e = +new Date(w.end);
        const fs = +selectedRange.from!;
        const fe = selectedRange.to ? +selectedRange.to : fs;
        return fs <= e && fe >= s;
      })
    : null;
  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-serif text-2xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" /> Date windows by property
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full bg-gold-soft text-gold">
            <Sparkles className="w-3 h-3" /> AI suggested
          </span>
          <div className="inline-flex rounded-md border border-border bg-card p-0.5">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 text-xs font-medium rounded ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1 text-xs font-medium rounded inline-flex items-center gap-1 ${view === "calendar" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Calendar className="w-3 h-3" /> Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
      {/* Hotel tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {properties.map((p) => {
          const isActive = p.id === activeTab;
          return (
            <button
              key={p.id}
              onClick={() => { setActiveTab(p.id); setSelectedRange(undefined); }}
              className={`px-5 py-3 -mb-px text-base border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-foreground font-semibold bg-muted/40"
                  : "border-transparent text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <span className="font-serif tracking-wide">{p.name.replace(/ (Hotel|Resort).*$/, "")}</span>
            </button>
          );
        })}
      </div>

      {/* Active hotel content */}
      <div className="mt-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-primary/5 border border-border grid place-items-center font-serif text-primary text-base shrink-0">
              {activeProperty.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <div className="font-serif text-lg leading-tight">{activeProperty.name}</div>
              <div className="text-xs text-muted-foreground">
                {activeProperty.brand} · {activeProperty.city} · {activeProperty.rooms} rms ·{" "}
                {(activeProperty.meetingSqft / 1000).toFixed(0)}k sqft
              </div>
            </div>
          </div>
          {bestActive && (
            <div className="hidden sm:flex flex-col items-end shrink-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Best within budget
              </div>
              <div className="text-sm font-semibold">
                {fmtShortDate(bestActive.start)} – {fmtShortDate(bestActive.end)} · {currency(bestActive.cost)}
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
          AI-recommended windows in {monthName}
        </div>
        {view === "list" ? (
        <div className="flex flex-col gap-2">
          {pricedWindows.map((w) => {
            const isBest = bestActive && w.start === bestActive.start;
            return (
              <div
                key={w.start}
                className="rounded-md border border-border bg-card p-4 flex flex-wrap items-center gap-3 md:gap-4 min-w-0"
              >
                <div className="flex items-center gap-2 min-w-[160px] flex-shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-semibold">
                    {fmtShortDate(w.start)} – {fmtShortDate(w.end)}
                  </span>
                  {isBest && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-gold text-white">
                      Best
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex-1 min-w-[160px]">{w.note}</div>
                <div className="flex items-center gap-4 text-xs flex-shrink-0">
                  <div>
                    <div className="text-muted-foreground">Group rate</div>
                    <div className="font-semibold text-sm">${w.groupRate}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Peak avail</div>
                    <div className="font-semibold text-sm">{w.peakAvail}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Est. total</div>
                    <div className="font-semibold text-sm">{currency(w.cost)}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium flex-shrink-0 ${
                    w.withinBudget ? "text-success" : "text-warning"
                  }`}
                >
                  {w.withinBudget ? (
                    <>
                      <Check className="w-3 h-3" /> Within budget
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" /> {currency(w.cost - budgetCap)} over
                    </>
                  )}
                </span>
                <button
                  onClick={() => {
                    onChange(activeProperty.id);
                    setAdded((s) => ({ ...s, [keyFor(activeProperty.id, w.start, w.end)]: true }));
                    toast({
                      title: "Added to proposal",
                      description: `${activeProperty.name} · ${fmtShortDate(w.start)}–${fmtShortDate(w.end)} added to your proposal.`,
                    });
                  }}
                  disabled={!!added[keyFor(activeProperty.id, w.start, w.end)]}
                  className={`h-8 px-3 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 shrink-0 ${
                    added[keyFor(activeProperty.id, w.start, w.end)]
                      ? "border-success/30 bg-success/10 text-success cursor-default"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {added[keyFor(activeProperty.id, w.start, w.end)] ? (
                    <>Added <Check className="w-3 h-3" /></>
                  ) : (
                    <>Add to proposal <ArrowRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-md border border-border bg-card p-3 flex justify-center">
              <CalendarPicker
                mode="range"
                selected={selectedRange as any}
                onSelect={(r: any) => setSelectedRange(r)}
                defaultMonth={defaultMonth}
                numberOfMonths={1}
                modifiers={{ suggested: suggestedDates }}
                modifiersClassNames={{ suggested: "bg-gold-soft text-gold font-semibold" }}
              />
            </div>
            <div className="flex flex-col gap-3">
              {matchedWindow ? (
                <div className="rounded-md border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      {fmtShortDate(matchedWindow.start)} – {fmtShortDate(matchedWindow.end)}
                    </span>
                    {bestActive && matchedWindow.start === bestActive.start && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-gold text-white">
                        Best
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{matchedWindow.note}</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Group rate</div>
                      <div className="font-semibold text-base">${matchedWindow.groupRate}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Peak avail</div>
                      <div className="font-semibold text-base">{matchedWindow.peakAvail}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Est. total</div>
                      <div className="font-semibold text-base">{currency(matchedWindow.cost)}</div>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] font-medium mb-4 ${
                      matchedWindow.withinBudget ? "text-success" : "text-warning"
                    }`}
                  >
                    {matchedWindow.withinBudget ? (
                      <><Check className="w-3 h-3" /> Within budget</>
                    ) : (
                      <><AlertTriangle className="w-3 h-3" /> {currency(matchedWindow.cost - budgetCap)} over</>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onChange(activeProperty.id);
                      setAdded((s) => ({ ...s, [keyFor(activeProperty.id, matchedWindow.start, matchedWindow.end)]: true }));
                      toast({
                        title: "Added to proposal",
                        description: `${activeProperty.name} · ${fmtShortDate(matchedWindow.start)}–${fmtShortDate(matchedWindow.end)} added to your proposal.`,
                      });
                    }}
                    disabled={!!added[keyFor(activeProperty.id, matchedWindow.start, matchedWindow.end)]}
                    className={`h-9 px-4 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 ${
                      added[keyFor(activeProperty.id, matchedWindow.start, matchedWindow.end)]
                        ? "border-success/30 bg-success/10 text-success cursor-default"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    {added[keyFor(activeProperty.id, matchedWindow.start, matchedWindow.end)] ? (
                      <>Added <Check className="w-3 h-3" /></>
                    ) : (
                      <>Add to proposal <ArrowRight className="w-3 h-3" /></>
                    )}
                  </button>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  Select a highlighted date range on the calendar to see group rate, availability, and estimated total.
                </div>
              )}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-sm bg-gold-soft border border-gold/30" />
                AI-suggested dates within {monthName}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function ScenariosStep({ scenario, onChange }: any) {
  const options = [
    {
      id: "primary" as const,
      title: "Primary proposal",
      tag: "Best fit",
      tone: "accent",
      desc: "Nobu Los Cabos, requested dates. Group rate $689, full meeting block.",
      bullets: ["220 peak rooms confirmed", "14,500 sqft meeting space held", "F&B budget $185K"],
      value: 412000,
    },
    {
      id: "alt-dates" as const,
      title: "Shift dates +1 week",
      tag: "Recommended",
      tone: "success",
      desc: "Sep 21–24 opens better F&B outlets and lowers group rate to $259.",
      bullets: ["Group rate $259 (−$30)", "All special requests fit", "+$18K client savings"],
      value: 394000,
    },
    {
      id: "alt-property" as const,
      title: "UNICO 20°87°",
      tag: "Upsell",
      tone: "gold",
      desc: "Adults-only all-inclusive sister brand — swim-up suites and a 24k sqft event lawn.",
      bullets: ["448 rooms · 24k sqft", "Suite upgrades for VIPs (12)", "All-inclusive rate $549 / night"],
      value: 468000,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-serif text-2xl">Scenario exploration</h3>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
            <Wand2 className="w-3.5 h-3.5" /> Generate more options
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Compare proposals side-by-side. Select one or send multiple to the client.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((o) => {
            const active = scenario === o.id;
            const toneCls =
              o.tone === "success" ? "bg-success-soft text-success" :
              o.tone === "gold" ? "bg-gold-soft text-gold" :
              "bg-info-soft text-info";
            return (
              <button
                key={o.id}
                onClick={() => onChange(o.id)}
                className={`text-left p-5 rounded-lg border-2 transition-all ${
                  active ? "border-primary bg-primary/[0.03]" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${toneCls}`}>
                    {o.tag}
                  </span>
                  {active && <Check className="w-4 h-4 text-primary" />}
                </div>
                <h4 className="font-serif text-xl mb-2">{o.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{o.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {o.bullets.map((b) => (
                    <li key={b} className="text-xs text-foreground flex gap-2">
                      <Check className="w-3 h-3 mt-0.5 text-accent shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
                <div className="hairline pt-3 flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Est. value</span>
                  <span className="font-serif text-2xl">{currency(o.value)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type DocFormat = "pdf" | "pptx";
interface Slide {
  id: string;
  kind: "cover" | "overview" | "rooms" | "investment" | "terms";
  title: string;
  bullets: string[];
}
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  slideId?: string;
}

function buildInitialSlides(rfp: any, property: any, availability: any[], totalRevenue: number): Slide[] {
  return [
    {
      id: "s1",
      kind: "cover",
      title: rfp.eventName,
      bullets: [
        `Prepared for ${rfp.client}`,
        `${property.name} · ${fmtShortDate(rfp.arrival)} – ${fmtShortDate(rfp.departure)}, 2026`,
      ],
    },
    {
      id: "s2",
      kind: "overview",
      title: "Event overview",
      bullets: [
        `${rfp.nights} nights · ${rfp.peakRooms} peak rooms · ${rfp.totalRoomNights} total room nights`,
        `${(rfp.meetingSpaceSqft / 1000).toFixed(1)}k sqft of meeting space confirmed across the stay`,
        `Primary contact: ${rfp.contact.name}, ${rfp.contact.title}`,
      ],
    },
    {
      id: "s3",
      kind: "rooms",
      title: "Room block & rates",
      bullets: availability.map(
        (n) => `${fmtShortDate(n.date)} — ${n.requested} rooms @ $${n.groupRate}/night`
      ),
    },
    {
      id: "s4",
      kind: "investment",
      title: "Investment summary",
      bullets: [
        `Room revenue ${currency(availability.reduce((s, n) => s + n.requested * n.groupRate, 0))}`,
        `F&B ${currency(rfp.fbBudget)}`,
        `Meeting space & AV ${currency(28500)}`,
        `Estimated total ${currency(totalRevenue)}`,
      ],
    },
    {
      id: "s5",
      kind: "terms",
      title: "Terms & next steps",
      bullets: [
        "Tentative hold valid through response due date",
        "Deposit: 25% at signing",
        "Cut-off date: 30 days prior to arrival",
        "Reply with go-ahead to convert hold to definite",
      ],
    },
  ];
}

function applyAiEdit(slide: Slide, prompt: string): { slide: Slide; summary: string } {
  const p = prompt.trim();
  const lower = p.toLowerCase();
  let next = { ...slide, bullets: [...slide.bullets] };
  let summary = "";

  if (/^(rewrite|replace|redo)/.test(lower)) {
    next.bullets = [p.replace(/^(rewrite|replace|redo)[:\s]*/i, "") || "Refined per your guidance."];
    summary = `Rewrote “${slide.title}” with your direction.`;
  } else if (lower.includes("shorter") || lower.includes("tighten") || lower.includes("concise")) {
    next.bullets = next.bullets.map((b) => (b.length > 60 ? b.slice(0, 57).trimEnd() + "…" : b));
    summary = `Tightened copy on “${slide.title}”.`;
  } else if (lower.startsWith("remove last") || lower.includes("drop last")) {
    next.bullets = next.bullets.slice(0, -1);
    summary = `Removed the last bullet from “${slide.title}”.`;
  } else if (lower.startsWith("add ") || lower.startsWith("include ") || lower.startsWith("mention ")) {
    const cleaned = p.replace(/^(add|include|mention)[:\s]*/i, "");
    next.bullets = [...next.bullets, cleaned];
    summary = `Added a new bullet to “${slide.title}”.`;
  } else if (lower.includes("formal") || lower.includes("executive")) {
    next.title = slide.title.replace(/^./, (c) => c.toUpperCase());
    next.bullets = next.bullets.map((b) => b.replace(/\bwe\b/gi, "Nobu").replace(/\byou\b/gi, "your team"));
    summary = `Lifted tone on “${slide.title}” to a more executive register.`;
  } else if (lower.includes("title")) {
    const m = p.match(/title[:\s]+(.+)/i);
    if (m) {
      next.title = m[1].trim();
      summary = `Updated the slide title to “${next.title}”.`;
    } else {
      summary = `I can update the title — try: “title: New headline”.`;
    }
  } else {
    next.bullets = [...next.bullets, p];
    summary = `Incorporated your note into “${slide.title}”.`;
  }
  return { slide: next, summary };
}

function ReviewStep({ rfp, property, availability, totalRevenue }: any) {
  return <UpMailProposalReview rfp={rfp} property={property} availability={availability} totalRevenue={totalRevenue} />;
}

// ---------------------------------------------------------------------------
// UpMail-style proposal preview (auto-generated, customizable for property)
// ---------------------------------------------------------------------------

const PROPERTY_TEMPLATES: Record<string, {
  tagline: string;
  heroGradient: string;
  signature: string;
  meetingRoom: { name: string; sqft: number; capacity: number; description: string };
  inclusions: string[];
  otherCosts: { label: string; qty: string; rate: number; total: number }[];
  wordmark: string;
  navLinks: string[];
  bigWord: string;
  heroImage: string;
  gridImages: { src: string; caption: string }[];
  ctaHeadline: string;
  ctaSub: string;
  experiences: { title: string; description: string }[];
}> = {
  p1: {
    tagline: "Sea, sand & sophistication on the Baja peninsula",
    heroGradient: "from-[hsl(220_25%_18%)] via-[hsl(220_22%_22%)] to-[hsl(35_38%_45%)]",
    wordmark: "NOBU",
    navLinks: ["Destinations", "Hotels & Restaurants", "Experiences", "Stories"],
    bigWord: "ASSEMBLE",
    heroImage: nobuBallroom,
    gridImages: [
      { src: nobuBallroom, caption: "Tour the Tsuki Ballroom" },
      { src: nobuBeach, caption: "Playa beach welcome reception" },
      { src: nobuTerrace, caption: "Umi terrace cocktail spaces" },
      { src: nobuCulinary, caption: "Nobu omakase private dining" },
    ],
    ctaHeadline: "Let's craft your moment at Nobu Los Cabos",
    ctaSub: "Quiet luxury, the Sea of Cortez, and a culinary team built around your group.",
    signature: "Sloane Whitfield · Director, Group Sales · Nobu Hotel Los Cabos",
    meetingRoom: {
      name: "Tsuki Ballroom",
      sqft: 6400,
      capacity: 320,
      description:
        "Our signature pillarless ballroom opens to the Sea of Cortez through a wall of folding glass doors. Ideal for plated dinners, general sessions and brand reveals with full natural light.",
    },
    inclusions: [
      "Day delegate package at $185 per person, per day",
      "Arrival nobu-style breakfast service & all-day artisan coffee",
      "Mid-morning matcha break · afternoon mochi & pastry service",
      "Plated lunch curated by the Nobu culinary team",
      "Standard AV package — 4K LED wall, 2x lavalier, 2x handheld",
      "Dedicated event concierge, 1:40 staff:guest ratio",
    ],
    otherCosts: [
      { label: "Mainstage AV upgrade (broadcast bundle)", qty: "1 × 3 days", rate: 4800, total: 14400 },
      { label: "Welcome reception — Playa beach setup", qty: "240 guests", rate: 145, total: 34800 },
      { label: "Branded room keys & arrival amenity", qty: "220 keys", rate: 18, total: 3960 },
      { label: "EV charging — valet managed", qty: "12 vehicles", rate: 65, total: 780 },
    ],
    experiences: [
      {
        title: "Playa beach welcome reception",
        description:
          "An hour before sunset your guests are led barefoot onto Playa Grande, where torch-lit lounges, low driftwood tables and a hand-shaken mezcal bar are set against the Sea of Cortez. Servers pass yellowtail tiradito, wagyu tacos and Nobu's signature crispy rice while a live percussion duo plays under string lights. The moment is unhurried, photographic and unmistakably Nobu.",
      },
      {
        title: "Nobu omakase private dining",
        description:
          "Up to 18 guests are hosted in our private Tatami room for a multi-course omakase led personally by the property's Executive Chef. Each course is plated tableside — black cod miso, toro tartare with caviar, A5 wagyu sumiyaki — and paired with rare sakes flown in from Japan. A bespoke menu is printed with your company crest, and guests leave with a signed Nobu chef's knife.",
      },
      {
        title: "Tsuki Ballroom general session",
        description:
          "Your mainstage opens with the glass wall fully retracted to the ocean for a 'breathwork & coffee' arrival, then closes for a fully blacked-out general session with a 4K LED wall and broadcast-grade audio. Set changes between sessions are handled in under nine minutes by our dedicated production team.",
      },
      {
        title: "Umi terrace closing dinner",
        description:
          "A long-table dinner for the full group on the cliffside Umi terrace. Plated four-course menu, sommelier-led wine pairings, and a closing toast as the property's signature taiko drum performance leads guests to a private after-party at the Nobu lounge.",
      },
    ],
  },
  p2: {
    tagline: "All-inclusive Caribbean energy, purpose-built for groups",
    heroGradient: "from-[hsl(195_55%_22%)] via-[hsl(195_45%_30%)] to-[hsl(35_38%_50%)]",
    wordmark: "AVA RESORTS",
    navLinks: ["Destinations", "Resorts", "Experiences", "Offers"],
    bigWord: "GATHER",
    heroImage: miceGala,
    gridImages: [
      { src: miceGala, caption: "Grand Sargasso Ballroom" },
      { src: miceMeetings, caption: "Lagoon-front breakout suites" },
      { src: miceIncentives, caption: "Cenote night gala upgrade" },
      { src: miceWorkshops, caption: "All-inclusive group dining" },
    ],
    ctaHeadline: "All in, all yours at Ava Cancun",
    ctaSub: "Twelve restaurants, four pools, one resort built for full-buyout groups.",
    signature: "Sloane Whitfield · Director, Group Sales · Ava Resort Cancun",
    meetingRoom: {
      name: "Grand Sargasso Ballroom",
      sqft: 9200,
      capacity: 720,
      description:
        "Cancun’s newest column-free ballroom features 22-ft ceilings, in-ceiling rigging and a private pre-function terrace overlooking the lagoon.",
    },
    inclusions: [
      "All-inclusive day delegate package at $159 per person, per day",
      "Unlimited resort F&B + premium beverage package",
      "Two themed group meals daily (beach, ballroom or restaurant takeover)",
      "Standard AV — projection, 4 wireless mics, in-room tech",
      "On-site event manager + dedicated banquet captain",
    ],
    otherCosts: [
      { label: "Lagoon welcome cocktail takeover", qty: "240 guests", rate: 95, total: 22800 },
      { label: "Themed gala upgrade (Cenote night)", qty: "240 guests", rate: 75, total: 18000 },
      { label: "Recording-grade AV upgrade", qty: "3 days", rate: 3200, total: 9600 },
    ],
    experiences: [
      {
        title: "Lagoon welcome cocktail takeover",
        description:
          "The resort's lagoon-front pool deck is transformed into a private arrival cocktail with a raw bar, ceviche stations and an open premium bar. Mariachi gives way to a live DJ as the sun drops behind the lagoon.",
      },
      {
        title: "Cenote night themed gala",
        description:
          "A fully themed gala dinner staged around a man-made cenote — candlelight, hanging florals, plated three-course menu and a live cumbia band. Branded backdrop and step-and-repeat included.",
      },
      {
        title: "Grand Sargasso general session",
        description:
          "Pillarless ballroom with 22-ft ceilings, in-ceiling rigging and a private pre-function terrace. Set in the round or theatre with broadcast-grade audio, and a dedicated banquet captain for the duration of your program.",
      },
    ],
  },
  p3: {
    tagline: "Adults-only luxury in the heart of the Riviera Maya",
    heroGradient: "from-[hsl(20_35%_22%)] via-[hsl(20_28%_30%)] to-[hsl(35_38%_50%)]",
    wordmark: "UNICO 20°87°",
    navLinks: ["Destinations", "Hotel", "Local Hosts", "Experiences"],
    bigWord: "ESCAPE",
    heroImage: miceIncentives,
    gridImages: [
      { src: miceIncentives, caption: "Esencia Salon for executive sessions" },
      { src: miceConferences, caption: "Cenote dinner experience" },
      { src: miceWorkshops, caption: "Local-host mezcal & textiles" },
      { src: miceGala, caption: "Adults-only buyout suites" },
    ],
    ctaHeadline: "Riviera Maya, told by locals",
    ctaSub: "An adults-only resort built around local hosts, culture and cuisine.",
    signature: "Sloane Whitfield · Director, Group Sales · UNICO 20°87° Riviera Maya",
    meetingRoom: {
      name: "Esencia Salon",
      sqft: 5800,
      capacity: 380,
      description:
        "Light-filled salon with a private cenote courtyard and indigenous artwork — built for intimate executive sessions and curated dinners.",
    },
    inclusions: [
      "Adults-only all-inclusive day delegate at $179 pp/day",
      "Local-host curated F&B with all premium spirits & wines",
      "Cultural welcome ceremony with mezcal tasting",
      "Standard AV + bilingual technician",
      "Dedicated local host per group of 25",
    ],
    otherCosts: [
      { label: "Cenote dinner experience", qty: "180 guests", rate: 215, total: 38700 },
      { label: "Local craft activation (mezcal & textiles)", qty: "180 guests", rate: 45, total: 8100 },
      { label: "Broadcast AV upgrade", qty: "3 days", rate: 3600, total: 10800 },
    ],
    experiences: [
      {
        title: "Private cenote dinner",
        description:
          "A short walk into the jungle opens onto a private cenote ringed with candles. A four-course tasting menu by UNICO's Local Hosts is plated lakeside, paired with mezcal flights and a Mayan blessing to open the evening.",
      },
      {
        title: "Local-host mezcal & textiles activation",
        description:
          "An interactive arrival reception where Yucatecan artisans guide guests through mezcal tasting, hand-loom weaving and clay shaping. Each guest leaves with a piece they made themselves.",
      },
      {
        title: "Esencia executive sessions",
        description:
          "Light-filled salon with a private cenote courtyard and indigenous artwork — ideal for board-style executive meetings, with a bilingual technician and curated coffee service throughout the day.",
      },
    ],
  },
  p4: {
    tagline: "Larger-than-life Caribbean stage for high-energy groups",
    heroGradient: "from-[hsl(0_45%_22%)] via-[hsl(0_35%_30%)] to-[hsl(35_45%_50%)]",
    wordmark: "HARD ROCK",
    navLinks: ["Destinations", "Hotels & Resorts", "Offers"],
    bigWord: "BREAKOUT",
    heroImage: miceConferences,
    gridImages: [
      { src: miceConferences, caption: "Legends Convention Center" },
      { src: miceExhibitions, caption: "Concert-grade rigging & stage" },
      { src: miceGala, caption: "Heaven adults-only gala" },
      { src: miceIncentives, caption: "Headliner entertainment buyout" },
    ],
    ctaHeadline: "Bring your group to the main stage",
    ctaSub: "45,000 sqft of contiguous space and a concert venue right next door.",
    signature: "Sloane Whitfield · Director, Group Sales · Hard Rock Hotel Riviera Maya",
    meetingRoom: {
      name: "Legends Convention Center",
      sqft: 21000,
      capacity: 1800,
      description:
        "45,000 sqft of contiguous, divisible space with concert-grade rigging, dressing rooms and direct backstage access for general sessions, expos and concerts.",
    },
    inclusions: [
      "Rock Royalty all-inclusive day delegate at $169 pp/day",
      "Unlimited resort F&B + premium beverage program",
      "Branded welcome amenity (Hard Rock guitar pick set)",
      "Standard AV + house production team",
      "Dedicated convention services manager",
    ],
    otherCosts: [
      { label: "Headliner entertainment buyout", qty: "1 night", rate: 65000, total: 65000 },
      { label: "Beachfront gala (Heaven section)", qty: "240 guests", rate: 165, total: 39600 },
      { label: "Concert-grade AV & rigging upgrade", qty: "3 days", rate: 5200, total: 15600 },
    ],
    experiences: [
      {
        title: "Headliner entertainment buyout",
        description:
          "A private concert in the resort's adjacent Hard Rock Live venue, with a curated headliner act selected from the brand's artist roster. Includes house production, dressing rooms and a backstage VIP lounge for your executives.",
      },
      {
        title: "Heaven beachfront gala",
        description:
          "Beachfront takeover in the adults-only Heaven section — three-course plated dinner, premium open bar, fire dancers and a DJ-led after-party on the sand.",
      },
      {
        title: "Legends Convention Center",
        description:
          "45,000 sqft of contiguous, divisible space with concert-grade rigging, dressing rooms and direct backstage access. Your general session can flex into a concert in under an hour.",
      },
    ],
  },
};

function DownloadMenu({ rfp, property }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const baseName = `Proposal_${rfp.id}_${property.brand.replace(/\s+/g, "")}`;
  const formats: { label: string; ext: string; icon: any }[] = [
    { label: "PDF document", ext: "pdf", icon: FileText },
    { label: "Word document", ext: "docx", icon: FileText },
    { label: "PowerPoint deck", ext: "pptx", icon: Presentation },
  ];

  function handleDownload(fmt: { label: string; ext: string }) {
    setOpen(false);
    toast({
      title: `${fmt.label} ready`,
      description: `${baseName}.${fmt.ext} has been generated.`,
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 inline-flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        Download
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-md border border-border bg-card shadow-lg z-20 overflow-hidden">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
            Choose format
          </div>
          {formats.map((f) => (
            <button
              key={f.ext}
              onClick={() => handleDownload(f)}
              className="w-full px-3 py-2.5 text-left text-xs hover:bg-muted/60 flex items-center gap-2.5"
            >
              <f.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{f.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{baseName}.{f.ext}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UpMailProposalReview({ rfp, property, availability }: any) {
  const template = PROPERTY_TEMPLATES[property.id] ?? PROPERTY_TEMPLATES.p1;

  const roomRevenue = availability.reduce((s: number, n: any) => s + n.requested * n.groupRate, 0);
  const otherTotal = template.otherCosts.reduce((s, c) => s + c.total, 0);
  const meetingFee = 28500;
  const grandTotal = roomRevenue + rfp.fbBudget + meetingFee + otherTotal;

  const intro = `Dear ${rfp.contact.name.split(" ")[0]},\n\nThank you for considering ${property.name} for ${rfp.eventName}. Based on your brief, we have put together a proposal that holds your peak nights, delivers ${template.meetingRoom.name} for your general session and brings in our culinary team for the requested plated dinner. Please find the full breakdown below.`;

  return (
    <div className="space-y-4">
      {/* Toolbar — non-interactive document, only Download */}
      <div className="card-surface px-4 sm:px-5 py-3 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Auto-generated proposal · PDF preview</div>
            <div className="font-medium text-sm truncate">Proposal_{rfp.id}_v1 · {property.name}</div>
          </div>
        </div>
        <div className="md:ml-auto flex flex-wrap items-center gap-2">
          <DownloadMenu rfp={rfp} property={property} />
        </div>
      </div>

      {/* Static PDF document — full width; refine via the bottom Chat */}
      <div className="card-surface p-0 overflow-hidden min-w-0">
        <ProposalDocument
          rfp={rfp}
          property={property}
          template={template}
          availability={availability}
          intro={intro}
          roomRevenue={roomRevenue}
          otherTotal={otherTotal}
          meetingFee={meetingFee}
          grandTotal={grandTotal}
        />
      </div>
    </div>
  );
}

function ProposalDocument({
  rfp,
  property,
  template,
  availability,
  intro,
  roomRevenue,
  otherTotal,
  meetingFee,
  grandTotal,
}: any) {
  const totalRoomNights = availability.reduce((s: number, n: any) => s + n.requested, 0);
  const avgRate = Math.round(
    availability.reduce((s: number, n: any) => s + n.groupRate, 0) / availability.length
  );

  const sectionClass = "px-6 sm:px-10 py-7 border-b border-border last:border-0";

  return (
    <div className="bg-card text-foreground select-text">
      {/* Brand nav bar */}
      <div className="bg-[hsl(0_0%_6%)] text-white px-6 sm:px-10 py-4 flex items-center gap-4">
        <div className="font-serif tracking-[0.2em] text-lg">{template.wordmark}</div>
      </div>

      {/* Hero banner — full-bleed image with big word */}
      <div className="relative overflow-hidden">
        <img
          src={template.heroImage}
          alt={`${property.name} hero`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${template.heroGradient} opacity-80`} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative px-6 sm:px-10 py-16 sm:py-24 text-white">
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 mb-4">
            Meetings & Events · {rfp.id}
          </div>
          <h1 className="font-serif tracking-[0.04em] text-5xl sm:text-7xl leading-[0.95] mb-4 font-light">
            {template.bigWord}
          </h1>
          <div className="text-white/85 text-sm sm:text-base max-w-xl italic font-serif">
            {template.tagline}
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm max-w-2xl">
            <HeroStat label="Dates" value={`${fmtShortDate(rfp.arrival)} – ${fmtShortDate(rfp.departure)}`} />
            <HeroStat label="Peak rooms" value={`${rfp.peakRooms}`} />
            <HeroStat label="Room nights" value={`${totalRoomNights}`} />
            <HeroStat label="Avg group rate" value={`$${avgRate}`} />
          </div>
        </div>
      </div>

      {/* Welcome */}
      <section className={sectionClass}>
        <SectionLabel>Welcome</SectionLabel>
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground">{intro}</p>

        {/* Image grid with captions — static */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {template.gridImages.map((g: any) => (
            <div key={g.caption} className="rounded-md overflow-hidden border border-border bg-muted/30">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={g.src}
                  alt={g.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-2.5 text-xs text-foreground border-t border-border">
                » {g.caption}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signature experiences */}
      <section className={sectionClass}>
        <SectionLabel>1 · Signature experiences</SectionLabel>
        <div className="space-y-5">
          {template.experiences.map((ex: any) => (
            <div key={ex.title} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-6">
              <div className="md:pt-1">
                <h4 className="font-serif text-lg leading-tight">» {ex.title}</h4>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{ex.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Space */}
      <section className={sectionClass}>
        <SectionLabel>2 · Event space</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 mb-4">
          <div className={`rounded-md aspect-[4/3] bg-gradient-to-br ${template.heroGradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-foreground/10" />
            <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider text-primary-foreground/90">
              {property.brand}
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-xl leading-tight">» {template.meetingRoom.name}</h4>
            <div className="text-xs text-muted-foreground mb-2">
              {template.meetingRoom.sqft.toLocaleString()} sqft · Seats up to {template.meetingRoom.capacity}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{template.meetingRoom.description}</p>
          </div>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <div className="px-4 py-2 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            Event schedule
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/20 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Date</th>
                <th className="text-left px-4 py-2 font-medium">Function</th>
                <th className="text-left px-4 py-2 font-medium">Room</th>
                <th className="text-left px-4 py-2 font-medium">Setup</th>
                <th className="text-right px-4 py-2 font-medium">Guests</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((n: any, i: number) => (
                <tr key={n.date} className="border-t border-border">
                  <td className="px-4 py-2.5">{fmtShortDate(n.date)}</td>
                  <td className="px-4 py-2.5">
                    {i === 0 ? "Welcome reception" : i === availability.length - 1 ? "Closing dinner" : "General session + breakouts"}
                  </td>
                  <td className="px-4 py-2.5">{template.meetingRoom.name}</td>
                  <td className="px-4 py-2.5">{i === 0 ? "Reception" : i === availability.length - 1 ? "Rounds of 10" : "Theatre"}</td>
                  <td className="px-4 py-2.5 text-right">{Math.round(n.requested * 1.1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inclusions */}
        <div className="mt-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Inclusions</div>
          <ul className="space-y-1.5">
            {template.inclusions.map((b: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-gold-soft text-gold grid place-items-center mt-1 shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span className="flex-1">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Guestrooms */}
      <section className={sectionClass}>
        <SectionLabel>3 · Guestrooms</SectionLabel>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Room type</th>
                {availability.map((n: any) => (
                  <th key={n.date} className="text-right px-4 py-2 font-medium">{fmtShortDate(n.date)}</th>
                ))}
                <th className="text-right px-4 py-2 font-medium bg-muted/50">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5">Run-of-house king</td>
                {availability.map((n: any) => (
                  <td key={n.date} className="px-4 py-2.5 text-right">{n.requested}</td>
                ))}
                <td className="px-4 py-2.5 text-right font-medium bg-muted/20">{availability.reduce((s: number, n: any) => s + n.requested, 0)}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 text-muted-foreground">Group rate (per room, per night)</td>
                {availability.map((n: any) => (
                  <td key={n.date} className="px-4 py-2.5 text-right">${n.groupRate}</td>
                ))}
                <td className="px-4 py-2.5 text-right text-muted-foreground bg-muted/20">avg ${avgRate}</td>
              </tr>
              <tr className="border-t border-border bg-muted/10">
                <td className="px-4 py-2.5 font-medium">Subtotal</td>
                {availability.map((n: any) => (
                  <td key={n.date} className="px-4 py-2.5 text-right">{currency(n.requested * n.groupRate)}</td>
                ))}
                <td className="px-4 py-2.5 text-right font-semibold bg-muted/30">{currency(roomRevenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 italic">
          Rates quoted in USD, exclusive of {property.brand === "Hard Rock" || property.brand === "Ava" || property.brand === "UNICO" ? "service charge" : "16% tax & 12% service charge"}. Rooms held under courtesy block until {fmtDate(rfp.responseDue)}.
        </p>
      </section>

      {/* Other Costs */}
      <section className={sectionClass}>
        <SectionLabel>4 · Other costs</SectionLabel>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Item</th>
                <th className="text-left px-4 py-2 font-medium">Quantity</th>
                <th className="text-right px-4 py-2 font-medium">Rate</th>
                <th className="text-right px-4 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5">Food & beverage — {rfp.eventName}</td>
                <td className="px-4 py-2.5">As briefed</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">—</td>
                <td className="px-4 py-2.5 text-right">{currency(rfp.fbBudget)}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5">Meeting space & standard AV</td>
                <td className="px-4 py-2.5">{rfp.nights} days</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">included</td>
                <td className="px-4 py-2.5 text-right">{currency(meetingFee)}</td>
              </tr>
              {template.otherCosts.map((c: any) => (
                <tr key={c.label} className="border-t border-border">
                  <td className="px-4 py-2.5">{c.label}</td>
                  <td className="px-4 py-2.5">{c.qty}</td>
                  <td className="px-4 py-2.5 text-right">${c.rate.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{currency(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary */}
      <section className={sectionClass}>
        <SectionLabel>5 · Summary</SectionLabel>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <SummaryRow label="Guestroom revenue" value={currency(roomRevenue)} />
              <SummaryRow label="Food & beverage" value={currency(rfp.fbBudget)} />
              <SummaryRow label="Meeting space & standard AV" value={currency(meetingFee)} />
              <SummaryRow label="Other costs & upgrades" value={currency(otherTotal)} />
              <tr className="border-t-2 border-foreground/20 bg-muted/40">
                <td className="px-4 py-3 font-semibold">Estimated total</td>
                <td className="px-4 py-3 text-right font-serif text-2xl">{currency(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-5 border-t border-border text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground mb-1">We look forward to welcoming {rfp.client} to {property.name}.</p>
          <p className="italic">{template.signature}</p>
          <p className="text-[11px] mt-3">{rfp.id} · {property.name} · Confidential — for {rfp.contact.name} only</p>
        </div>
      </section>

      {/* Closing CTA band */}
      <div className={`bg-gradient-to-br ${template.heroGradient} text-white px-6 sm:px-10 py-12 text-center`}>
        <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 mb-3">
          Next step
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl mb-2 leading-tight">{template.ctaHeadline}</h3>
        <p className="text-white/80 text-sm max-w-xl mx-auto">{template.ctaSub}</p>
      </div>

      {/* Footer brand bar */}
      <div className="bg-[hsl(0_0%_6%)] text-white/60 px-6 sm:px-10 py-5 flex items-center justify-between text-[11px]">
        <div className="font-serif tracking-[0.2em] text-white">{template.wordmark}</div>
        <div>© {new Date().getFullYear()} {property.brand} · All rights reserved</div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">{label}</div>
      <div className="text-base font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3 font-medium">
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-border first:border-t-0">
      <td className="px-4 py-2.5 text-foreground/80">{label}</td>
      <td className="px-4 py-2.5 text-right">{value}</td>
    </tr>
  );
}

function SlideCanvas({ slide, rfp, property, availability, totalRevenue, format }: any) {
  const isPptx = format === "pptx";
  const aspect = isPptx ? "aspect-[16/9]" : "aspect-[8.5/11]";
  const maxW = isPptx ? "max-w-3xl" : "max-w-xl";

  if (slide.kind === "cover") {
    return (
      <div className={`${maxW} mx-auto bg-card border border-border shadow-elevated overflow-hidden ${aspect}`}>
        <div className="bg-gradient-hero text-primary-foreground h-full p-6 sm:p-10 flex flex-col">
          <div className="font-serif italic text-2xl text-accent mb-auto">PAM Hotels</div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/60 mb-3">
              Event Proposal
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-2">{slide.title}</h2>
            {slide.bullets.map((b: string, i: number) => (
              <p key={i} className="text-primary-foreground/80 text-sm">{b}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${maxW} mx-auto bg-card border border-border shadow-elevated overflow-hidden ${aspect}`}>
      <div className="h-full p-6 sm:p-10 flex flex-col">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          {property.name} · {rfp.eventName}
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl leading-tight mb-5">{slide.title}</h3>

        {slide.kind === "rooms" ? (
          <table className="w-full text-sm">
            <tbody>
              {availability.map((n: any) => (
                <tr key={n.date} className="border-b border-border last:border-0">
                  <td className="py-2">{fmtShortDate(n.date)}</td>
                  <td className="py-2 text-right">{n.requested} rooms</td>
                  <td className="py-2 text-right font-semibold">${n.groupRate}/night</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : slide.kind === "investment" ? (
          <div className="bg-muted/40 rounded-md p-4 space-y-1.5 text-sm">
            <Row label="Room revenue" value={currency(availability.reduce((s: number, n: any) => s + n.requested * n.groupRate, 0))} />
            <Row label="F&B" value={currency(rfp.fbBudget)} />
            <Row label="Meeting space & AV" value={currency(28500)} />
            <div className="hairline mt-2 pt-2 flex justify-between font-semibold">
              <span>Estimated total</span>
              <span className="font-serif text-xl">{currency(totalRevenue)}</span>
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {slide.bullets.map((b: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-gold-soft text-gold grid place-items-center mt-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 text-[10px] text-muted-foreground italic">
          {rfp.id} · {property.name} · Confidential
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>
  );
}

function FormatPicker({ onPick, rfp }: { onPick: (f: DocFormat) => void; rfp: any }) {
  const options: { id: DocFormat; icon: any; title: string; sub: string; details: string[] }[] = [
    {
      id: "pdf",
      icon: FileText,
      title: "PDF document",
      sub: "Portrait, print-ready proposal",
      details: [
        "Best for emailing as a single attachment",
        "Locked layout — looks identical for every recipient",
        "Ideal when the client expects a formal written response",
      ],
    },
    {
      id: "pptx",
      icon: Presentation,
      title: "PowerPoint deck",
      sub: "16:9 slides for in-person or screen-share pitches",
      details: [
        "Best for walk-through meetings with the planner",
        "Editable by the sales team after download",
        "Ideal when the client wants to present internally",
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h3 className="font-serif text-2xl sm:text-3xl mb-1">Choose proposal format</h3>
        <p className="text-sm text-muted-foreground">
          Pick one format for {rfp.client}. You can switch later, but only one document will be sent.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className="card-surface text-left p-5 hover:border-primary hover:bg-primary/[0.02] hover:shadow-elevated transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-md bg-primary/5 border border-border grid place-items-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <o.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-xl">{o.title}</div>
                <div className="text-xs text-muted-foreground mb-3">{o.sub}</div>
                <ul className="space-y-1.5">
                  {o.details.map((d) => (
                    <li key={d} className="flex gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-gold mt-1 shrink-0" />
                      <span className="text-foreground/80">{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  Generate as {o.id.toUpperCase()} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SlideThumb({ slide, rfp, property, availability, totalRevenue, format }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(180);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  // SlideCanvas constrains content via max-w (xl=576 for pdf, 3xl=768 for pptx).
  // We size our scaling stage to that exact width so the thumbnail matches
  // what users see in the middle preview.
  const base = format === "pptx" ? 768 : 576;
  const ratio = format === "pptx" ? 9 / 16 : 11 / 8.5;
  const scale = w / base;
  const baseHeight = base * ratio;
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded border border-border bg-card"
      style={{ height: baseHeight * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{ width: base, transform: `scale(${scale})` }}
      >
        <SlideCanvas
          slide={slide}
          rfp={rfp}
          property={property}
          availability={availability}
          totalRevenue={totalRevenue}
          format={format}
        />
      </div>
    </div>
  );
}

function SubmitStep({ rfp, submitted, onSubmit }: any) {
  const actions = [
    rfp.source === "Cvent"
      ? { key: "cvent", label: "Upload proposal to Cvent", sub: `${rfp.cventId ?? "—"} · ${rfp.client} workspace`, icon: Send }
      : { key: "portal", label: "Deliver proposal via client portal", sub: `${rfp.directPortalRef ?? "—"} · ${rfp.client}`, icon: Send },
    { key: "email", label: "Send confirmation email", sub: `To: ${rfp.contact.email}`, icon: Mail },
    { key: "opera", label: "Hold room block in Opera PMS", sub: `Tentative · expires ${fmtDate(rfp.responseDue)}`, icon: Building2 },
  ];
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(actions.map((a) => [a.key, true]))
  );
  const toggle = (k: string) => setSelected((s) => ({ ...s, [k]: !s[k] }));
  const count = Object.values(selected).filter(Boolean).length;

  // Legal review state (lifted so it can gate the main submission)
  const [requiresLegal, setRequiresLegal] = useState(false);
  const [reviewerId, setReviewerId] = useState("");
  const [legalNotes, setLegalNotes] = useState("");
  const [legalSent, setLegalSent] = useState(false);
  const legalBlocksSubmit = requiresLegal && !legalSent;

  return (
    <div className="space-y-6">
      {!submitted ? (
        <>
          <LegalReviewSection
            rfp={rfp}
            requires={requiresLegal}
            setRequires={setRequiresLegal}
            reviewerId={reviewerId}
            setReviewerId={setReviewerId}
            notes={legalNotes}
            setNotes={setLegalNotes}
            sent={legalSent}
            setSent={setLegalSent}
          />

          <div>
            <h3 className="font-serif text-2xl">One-click submission</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select the actions to run on submit. All are enabled by default — uncheck any you want to skip.
            </p>
          </div>

          <div className="card-surface p-6 sm:p-8">
          <ul className="space-y-3 mb-8">
            {actions.map((a) => {
              const on = selected[a.key];
              return (
                <li key={a.key}>
                  <label
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      on ? "border-border bg-muted/20" : "border-border bg-card opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(a.key)}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                    />
                    <span className="w-8 h-8 rounded-md bg-card border border-border grid place-items-center text-muted-foreground">
                      <a.icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="text-xs text-muted-foreground">{a.sub}</div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>

          {legalBlocksSubmit && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-warning/40 bg-warning/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>
                This proposal is flagged for mandatory legal review. Send it to Legal above before
                submitting it to the client.
              </span>
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={count === 0 || legalBlocksSubmit}
            className="w-full h-12 rounded-md bg-gradient-hero text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-95 shadow-elevated disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" /> Submit proposal & run {count} {count === 1 ? "action" : "actions"}
          </button>
          </div>
        </>
      ) : (
        <div className="card-surface p-8 text-center py-10">
          <div className="w-16 h-16 rounded-full bg-success-soft mx-auto mb-5 grid place-items-center">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="font-serif text-3xl mb-2">Proposal submitted</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {rfp.source === "Cvent"
              ? `Uploaded to Cvent ${rfp.cventId ?? "—"} and ${rfp.contact.name} has been notified.`
              : `Delivered via the direct client portal and ${rfp.contact.name} has been notified.`}
          </p>
          <Link to="/inbox" className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium">
            Back to inbox <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------------- Legal Review ---------------- */

const LEGAL_REVIEWERS = [
  { id: "lr1", name: "Priya Raman", role: "Senior Counsel — Commercial" },
  { id: "lr2", name: "Marcus Bell", role: "Legal — Contracts & Pricing" },
  { id: "lr3", name: "Elena Fischer", role: "Associate GC — Hospitality" },
  { id: "lr4", name: "David Osei", role: "Legal Ops — Risk & Compliance" },
];

function LegalReviewSection({
  rfp,
  requires,
  setRequires,
  reviewerId,
  setReviewerId,
  notes,
  setNotes,
  sent,
  setSent,
}: any) {
  const reviewer = LEGAL_REVIEWERS.find((r) => r.id === reviewerId);

  function sendToLegal() {
    if (!reviewerId) return;
    setSent(true);
    toast({
      title: "Proposal has been submitted to the Legal Review queue.",
      description: reviewer
        ? `${rfp.client} · routed to ${reviewer.name} (${reviewer.role}).`
        : undefined,
    });
  }

  return (
    <div className="card-surface p-6 sm:p-8 space-y-5">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-md bg-card border border-border grid place-items-center text-muted-foreground shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl leading-tight">Legal review</h3>
            {requires ? (
              <span className="text-[10px] uppercase tracking-wider text-warning border border-warning/40 bg-warning/5 rounded-full px-2 py-0.5">
                Required
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                Optional
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Route to Legal if this proposal includes non-standard pricing terms, custom clauses,
            contract exceptions, or any other legal considerations requiring review.
          </p>
        </div>
      </div>

      {/* Requires Legal Review toggle */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border bg-muted/20">
        <div>
          <div className="text-sm font-medium">Requires Legal Review</div>
          <div className="text-xs text-muted-foreground">
            Flag this proposal for the Legal team before it goes to the client.
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={requires}
          aria-label="Requires Legal Review"
          onClick={() => setRequires((v) => !v)}
          disabled={sent}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            requires ? "bg-primary" : "bg-muted"
          } ${sent ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform ${
              requires ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {requires && !sent && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div>
            <label htmlFor="legal-reviewer" className="block text-sm font-medium mb-1.5">
              Legal reviewer
            </label>
            <select
              id="legal-reviewer"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              className="w-full h-11 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select a legal reviewer…</option>
              {LEGAL_REVIEWERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="legal-notes" className="block text-sm font-medium mb-1.5">
              Notes for Legal
            </label>
            <textarea
              id="legal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="What requires review, why legal review is needed, and any specific concerns or requested feedback…"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm resize-y placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            onClick={sendToLegal}
            disabled={!reviewerId}
            className="w-full h-12 rounded-md bg-gradient-hero text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-95 shadow-elevated disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" /> Send to Legal for Review
          </button>
        </div>
      )}

      {sent && (
        <div className="rounded-md border border-success/30 bg-success-soft p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">Sent to the Legal Review queue</div>
            <div className="text-muted-foreground text-xs mt-0.5">
              {reviewer ? `${reviewer.name} · ${reviewer.role}` : "The Legal team"} will review and
              follow up.{notes.trim() ? " Your notes were included." : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sidebar ---------------- */

function SummaryCard({ rfp, property, totalRevenue, canFulfill }: any) {
  return (
    <div className="card-surface p-5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Live summary</div>
      <div className="font-serif text-4xl mb-1">{currency(totalRevenue)}</div>
      <div className="text-xs text-muted-foreground mb-5">Projected total revenue</div>
      <dl className="space-y-2.5 text-sm">
        <SItem k="Property" v={property.name} />
        <SItem k="Dates" v={`${fmtShortDate(rfp.arrival)} — ${fmtShortDate(rfp.departure)}`} />
        <SItem k="Peak rooms" v={String(rfp.peakRooms)} />
        <SItem k="Meeting space" v={`${rfp.meetingSpaceSqft.toLocaleString()} sqft`} />
        <SItem k="Availability" v={canFulfill ? "All nights clear" : "1 tight night"} tone={canFulfill ? "success" : "warning"} />
      </dl>
    </div>
  );
}
function SItem({ k, v, tone }: any) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`font-medium text-right ${tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : ""}`}>{v}</dd>
    </div>
  );
}

function ContactCard({ rfp }: any) {
  return (
    <div className="card-surface p-5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Client contact</div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground grid place-items-center font-semibold">
          {rfp.contact.name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div className="text-sm">
          <div className="font-medium">{rfp.contact.name}</div>
          <div className="text-muted-foreground text-xs">{rfp.contact.title}</div>
        </div>
      </div>
      <a href={`mailto:${rfp.contact.email}`} className="mt-4 block text-xs text-primary hover:underline truncate">{rfp.contact.email}</a>
    </div>
  );
}

function ActivityCard() {
  const items = [
    { who: "System", what: "Pulled RFP from Cvent", when: "9:14 AM" },
    { who: "System", what: "Checked Opera PMS · all nights available", when: "9:14 AM" },
    { who: "System", what: "Drafted proposal v1", when: "9:15 AM" },
    { who: "Sloane", what: "Opened proposal", when: "9:32 AM" },
  ];
  return (
    <div className="card-surface p-5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Activity</div>
      <ol className="space-y-3">
        {items.map((i, idx) => (
          <li key={idx} className="flex gap-3 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
            <div className="flex-1">
              <div className="text-foreground"><span className="font-medium">{i.who}</span> {i.what}</div>
              <div className="text-xs text-muted-foreground">{i.when}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- Scenario Planner (Availability step) ---------------- */

const SHOW_SCENARIO_PLANNER = false;

interface ScenarioSnapshot {
  id: string;
  name: string;
  revenue: number;
  profit: number;
  roomNights: number;
  winProb: number;
}

function ScenarioPlanner({
  rfp,
  property,
  availability,
  baselineRevenue,
  variant = "sidebar",
}: any) {
  if (!SHOW_SCENARIO_PLANNER) return null;

  const [shiftDays, setShiftDays] = useState(0);
  const [roomsPct, setRoomsPct] = useState(0); // -30..+15
  const [stayDelta, setStayDelta] = useState(0); // -1..+2
  const [rateStrategy, setRateStrategy] = useState<"discount" | "hold" | "premium">("hold");
  const [addOns, setAddOns] = useState({ fb: false, av: false, welcome: false, suiteUpgrades: false });
  const [saved, setSaved] = useState<ScenarioSnapshot[]>([]);

  const baselineRoomRev = availability.reduce((s: number, n: any) => s + n.requested * n.groupRate, 0);
  const avgRate = baselineRoomRev / availability.reduce((s: number, n: any) => s + n.requested, 0);
  const baselineProfit = Math.round(baselineRevenue * 0.27);

  const rateMult = rateStrategy === "discount" ? 0.95 : rateStrategy === "premium" ? 1.08 : 1;
  const roomMult = 1 + roomsPct / 100;
  const shoulderShift = Math.abs(shiftDays) >= 3;

  const adjustedRoomNights = Math.round(rfp.totalRoomNights * roomMult + stayDelta * Math.round(rfp.peakRooms * 0.85));
  const adjustedRoomRev = Math.round(adjustedRoomNights * avgRate * rateMult);
  const addOnRev =
    (addOns.fb ? 28000 : 0) +
    (addOns.av ? 18500 : 0) +
    (addOns.welcome ? 12500 : 0) +
    (addOns.suiteUpgrades ? 9400 : 0);
  const scenarioRevenue = adjustedRoomRev + rfp.fbBudget + 28500 + addOnRev;

  // Profit margin shifts: discount cuts margin, premium grows it, add-ons high margin
  const baseMargin = 0.27 + (rateStrategy === "premium" ? 0.04 : rateStrategy === "discount" ? -0.03 : 0);
  const scenarioProfit = Math.round(scenarioRevenue * baseMargin + addOnRev * 0.15);

  const revDelta = scenarioRevenue - baselineRevenue;
  const profitDelta = scenarioProfit - baselineProfit;

  // Win probability heuristic
  let win = 62;
  if (rateStrategy === "discount") win += 8;
  if (rateStrategy === "premium") win -= 9;
  if (shoulderShift) win += 6;
  if (roomsPct <= -10) win += 4;
  if (Object.values(addOns).filter(Boolean).length >= 2) win += 4;
  if (stayDelta < 0) win += 3;
  win = Math.max(18, Math.min(94, win));

  // Displacement risk
  const displacement =
    roomsPct > 5 || (shiftDays === 0 && !shoulderShift && rateStrategy === "premium")
      ? { label: "High", tone: "text-warning bg-warning-soft border-warning/30" }
      : roomsPct <= -10 || shoulderShift
        ? { label: "Low", tone: "text-success bg-success-soft border-success/30" }
        : { label: "Medium", tone: "text-muted-foreground bg-muted border-border" };

  const dirty =
    shiftDays !== 0 ||
    roomsPct !== 0 ||
    stayDelta !== 0 ||
    rateStrategy !== "hold" ||
    Object.values(addOns).some(Boolean);

  function reset() {
    setShiftDays(0);
    setRoomsPct(0);
    setStayDelta(0);
    setRateStrategy("hold");
    setAddOns({ fb: false, av: false, welcome: false, suiteUpgrades: false });
  }

  const presets: { id: string; label: string; icon: any; apply: () => void }[] = [
    {
      id: "shoulder",
      label: "Shift to shoulder week",
      icon: Calendar,
      apply: () => { setShiftDays(7); setRateStrategy("hold"); },
    },
    {
      id: "compress",
      label: "Compress 1 night",
      icon: Layers,
      apply: () => { setStayDelta(-1); },
    },
    {
      id: "trim",
      label: "Trim 10% rooms",
      icon: TrendingDown,
      apply: () => { setRoomsPct(-10); },
    },
    {
      id: "upsell",
      label: "Premium upsell",
      icon: TrendingUp,
      apply: () => { setRateStrategy("premium"); setAddOns((a) => ({ ...a, fb: true, suiteUpgrades: true })); },
    },
  ];

  function save() {
    const snap: ScenarioSnapshot = {
      id: `s${Date.now()}`,
      name:
        rateStrategy === "discount"
          ? "Aggressive offer"
          : rateStrategy === "premium"
            ? "Premium positioning"
            : shoulderShift
              ? "Shoulder week"
              : roomsPct <= -10
                ? "Lean block"
                : `Scenario ${saved.length + 1}`,
      revenue: scenarioRevenue,
      profit: scenarioProfit,
      roomNights: adjustedRoomNights,
      winProb: win,
    };
    setSaved((s) => [snap, ...s].slice(0, 4));
    toast({ title: "Scenario saved", description: `${snap.name} · ${currency(snap.revenue)} projected.` });
  }

  if (variant === "page") {
    return (
      <div className="space-y-6">
        {/* Header (outside card) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gold font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Scenario planner
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl mt-0.5">
              {dirty ? "Live projection" : "Baseline projection"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Tweak dates, block size, rate strategy and add-ons. KPIs below update live against the baseline for {property.name}.
            </p>
          </div>
          {dirty && (
            <button
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" /> Reset to baseline
            </button>
          )}
        </div>

        {/* KPI bar */}
        <div className="card-surface p-5 sm:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Projected revenue" value={currency(scenarioRevenue)} delta={dirty ? revDelta : null} />
            <Kpi label="Projected profit" value={currency(scenarioProfit)} delta={dirty ? profitDelta : null} />
            <Kpi label="Room nights" value={adjustedRoomNights.toLocaleString()} />
            <Kpi label="Avg rate" value={`$${Math.round(avgRate * rateMult)}`} />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Win probability</span>
                <span className="font-semibold">{win}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    win >= 70 ? "bg-success" : win >= 50 ? "bg-gold" : "bg-warning"
                  }`}
                  style={{ width: `${win}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-3">
              <span className="text-xs text-muted-foreground">Displacement risk</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium ${displacement.tone}`}>
                {displacement.label}
              </span>
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div className="card-surface p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Quick scenarios
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={p.apply}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary hover:text-primary inline-flex items-center gap-1.5 transition-colors"
              >
                <p.icon className="w-3 h-3" /> {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card-surface p-5 space-y-5 lg:col-span-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Levers</div>
            <Slider
              label="Shift arrival"
              value={shiftDays}
              min={-3}
              max={7}
              step={1}
              format={(v) => (v === 0 ? "No shift" : `${v > 0 ? "+" : ""}${v} day${Math.abs(v) === 1 ? "" : "s"}`)}
              onChange={setShiftDays}
            />
            <Slider
              label="Peak rooms"
              value={roomsPct}
              min={-30}
              max={15}
              step={5}
              format={(v) => (v === 0 ? "As requested" : `${v > 0 ? "+" : ""}${v}% · ${Math.round(rfp.peakRooms * (1 + v / 100))} rms`)}
              onChange={setRoomsPct}
            />
            <Slider
              label="Stay length"
              value={stayDelta}
              min={-1}
              max={2}
              step={1}
              format={(v) => (v === 0 ? "As requested" : `${v > 0 ? "+" : ""}${v} night${Math.abs(v) === 1 ? "" : "s"} · ${rfp.nights + v} total`)}
              onChange={setStayDelta}
            />
          </div>

          <div className="card-surface p-5 lg:col-span-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Target className="w-3 h-3" /> Rate strategy
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "discount", label: "Aggressive", sub: "-5%" },
                { id: "hold", label: "Hold", sub: "Std" },
                { id: "premium", label: "Premium", sub: "+8%" },
              ].map((r) => {
                const active = rateStrategy === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRateStrategy(r.id as any)}
                    className={`p-3 rounded-md border text-center transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-muted-foreground/40"
                    }`}
                  >
                    <div className="text-xs font-medium">{r.label}</div>
                    <div className={`text-[10px] ${active ? "opacity-80" : "text-muted-foreground"}`}>{r.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-surface p-5 lg:col-span-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Add-ons</div>
            <div className="space-y-1.5">
              {[
                { key: "fb", label: "F&B uplift package", price: 28000 },
                { key: "av", label: "Premium AV bundle", price: 18500 },
                { key: "welcome", label: "Welcome reception", price: 12500 },
                { key: "suiteUpgrades", label: "Suite upgrades (8)", price: 9400 },
              ].map((a) => {
                const on = (addOns as any)[a.key];
                return (
                  <label
                    key={a.key}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md border cursor-pointer transition-colors ${
                      on ? "border-gold/40 bg-gold-soft/40" : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => setAddOns((s) => ({ ...s, [a.key]: !on }))}
                      className="w-3.5 h-3.5 rounded border-border accent-primary"
                    />
                    <div className="flex-1 text-xs font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground">+{currency(a.price)}</div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={save}
            disabled={!dirty}
            className="h-10 px-4 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Bookmark className="w-3.5 h-3.5" /> Save scenario
          </button>
          <button
            disabled={!dirty}
            onClick={() => toast({ title: "Scenario applied", description: "Proposal pricing now reflects your tweaks." })}
            className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5" /> Apply to proposal
          </button>
        </div>

        {/* Saved scenarios */}
        {saved.length > 0 && (
          <div className="card-surface p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Saved alternatives</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {saved.map((s) => (
                <div key={s.id} className="rounded-md border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <button
                      onClick={() => setSaved((all) => all.filter((x) => x.id !== s.id))}
                      className="text-[11px] text-muted-foreground hover:text-foreground shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="font-serif text-xl">{currency(s.revenue)}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.roomNights} rn · {s.winProb}% win · {currency(s.profit)} profit
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-surface p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gold font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Scenario planner
            </div>
            <div className="font-serif text-xl mt-0.5">Model the impact</div>
          </div>
          {dirty && (
            <button
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Tweak dates, block size, and rate strategy. KPIs update live against the baseline for {property.name}.
        </p>
      </div>

      {/* Quick presets */}
      <div className="card-surface p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3 h-3" /> Quick scenarios
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={p.apply}
              className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-card hover:border-primary hover:text-primary inline-flex items-center gap-1.5 transition-colors"
            >
              <p.icon className="w-3 h-3" /> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="card-surface p-5 space-y-5">
        <Slider
          label="Shift arrival"
          value={shiftDays}
          min={-3}
          max={7}
          step={1}
          format={(v) => (v === 0 ? "No shift" : `${v > 0 ? "+" : ""}${v} day${Math.abs(v) === 1 ? "" : "s"}`)}
          onChange={setShiftDays}
        />
        <Slider
          label="Peak rooms"
          value={roomsPct}
          min={-30}
          max={15}
          step={5}
          format={(v) => (v === 0 ? "As requested" : `${v > 0 ? "+" : ""}${v}% · ${Math.round(rfp.peakRooms * (1 + v / 100))} rms`)}
          onChange={setRoomsPct}
        />
        <Slider
          label="Stay length"
          value={stayDelta}
          min={-1}
          max={2}
          step={1}
          format={(v) => (v === 0 ? "As requested" : `${v > 0 ? "+" : ""}${v} night${Math.abs(v) === 1 ? "" : "s"} · ${rfp.nights + v} total`)}
          onChange={setStayDelta}
        />
      </div>

      {/* Rate strategy */}
      <div className="card-surface p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
          <Target className="w-3 h-3" /> Rate strategy
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "discount", label: "Aggressive", sub: "-5%" },
            { id: "hold", label: "Hold", sub: "Std" },
            { id: "premium", label: "Premium", sub: "+8%" },
          ].map((r) => {
            const active = rateStrategy === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRateStrategy(r.id as any)}
                className={`p-2 rounded-md border text-center transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-muted-foreground/40"
                }`}
              >
                <div className="text-xs font-medium">{r.label}</div>
                <div className={`text-[10px] ${active ? "opacity-80" : "text-muted-foreground"}`}>{r.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add-ons */}
      <div className="card-surface p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2.5">Add-ons</div>
        <div className="space-y-1.5">
          {[
            { key: "fb", label: "F&B uplift package", price: 28000 },
            { key: "av", label: "Premium AV bundle", price: 18500 },
            { key: "welcome", label: "Welcome reception", price: 12500 },
            { key: "suiteUpgrades", label: "Suite upgrades (8)", price: 9400 },
          ].map((a) => {
            const on = (addOns as any)[a.key];
            return (
              <label
                key={a.key}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md border cursor-pointer transition-colors ${
                  on ? "border-gold/40 bg-gold-soft/40" : "border-border hover:bg-muted/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => setAddOns((s) => ({ ...s, [a.key]: !on }))}
                  className="w-3.5 h-3.5 rounded border-border accent-primary"
                />
                <div className="flex-1 text-xs font-medium">{a.label}</div>
                <div className="text-xs text-muted-foreground">+{currency(a.price)}</div>
              </label>
            );
          })}
        </div>
      </div>

      {/* KPIs */}
      <div className="card-surface p-5">
        <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-3">
          {dirty ? "Scenario projection" : "Baseline"}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Kpi label="Projected revenue" value={currency(scenarioRevenue)} delta={dirty ? revDelta : null} />
          <Kpi label="Projected profit" value={currency(scenarioProfit)} delta={dirty ? profitDelta : null} />
          <Kpi label="Room nights" value={adjustedRoomNights.toLocaleString()} />
          <Kpi label="Avg rate" value={`$${Math.round(avgRate * rateMult)}`} />
        </div>

        <div className="space-y-2.5 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Win probability</span>
            <span className="font-semibold">{win}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                win >= 70 ? "bg-success" : win >= 50 ? "bg-gold" : "bg-warning"
              }`}
              style={{ width: `${win}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground">Displacement risk</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${displacement.tone}`}>
              {displacement.label}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={save}
          disabled={!dirty}
          className="h-10 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          <Bookmark className="w-3.5 h-3.5" /> Save scenario
        </button>
        <button
          disabled={!dirty}
          onClick={() => toast({ title: "Scenario applied", description: "Proposal pricing now reflects your tweaks." })}
          className="h-10 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          <Check className="w-3.5 h-3.5" /> Apply to proposal
        </button>
      </div>

      {/* Saved scenarios */}
      {saved.length > 0 && (
        <div className="card-surface p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2.5">Saved alternatives</div>
          <ul className="space-y-2">
            {saved.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 p-2 rounded-md border border-border bg-card">
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {currency(s.revenue)} · {s.roomNights} rn · {s.winProb}% win
                  </div>
                </div>
                <button
                  onClick={() => setSaved((all) => all.filter((x) => x.id !== s.id))}
                  className="text-[11px] text-muted-foreground hover:text-foreground shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-gradient-to-r from-muted via-muted to-gold-soft accent-primary cursor-pointer"
      />
    </div>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta?: number | null }) {
  const showDelta = delta !== undefined && delta !== null;
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-md border border-border bg-muted/20 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-serif text-lg leading-tight mt-0.5">{value}</div>
      {showDelta && delta !== 0 && (
        <div className={`text-[11px] mt-0.5 inline-flex items-center gap-0.5 ${positive ? "text-success" : "text-warning"}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {positive ? "+" : ""}
          {currency(Math.round(delta)).replace("$", "$")}
        </div>
      )}
      {showDelta && delta === 0 && (
        <div className="text-[11px] mt-0.5 text-muted-foreground">No change</div>
      )}
    </div>
  );
}

/* ---------------- Revision flow ---------------- */

function RevisionBanner({ rfp, onViewPrevious }: { rfp: typeof rfps[number]; onViewPrevious: () => void }) {
  const rev = rfp.revisionRequest!;
  const prev = rfp.previousProposal!;
  return (
    <div className="mb-6 rounded-lg border border-warning/40 bg-warning-soft/50 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div className="flex-1 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-warning text-white grid place-items-center shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-warning text-white">
                  Revision requested
                </span>
                <span className="text-xs text-muted-foreground">
                  via {rev.channel} · {fmtDate(rev.requestedAt)} · by {rev.requestedBy}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{rev.summary}</p>
              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                {rev.asks.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-warning/20 text-warning grid place-items-center mt-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-warning/30 bg-card/60 p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Previous submission</div>
            <div className="font-serif text-lg mt-0.5">{prev.fileName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {prev.version.toUpperCase()} · {fmtDate(prev.submittedAt)} · {currency(prev.totalValue)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={onViewPrevious}
              className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> View previous proposal
            </button>
            <button className="h-9 px-3 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted inline-flex items-center justify-center gap-2">
              <GitCompare className="w-4 h-4" /> Compare v1 vs current
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviousProposalSheet({
  open,
  onOpenChange,
  rfp,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  rfp: typeof rfps[number];
}) {
  const prev = rfp.previousProposal!;
  const rev = rfp.revisionRequest!;
  const property = properties.find((p) => p.id === prev.propertyId)!;
  const nights = buildAvailability(rfp, prev.propertyId);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {prev.version.toUpperCase()} · {prev.format}
            </span>
            <span className="text-xs text-muted-foreground">
              Submitted {fmtDate(prev.submittedAt)} by {prev.submittedBy}
            </span>
          </div>
          <SheetTitle className="font-serif text-2xl">{rfp.eventName} — Previous proposal</SheetTitle>
          <SheetDescription>
            What we sent to {rfp.client} on {fmtDate(prev.submittedAt)}. Use this as the baseline for revisions.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStat label="Property" value={property.name.replace("The ", "")} />
            <MiniStat label="Dates" value={`${fmtShortDate(prev.arrival)} – ${fmtShortDate(prev.departure)}`} />
            <MiniStat label="Peak rooms" value={String(prev.peakRooms)} />
            <MiniStat label="Total value" value={currency(prev.totalValue)} />
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              What was offered
            </div>
            <ul className="p-4 space-y-2">
              {prev.inclusions.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-success shrink-0" /> {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              Pricing snapshot (as sent)
            </div>
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Night</th>
                  <th className="text-right px-4 py-2 font-medium">Rooms</th>
                  <th className="text-right px-4 py-2 font-medium">Group rate</th>
                </tr>
              </thead>
              <tbody>
                {nights.map((n) => (
                  <tr key={n.date} className="border-t border-border">
                    <td className="px-4 py-2.5">{fmtShortDate(n.date)}</td>
                    <td className="px-4 py-2.5 text-right">{n.requested}</td>
                    <td className="px-4 py-2.5 text-right font-semibold">${prev.groupRateAvg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-warning/40 bg-warning-soft/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">Client revision asks</span>
            </div>
            <ul className="space-y-1.5">
              {rev.asks.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button className="h-10 px-4 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted inline-flex items-center justify-center gap-2 flex-1">
              <Download className="w-4 h-4" /> Download {prev.fileName}
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-2 flex-1"
            >
              <Sparkles className="w-4 h-4" /> Start v2 revisions
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-0.5 truncate">{value}</div>
    </div>
  );
}
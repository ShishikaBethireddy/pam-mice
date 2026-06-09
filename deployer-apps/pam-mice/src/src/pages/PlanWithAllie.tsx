import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Check, ChevronLeft, Gem, History, Plus, Star, TrendingUp } from "lucide-react";
import NobuTopNav from "@/components/NobuTopNav";
import { addSubmittedRfp, setMockUser, useMockUser } from "@/lib/mockAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LogIn } from "lucide-react";

/* ----------------------------------------------------------------------------
 * Nobu (pam-brides) chat skin exact palette + Poppins typography.
 * surface-page #f5f5f5 · cream #f4efe6 · allie bubble #e8e8e8 · avatar #585858
 * text #2b2b27 / #585858 / #969696 · brand gold #ae803a · tint #d2af79
 * border #d0d0d0 / strong #767676 · action-primary #000
 * -------------------------------------------------------------------------- */

type Role = "allie" | "user";
type Message = { id: string; role: Role; content: React.ReactNode };

type Brief = {
  eventType: string;
  headcount: string;
  timing: string;
  budgetRange: string;
  property: string;
  spaces: string[];
  fnb: string[];
  specialRequests: string[];
  specialRequestsNote: string;
  withAgency: "" | "yes" | "no";
  agencyName: string;
  agentName: string;
  agentEmail: string;
  companyName: string;
  companyAddress: string;
  contactName: string;
  contactEmail: string;
};

const emptyBrief: Brief = {
  eventType: "",
  headcount: "",
  timing: "",
  budgetRange: "",
  property: "",
  spaces: [],
  fnb: [],
  specialRequests: [],
  specialRequestsNote: "",
  withAgency: "",
  agencyName: "",
  agentName: "",
  agentEmail: "",
  companyName: "",
  companyAddress: "",
  contactName: "",
  contactEmail: "",
};

const EVENT_TYPES = [
  "Leadership meeting",
  "Sales kickoff",
  "Conference",
  "Incentive trip",
  "Workshop",
  "Gala / Reception",
];

const TIMING_OPTIONS = [
  "Q1 2027",
  "Q2 2027",
  "Q3 2026",
  "Q4 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "Flexible open to suggestions",
];

const BUDGET_RANGES = [
  "Under $100K",
  "$100K – $250K",
  "$250K – $500K",
  "$500K – $1M",
  "$1M+",
  "Not sure yet",
];

type SpaceOption = {
  name: string;
  tag: string;
  image: string;
  blurb: string;
  capacity: string;
  setup: string;
};

const SPACE_NEEDS: SpaceOption[] = [
  {
    name: "Main event / general session",
    tag: "Ballroom · up to 400",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=70",
    blurb:
      "Our flagship ballroom for general sessions and plenaries, with full staging, AV, and rigging ready for keynote moments.",
    capacity: "Up to 400",
    setup: "Theater / Banquet",
  },
  {
    name: "Half-day conference room",
    tag: "Classroom · 80",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=70",
    blurb:
      "A bright, focused room ideal for half-day sessions, training, and working meetings with abundant natural light.",
    capacity: "Up to 80",
    setup: "Classroom",
  },
  {
    name: "Breakout rooms",
    tag: "Flexible pods · 20–40",
    image:
      "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?auto=format&fit=crop&w=900&q=70",
    blurb:
      "Flexible breakout pods that flex from 20 to 40 guests for workshops, syndicate work, and team sessions.",
    capacity: "20–40 each",
    setup: "Pods / U-shape",
  },
  {
    name: "Outdoor reception space",
    tag: "Beach lawn · cocktails",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=70",
    blurb:
      "An oceanfront lawn for welcome receptions and cocktails under the stars, with bar and lounge build-out.",
    capacity: "Up to 300",
    setup: "Reception",
  },
  {
    name: "Private dining",
    tag: "Omakase counter · 24",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=70",
    blurb:
      "An intimate omakase counter for executive dinners and VIP hosting, led by the Nobu culinary team.",
    capacity: "24 seated",
    setup: "Chef's counter",
  },
  {
    name: "Boardroom",
    tag: "Executive · 16",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=70",
    blurb:
      "A private executive boardroom with integrated AV for leadership meetings and confidential sessions.",
    capacity: "16 seated",
    setup: "Boardroom",
  },
  {
    name: "Exhibit / sponsor area",
    tag: "Foyer · pre-function",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=70",
    blurb:
      "A pre-function foyer for sponsor activations, registration, and exhibits adjacent to the main session.",
    capacity: "Flexible",
    setup: "Exhibits",
  },
];

const SPECIAL_REQUESTS = [
  "ADA accessibility",
  "Kosher / Halal options",
  "Translation / interpretation",
  "On-site AV & recording",
  "Branded signage",
  "EV charging",
  "Sustainability requirements",
];

const FNB_OPTIONS = [
  "Daily breakfast",
  "Working lunches",
  "Coffee breaks",
  "Welcome reception",
  "Group dinners",
  "Omakase experience",
  "Open bar",
  "No F&B catered separately",
];

/* ---------- Matching engine (mock) ---------- */

type Tier = "ultra-luxury" | "luxury" | "upper-upscale";

type PropertyProfile = {
  name: string;
  brand: "Nobu" | "Aman" | "Unico" | "Hard Rock Reserve" | "Hard Rock" | "Ava";
  location: string;
  tier: Tier;
  capacity: number;
  blurb: string;
  flexWindow: string;
};

const PROPERTY_CATALOG: PropertyProfile[] = [
  { name: "Nobu Hotel Los Cabos", brand: "Nobu", location: "Los Cabos, MX", tier: "ultra-luxury", capacity: 320, blurb: "Beachfront resort with 28k sqft of event space and signature omakase venues.", flexWindow: "Sep 8–12 · Sep 22–26" },
  { name: "Nobu Hotel Miami Beach", brand: "Nobu", location: "Miami, FL", tier: "ultra-luxury", capacity: 260, blurb: "Oceanfront with penthouse ballroom and rooftop reception space.", flexWindow: "Sep 14–18 · Oct 6–10" },
  { name: "Nobu Hotel Marrakech", brand: "Nobu", location: "Marrakech, MA", tier: "ultra-luxury", capacity: 220, blurb: "Atlas-facing riad with cedar boardrooms and private garden dining.", flexWindow: "Oct 12–16" },
  { name: "Unico 20°87° Riviera Maya", brand: "Unico", location: "Riviera Maya, MX", tier: "luxury", capacity: 400, blurb: "All-inclusive adults-only with 14k sqft conference + cenote receptions.", flexWindow: "Sep 15–19 · Oct 20–24" },
  { name: "Aman New York", brand: "Aman", location: "New York, NY", tier: "ultra-luxury", capacity: 90, blurb: "Discreet luxury for boardroom-scale meetings, jazz club takeover available.", flexWindow: "Sep 9–11 · Sep 23–25" },
  { name: "Hard Rock Hotel Reserve Los Cabos", brand: "Hard Rock Reserve", location: "Los Cabos, MX", tier: "luxury", capacity: 500, blurb: "Large-format ballrooms and live entertainment ready for sales kickoffs.", flexWindow: "Sep 15–19 · Oct 6–10" },
  { name: "Hard Rock Hotel Riviera Maya", brand: "Hard Rock", location: "Riviera Maya, MX", tier: "upper-upscale", capacity: 600, blurb: "High-energy resort, large exhibit halls and beach reception lawns.", flexWindow: "Sep 8–12 · Sep 22–26" },
  { name: "Ava Resort Cancun", brand: "Ava", location: "Cancun, MX", tier: "luxury", capacity: 460, blurb: "All-inclusive beachfront resort with 32k sqft of meeting space and beach receptions.", flexWindow: "Sep 8–12 · Oct 6–10" },
];

// Mock historical bookings keyed by lowercase company/agency name
const HISTORICAL_BOOKINGS: Record<string, string[]> = {
  mckinsey: ["Nobu Hotel Los Cabos", "Aman New York"],
  "mckinsey & company": ["Nobu Hotel Los Cabos", "Aman New York"],
  bcg: ["Nobu Hotel Marrakech", "Aman New York"],
  bain: ["Nobu Hotel Miami Beach"],
  goldman: ["Aman New York", "Nobu Hotel Miami Beach"],
  blackstone: ["Aman New York"],
  kkr: ["Nobu Hotel Los Cabos"],
  google: ["Hard Rock Hotel Reserve Los Cabos", "Nobu Hotel Miami Beach"],
  meta: ["Hard Rock Hotel Riviera Maya"],
  amex: ["Unico 20°87° Riviera Maya"],
};

const ELITE_KEYWORDS = [
  "mckinsey",
  "bcg",
  "boston consulting",
  "bain",
  "goldman",
  "blackstone",
  "kkr",
  "blackrock",
  "morgan stanley",
  "jpmorgan",
];

const PREMIUM_BRANDS = new Set(["Nobu", "Aman", "Unico"]);

type Match = {
  property: PropertyProfile;
  score: number;
  reasons: { icon: "history" | "flex" | "tier" | "capacity" | "location"; label: string }[];
};

function computeTopMatches(brief: Brief): { matches: Match[]; tier: "elite" | "standard"; flexible: boolean } {
  const key = (brief.companyName + " " + brief.agencyName).toLowerCase();
  const isElite = ELITE_KEYWORDS.some((k) => key.includes(k));
  const flexible = brief.timing.toLowerCase().includes("flex") || brief.timing.startsWith("Q");
  const headcountNum = parseInt(brief.headcount.replace(/[^0-9]/g, ""), 10) || 100;

  const history = new Set<string>(
    Object.entries(HISTORICAL_BOOKINGS)
      .filter(([k]) => key.includes(k))
      .flatMap(([, v]) => v),
  );

  const eligible = PROPERTY_CATALOG.filter((p) => (isElite ? PREMIUM_BRANDS.has(p.brand) : true));

  const scored: Match[] = eligible.map((p) => {
    const reasons: Match["reasons"] = [];
    let score = 60;

    if (history.has(p.name)) {
      score += 25;
      reasons.push({ icon: "history", label: `Previously booked by ${brief.companyName || brief.agencyName || "your team"}` });
    }
    if (isElite && PREMIUM_BRANDS.has(p.brand)) {
      score += 8;
      reasons.push({ icon: "tier", label: `${p.brand} matches your prestige tier` });
    }
    if (flexible) {
      score += 6;
      reasons.push({ icon: "flex", label: `Open dates: ${p.flexWindow}` });
    }
    const fit = 1 - Math.min(1, Math.abs(p.capacity - headcountNum) / Math.max(p.capacity, headcountNum));
    score += Math.round(fit * 15);
    if (fit > 0.75) {
      reasons.push({ icon: "capacity", label: `Sized for ~${headcountNum} attendees` });
    }

    return { property: p, score: Math.min(99, score), reasons: reasons.slice(0, 3) };
  });

  return {
    matches: scored.sort((a, b) => b.score - a.score).slice(0, 3),
    tier: isElite ? "elite" : "standard",
    flexible,
  };
}

type StepKey =
  | "eventType"
  | "headcount"
  | "timing"
  | "budget"
  | "spaces"
  | "fnb"
  | "requests"
  | "agency"
  | "company"
  | "saveInfo"
  | "done";

const STEP_ORDER: StepKey[] = [
  "eventType",
  "headcount",
  "timing",
  "budget",
  "spaces",
  "fnb",
  "requests",
  "agency",
  "company",
  "saveInfo",
  "done",
];

export default function PlanWithAllie() {
  const activeTab = "Plan My Event" as const;
  const navigate = useNavigate();
  const user = useMockUser();
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [step, setStep] = useState<StepKey>("eventType");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "allie",
      content: (
        <>
          Hi, I'm <span className="font-medium text-black">Allie</span> your Nobu MICE
          planner. I'll ask a few quick questions and build your brief alongside as we go.
          Ready when you are.
        </>
      ),
    },
    { id: "q-eventType", role: "allie", content: "What kind of event are you planning?" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const update = (patch: Partial<Brief>) =>
    setBrief((b) => ({ ...emptyBrief, ...b, ...patch }));

  function pushUser(content: React.ReactNode) {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content }]);
  }
  function pushAllie(content: React.ReactNode) {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "allie", content }]);
  }

  function advance(next: StepKey, prompt: React.ReactNode) {
    setStep(next);
    setTimeout(() => pushAllie(prompt), 250);
  }

  // --- step handlers ---
  function answerEventType(v: string) {
    update({ eventType: v });
    pushUser(v);
    advance("headcount", "Great. Roughly how many attendees?");
  }

  function answerHeadcount(n: number) {
    const v = String(n);
    update({ headcount: v });
    pushUser(`${v} attendees · ${headcountBucket(n)}`);
    advance("timing", "When are you hoping to gather? A month or quarter is fine.");
  }

  function answerTiming(v: string) {
    update({ timing: v });
    pushUser(v);
    advance("budget", "What's the total event budget you're working with?");
  }

  function answerBudget(v: string) {
    update({ budgetRange: v });
    pushUser(v);
    advance("spaces", "Which spaces would you like to hold? Tap Explore for details, then select as many as you need.");
  }

  const [exploreSpace, setExploreSpace] = useState<string | null>(null);

  function toggleSpace(name: string) {
    setBrief((b) => ({
      ...emptyBrief,
      ...b,
      spaces: b.spaces.includes(name) ? b.spaces.filter((x) => x !== name) : [...b.spaces, name],
    }));
  }

  function answerSpaces() {
    if (brief.spaces.length === 0) return;
    setExploreSpace(null);
    pushUser(brief.spaces.join(", "));
    advance("fnb", "Will food & beverage be included? Pick what you'd like Nobu to handle.");
  }

  function answerFnb() {
    if (brief.fnb.length === 0) return;
    pushUser(brief.fnb.join(", "));
    advance(
      "requests",
      "Any special requirements we should plan around? Pick what applies or add your own.",
    );
  }

  function answerRequests() {
    const parts = [...brief.specialRequests];
    if (brief.specialRequestsNote.trim()) parts.push(brief.specialRequestsNote.trim());
    pushUser(parts.length ? parts.join(", ") : "None");
    advance("agency", "Are you working with a planning agency?");
  }

  function answerAgency(v: "yes" | "no") {
    update({ withAgency: v });
    pushUser(v === "yes" ? "Yes" : "No, in-house");
    advance("company", "Tell me about your company name and address.");
  }

  function answerCompany() {
    if (!brief.companyName.trim()) return;
    pushUser(brief.companyName + (brief.companyAddress ? ` · ${brief.companyAddress}` : ""));
    advance(
      "saveInfo",
      "Would you like to save this information for next time? You can log in or create an account so you can track this proposal and skip these questions later.",
    );
  }

  function submitBrief(next: Brief) {
    addSubmittedRfp({
      eventType: next.eventType,
      property: next.property,
      headcount: next.headcount,
      timing: next.timing,
      budgetRange: next.budgetRange,
      spaces: next.spaces,
      fnb: next.fnb,
      specialRequests: next.specialRequests,
      specialRequestsNote: next.specialRequestsNote,
      companyName: next.companyName,
      contactName: next.contactName || next.companyName,
      contactEmail: next.contactEmail || "",
    });
    setStep("done");
    setTimeout(
      () =>
        pushAllie(
          <>
            Perfect your brief is ready. I've ranked your top venue matches below for your
            team to review.
          </>,
        ),
      250,
    );
  }

  const [signInOpen, setSignInOpen] = useState(false);

  function answerSaveYes() {
    pushUser("Yes, save my info");
    setSignInOpen(true);
  }

  function answerSaveNo() {
    pushUser("No thanks");
    submitBrief(brief);
  }

  function handleSignInSubmit(name: string, email: string, phone: string) {
    const updated: Brief = { ...brief, contactName: name, contactEmail: email };
    setBrief(updated);
    setMockUser({ name, email, company: brief.companyName || "" });
    setSignInOpen(false);
    pushUser(`${name} · ${email}${phone ? ` · ${phone}` : ""}`);
    submitBrief(updated);
  }

  function restart() {
    setBrief(emptyBrief);
    setStep("eventType");
    setExploreSpace(null);
    setMessages([
      { id: "intro-r", role: "allie", content: "Starting fresh what kind of event are you planning?" },
    ]);
  }

  // --- composer for current step ---
  const composer = useMemo(() => {
    switch (step) {
      case "eventType":
        return (
          <ChipRow>
            {EVENT_TYPES.map((t) => (
              <Chip key={t} onClick={() => answerEventType(t)}>
                {t}
              </Chip>
            ))}
          </ChipRow>
        );
      case "headcount":
        return <HeadcountPicker onConfirm={answerHeadcount} />;
      case "timing":
        return (
          <ChipRow>
            {TIMING_OPTIONS.map((t) => (
              <Chip key={t} onClick={() => answerTiming(t)}>
                {t}
              </Chip>
            ))}
          </ChipRow>
        );
      case "budget":
        return (
          <ChipRow>
            {BUDGET_RANGES.map((b) => (
              <Chip key={b} onClick={() => answerBudget(b)}>
                {b}
              </Chip>
            ))}
          </ChipRow>
        );
      case "spaces": {
        if (exploreSpace) {
          const s = SPACE_NEEDS.find((x) => x.name === exploreSpace);
          if (s) {
            return (
              <SpaceDetail
                space={s}
                selected={brief.spaces.includes(s.name)}
                onBack={() => setExploreSpace(null)}
                onToggle={() => {
                  toggleSpace(s.name);
                  setExploreSpace(null);
                }}
              />
            );
          }
        }
        return (
          <div className="space-y-4">
            <ImageCardGrid>
              {SPACE_NEEDS.map((s) => (
                <SpaceCard
                  key={s.name}
                  space={s}
                  selected={brief.spaces.includes(s.name)}
                  onExplore={() => setExploreSpace(s.name)}
                  onToggle={() => toggleSpace(s.name)}
                />
              ))}
            </ImageCardGrid>
            <PrimaryBtn onClick={answerSpaces} disabled={brief.spaces.length === 0}>
              Continue{brief.spaces.length > 0 ? ` · ${brief.spaces.length} selected` : ""}
            </PrimaryBtn>
          </div>
        );
      }
      case "fnb":
        return (
          <div className="space-y-3">
            <ChipRow>
              {FNB_OPTIONS.map((f) => {
                const isNone = f.startsWith("No F&B");
                const active = brief.fnb.includes(f);
                return (
                  <Chip
                    key={f}
                    active={active}
                    onClick={() => {
                      if (isNone) {
                        update({ fnb: active ? [] : [f] });
                      } else {
                        const without = brief.fnb.filter((x) => !x.startsWith("No F&B"));
                        update({
                          fnb: active ? without.filter((x) => x !== f) : [...without, f],
                        });
                      }
                    }}
                  >
                    {active && <Check className="mr-1 h-3 w-3" />}
                    {f}
                  </Chip>
                );
              })}
            </ChipRow>
            <PrimaryBtn onClick={answerFnb} disabled={brief.fnb.length === 0}>
              Continue
            </PrimaryBtn>
          </div>
        );
      case "requests":
        return (
          <div className="space-y-3">
            <ChipRow>
              {SPECIAL_REQUESTS.map((r) => {
                const active = brief.specialRequests.includes(r);
                return (
                  <Chip
                    key={r}
                    active={active}
                    onClick={() =>
                      update({
                        specialRequests: active
                          ? brief.specialRequests.filter((x) => x !== r)
                          : [...brief.specialRequests, r],
                      })
                    }
                  >
                    {active && <Check className="mr-1 h-3 w-3" />}
                    {r}
                  </Chip>
                );
              })}
            </ChipRow>
            <Field label="Anything else?">
              <TextIn
                value={brief.specialRequestsNote}
                onChange={(v) => update({ specialRequestsNote: v })}
                placeholder="Optional add your own request"
              />
            </Field>
            <div className="flex gap-2">
              <PrimaryBtn onClick={answerRequests}>Continue</PrimaryBtn>
              <SecondaryBtn
                onClick={() => {
                  update({ specialRequests: [], specialRequestsNote: "" });
                  pushUser("None");
                  advance("agency", "Are you working with a planning agency?");
                }}
              >
                Skip
              </SecondaryBtn>
            </div>
          </div>
        );
      case "agency":
        return (
          <ChipRow>
            <Chip onClick={() => answerAgency("yes")}>Yes, with an agency</Chip>
            <Chip onClick={() => answerAgency("no")}>No, in-house</Chip>
          </ChipRow>
        );
      case "company":
        return (
          <div className="space-y-3">
            {brief.withAgency === "yes" && (
              <Field label="Agency name">
                <TextIn
                  value={brief.agencyName}
                  onChange={(v) => update({ agencyName: v })}
                  placeholder="Agency"
                />
              </Field>
            )}
            <Field label="Company name">
              <TextIn
                value={brief.companyName}
                onChange={(v) => update({ companyName: v })}
                placeholder="Company"
              />
            </Field>
            <Field label="Company address">
              <TextIn
                value={brief.companyAddress}
                onChange={(v) => update({ companyAddress: v })}
                placeholder="Street, City, Country"
              />
            </Field>
            <PrimaryBtn onClick={answerCompany} disabled={!brief.companyName.trim()}>
              Continue
            </PrimaryBtn>
          </div>
        );
      case "saveInfo":
        return (
          <ChipRow>
            <Chip onClick={answerSaveYes}>Yes, save my info</Chip>
            <Chip onClick={answerSaveNo}>No, just submit</Chip>
          </ChipRow>
        );
      case "done":
        return (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#d2af79]/50 bg-[#f4efe6] p-4 text-sm text-[#585858]">
              Brief sent to the Nobu events team. A draft proposal will land in your inbox shortly.
            </div>
            {!user && (
              <div className="flex flex-col gap-3 rounded-xl border border-[#d0d0d0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-[#585858]">
                  <div className="font-medium text-[#2b2b27]">Track this proposal</div>
                  <div className="mt-0.5 text-xs text-[#969696]">
                    Log in or create an account to follow status, message the events team, and see past briefs in one place.
                  </div>
                </div>
                <div className="flex flex-none gap-2">
                  <PrimaryBtn onClick={() => navigate("/login")}>Log in / Sign up</PrimaryBtn>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <PrimaryBtn onClick={() => navigate("/book")}>Back to overview</PrimaryBtn>
              <SecondaryBtn onClick={restart}>Start another</SecondaryBtn>
            </div>
          </div>
        );
    }
  }, [step, brief, user, exploreSpace]);

  const progress = (STEP_ORDER.indexOf(step) / (STEP_ORDER.length - 1)) * 100;
  const topMatches = useMemo(() => (step === "done" ? computeTopMatches(brief) : null), [step, brief]);
  const phaseIdx = PHASE_FOR_STEP[step];

  const [freeText, setFreeText] = useState("");
  function sendFreeText() {
    const v = freeText.trim();
    if (!v) return;
    pushUser(v);
    pushAllie("Got it I've noted that. You can keep using the options below or keep typing.");
    setFreeText("");
  }

  return (
    <div className="flex h-screen flex-col bg-[#f5f5f5] font-sans">
      <NobuTopNav activeTab={activeTab} />

      {/* Mobile progress bar */}
      <div className="flex items-center gap-3 border-b border-[#d0d0d0] bg-white px-5 py-3 md:hidden">
        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">
          Step {phaseIdx + 1} of {PHASES.length} · {PHASES[phaseIdx].label}
        </span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#e8e8e8]">
          <div className="h-full bg-[#585858] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left planning notebook */}
        <aside className="hidden w-1/3 max-w-[380px] flex-none md:flex">
          <NotebookSidebar
            brief={brief}
            phaseIdx={phaseIdx}
            onRestart={restart}
            onSave={() => setSignInOpen(true)}
          />
        </aside>

        {/* Right Allie chat */}
        <main className="flex min-w-0 flex-1 flex-col bg-[#f5f5f5]">
          {/* Messages + inline contextual canvas */}
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-8 md:px-8 md:py-10">
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role}>
                  {m.content}
                </Bubble>
              ))}
              {step === "done" && topMatches && (
                <div className="md:pl-[52px]">
                  <TopMatchesPanel
                    matches={topMatches.matches}
                    tier={topMatches.tier}
                    flexible={topMatches.flexible}
                    clientName={brief.companyName}
                  />
                </div>
              )}
              <div className="md:pl-[52px]">{composer}</div>
            </div>
          </div>

          {/* Input bar always-on free text */}
          <div className="flex-none border-t border-[#ebebeb] bg-[#f5f5f5] px-5 py-5 md:px-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendFreeText();
              }}
              className="mx-auto flex w-full max-w-3xl items-center gap-[10px] rounded-full border border-[#d0d0d0] bg-white px-[5px] py-[3px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
            >
              <button
                type="button"
                className="flex h-11 w-11 flex-none items-center justify-center text-[#2b2b27]"
                aria-label="Attach"
              >
                <Plus className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Type a message…"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm leading-5 text-[#2b2b27] placeholder:text-[#969696] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!freeText.trim()}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-black text-white transition hover:opacity-80 disabled:bg-[#d0d0d0]"
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </main>
      </div>

      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSubmit={handleSignInSubmit}
        onLater={() => {
          setSignInOpen(false);
          submitBrief(brief);
        }}
        defaultName={brief.contactName}
        defaultEmail={brief.contactEmail}
        contextLine={
          brief.companyName
            ? `For ${brief.companyName}${brief.headcount ? ` · ${brief.headcount} guests` : ""}${brief.timing ? ` · ${brief.timing}` : ""}`
            : "Save this brief and track your proposal."
        }
      />
    </div>
  );
}

/* ---------- phases ---------- */

const PHASES = [
  { label: "Format", time: "1 MIN", blurb: "The kind of event we're shaping together." },
  { label: "Logistics", time: "2 MIN", blurb: "Guests, timing, and budget so we right-size everything." },
  { label: "Spaces & F&B", time: "3 MIN", blurb: "Event spaces, catering, and special requests." },
  { label: "Contact", time: "2 MIN", blurb: "Who you are and where to send the proposal." },
  { label: "Your Matches", time: "1 MIN", blurb: "Top venues, ranked for you." },
];

const PHASE_FOR_STEP: Record<StepKey, number> = {
  eventType: 0,
  headcount: 1,
  timing: 1,
  budget: 1,
  spaces: 2,
  fnb: 2,
  requests: 2,
  agency: 3,
  company: 3,
  saveInfo: 3,
  done: 4,
};

/* ---------- left progress notebook ---------- */

function phaseSummary(i: number, brief: Brief): string {
  switch (i) {
    case 0:
      return brief.eventType;
    case 1:
      return [brief.headcount ? `${brief.headcount} pax` : "", brief.timing, brief.budgetRange]
        .filter(Boolean)
        .join(" · ");
    case 2:
      return [
        brief.spaces.length ? `${brief.spaces.length} space${brief.spaces.length > 1 ? "s" : ""}` : "",
        brief.fnb.length ? `${brief.fnb.length} F&B` : "",
        brief.specialRequests.length ? `${brief.specialRequests.length} requests` : "",
      ]
        .filter(Boolean)
        .join(" · ");
    case 3:
      return brief.companyName;
    default:
      return "";
  }
}

function NotebookSidebar({
  brief,
  phaseIdx,
  onRestart,
  onSave,
}: {
  brief: Brief;
  phaseIdx: number;
  onRestart: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col border-r border-[#d0d0d0] bg-white">
      {/* Header lockup */}
      <div className="shrink-0 border-b border-[#d0d0d0] bg-[#f4efe6] px-5 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-black">
              Step {phaseIdx + 1} of {PHASES.length}
            </span>
            <span className="h-[11px] w-px shrink-0 bg-black" aria-hidden />
            <span className="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-black">
              {PHASES[phaseIdx].label}
            </span>
          </div>
          <p className="text-xl leading-7 text-black">Event Planning Notebook</p>
        </div>
      </div>

      {/* Intro + steps */}
      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Planning steps">
        <div className="border-b border-[#d0d0d0] px-5 py-4">
          <p className="text-[14px] leading-5 text-black">
            Here's how we'll shape your event together a few quick questions and your venue
            matches, in under five minutes.
          </p>
        </div>

        <div className="flex flex-col">
          {PHASES.map((p, i) => {
            const state = i < phaseIdx ? "previous" : i === phaseIdx ? "current" : "future";
            const summary = phaseSummary(i, brief);
            const titleColor =
              state === "current" ? "#000000" : state === "future" ? "#b4b4b4" : "#969696";
            const descColor = state === "current" ? "#585858" : "#969696";
            return (
              <div
                key={p.label}
                className={`flex w-full gap-3 rounded p-4 text-left ${
                  state === "current" ? "bg-[#f4efe6]" : ""
                } ${state === "future" ? "opacity-60" : ""}`}
                aria-current={state === "current" ? "step" : undefined}
              >
                <div
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px]"
                  style={{
                    background: state === "current" ? "#585858" : "#ffffff",
                    borderColor: state === "previous" ? "#969696" : state === "current" ? "#585858" : "#d0d0d0",
                    color: state === "current" ? "#ffffff" : state === "previous" ? "#585858" : "#969696",
                  }}
                >
                  {state === "previous" ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-5" style={{ color: titleColor }}>
                    {p.label}
                  </p>
                  {summary && state === "previous" ? (
                    <p className="mt-1 truncate text-[14px] leading-5 text-[#ae803a]">{summary}</p>
                  ) : (
                    <p className="mt-1 line-clamp-2 text-[14px] leading-5" style={{ color: descColor }}>
                      {p.blurb}
                    </p>
                  )}
                </div>
                <span
                  className="shrink-0 pt-1 text-[12px] font-semibold uppercase leading-4 tracking-[0.08em]"
                  style={{ color: state === "current" ? "#969696" : "#b4b4b4" }}
                >
                  {p.time}
                </span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer actions */}
      <div className="flex w-full shrink-0 items-center justify-end gap-3 border-t border-[#d0d0d0] px-5 py-4">
        <button
          type="button"
          onClick={onRestart}
          className="shrink-0 text-sm font-medium leading-5 text-[#ae803a] underline underline-offset-2"
        >
          Start over
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex h-9 shrink-0 items-center justify-center rounded-full border px-5 text-sm font-medium leading-5 transition-colors hover:bg-[#f5f5f5]"
          style={{ borderColor: "#767676", color: "#000000" }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ---------- spaces: card + inline explore sub-page ---------- */

function SpaceCard({
  space,
  selected,
  onExplore,
  onToggle,
}: {
  space: SpaceOption;
  selected: boolean;
  onExplore: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white transition ${
        selected ? "border-black ring-1 ring-black/10" : "border-[#d0d0d0]"
      }`}
    >
      <button
        type="button"
        onClick={onExplore}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e8e8] text-left"
        aria-label={`Explore ${space.name}`}
      >
        <img
          src={space.image}
          alt={space.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {selected && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-sm font-medium text-[#2b2b27]">{space.name}</div>
          <div className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-[#969696]">{space.tag}</div>
        </div>
        <div className="mt-auto flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onExplore}
            className="flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors hover:bg-[#f5f5f5]"
            style={{ borderColor: "#767676", color: "#2b2b27" }}
          >
            Explore
          </button>
          <button
            type="button"
            onClick={onToggle}
            className={
              selected
                ? "flex h-9 items-center rounded-full border border-[#767676] px-4 text-sm font-medium text-[#2b2b27]"
                : "flex h-9 items-center rounded-full bg-black px-4 text-sm font-medium text-white transition hover:opacity-80"
            }
          >
            {selected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SpaceDetail({
  space,
  selected,
  onBack,
  onToggle,
}: {
  space: SpaceOption;
  selected: boolean;
  onBack: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d0d0d0] bg-white animate-in fade-in slide-in-from-right-3 duration-300">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e8e8e8]">
        <img src={space.image} alt={space.name} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={onBack}
          className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-medium text-[#2b2b27] shadow-sm transition hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {selected && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
            <Check className="h-3 w-3" /> Selected
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">{space.tag}</div>
          <div className="mt-1 text-2xl leading-tight text-black">{space.name}</div>
        </div>
        <p className="text-[15px] leading-6 text-[#585858]">{space.blurb}</p>
        <div className="grid grid-cols-2 gap-4 border-t border-[#d0d0d0] pt-4 text-sm">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">Capacity</div>
            <div className="mt-1 text-[#2b2b27]">{space.capacity}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">Setup</div>
            <div className="mt-1 text-[#2b2b27]">{space.setup}</div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#ae803a] underline underline-offset-2"
          >
            <ChevronLeft className="h-4 w-4" /> Back to spaces
          </button>
          <button
            type="button"
            onClick={onToggle}
            className={
              selected
                ? "flex h-9 items-center rounded-full border border-[#767676] px-5 text-sm font-medium text-[#2b2b27]"
                : "flex h-9 items-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:opacity-80"
            }
          >
            {selected ? "Remove from plan" : "Add to plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- bits ---------- */

function Bubble({ role, children }: { role: Role; children: React.ReactNode }) {
  if (role === "allie") {
    return (
      <div className="flex w-full items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#585858] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <Gem className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </div>
        <div className="max-w-[88%] rounded-tr-xl rounded-br-xl rounded-bl-xl bg-[#e8e8e8] px-5 py-4 text-[16px] leading-6 text-[#2b2b27] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[80%] rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-black px-4 py-3 text-[16px] leading-6 text-white">
        {children}
      </div>
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function ImageCardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Chip({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-black bg-black text-white"
          : "border-[#d0d0d0] bg-white text-[#2b2b27] hover:border-[#767676]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#969696]">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextIn({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-full border border-[#d0d0d0] bg-white px-4 text-sm text-[#2b2b27] placeholder:text-[#969696] focus:border-[#767676] focus:outline-none"
    />
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:opacity-80 disabled:bg-[#d0d0d0] disabled:text-white"
    >
      {children}
    </button>
  );
}

function SecondaryBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center rounded-full border px-6 text-sm font-medium text-[#2b2b27] transition-colors hover:bg-white"
      style={{ borderColor: "#767676" }}
    >
      {children}
    </button>
  );
}

const HEADCOUNT_STOPS = [25, 50, 100, 150, 200, 300, 500, 750, 1000];
const HEADCOUNT_MIN = 1;
const HEADCOUNT_MAX = 2000;

function headcountBucket(n: number): string {
  if (n <= 40) return "Intimate";
  if (n <= 120) return "Small group";
  if (n <= 250) return "Mid-size event";
  if (n <= 500) return "Large event";
  return "Flagship";
}

function HeadcountPicker({ onConfirm }: { onConfirm: (n: number) => void }) {
  const [n, setN] = useState(200);
  const clamp = (v: number) =>
    Math.min(HEADCOUNT_MAX, Math.max(HEADCOUNT_MIN, Math.round(v) || HEADCOUNT_MIN));
  const min = HEADCOUNT_STOPS[0];
  const max = HEADCOUNT_STOPS[HEADCOUNT_STOPS.length - 1];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={HEADCOUNT_MIN}
          max={HEADCOUNT_MAX}
          value={n}
          onChange={(e) => setN(clamp(Number(e.target.value)))}
          className="w-24 rounded-xl border border-[#d0d0d0] bg-white px-3 py-2 text-2xl font-light tabular-nums text-[#2b2b27] focus:border-[#767676] focus:outline-none"
        />
        <span className="text-sm text-[#969696]">attendees · {headcountBucket(n)}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={5}
        value={Math.min(max, Math.max(min, n))}
        onChange={(e) => setN(clamp(Number(e.target.value)))}
        className="w-full accent-[#585858]"
        aria-label="Attendee count slider"
      />

      <div className="flex justify-end">
        <PrimaryBtn onClick={() => onConfirm(n)}>Confirm</PrimaryBtn>
      </div>
    </div>
  );
}

function TopMatchesPanel({
  matches,
  tier,
  flexible,
  clientName,
}: {
  matches: Match[];
  tier: "elite" | "standard";
  flexible: boolean;
  clientName: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ae803a]">
        <Star className="h-3.5 w-3.5" />
        Top 3 matches
      </div>
      <p className="mt-1 text-sm text-[#585858]">
        Ranked by fit{flexible ? ", with flexible date windows" : ""}
        {clientName ? ` for ${clientName}` : ""}.
      </p>
      {tier === "elite" && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
          <Star className="h-3 w-3" /> Elite tier · premium brands only
        </div>
      )}

      <div className="mt-5 space-y-3">
        {matches.map((m, i) => (
          <div key={m.property.name} className="rounded-xl border border-[#d0d0d0] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">
                  #{i + 1} · {m.property.brand}
                </div>
                <div className="mt-1 text-sm font-medium text-[#2b2b27]">{m.property.name}</div>
                <div className="text-xs text-[#969696]">{m.property.location}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-light text-black">{m.score}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">match</div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#585858]">{m.property.blurb}</p>
            <ul className="mt-3 space-y-1.5">
              {m.reasons.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-[#585858]">
                  {r.icon === "history" && <History className="mt-0.5 h-3 w-3 text-[#ae803a]" />}
                  {r.icon === "flex" && <TrendingUp className="mt-0.5 h-3 w-3 text-[#ae803a]" />}
                  {r.icon === "tier" && <Star className="mt-0.5 h-3 w-3 text-[#ae803a]" />}
                  {r.icon === "capacity" && <Check className="mt-0.5 h-3 w-3 text-[#ae803a]" />}
                  {r.icon === "location" && <Check className="mt-0.5 h-3 w-3 text-[#ae803a]" />}
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignInDialog({
  open,
  onOpenChange,
  onSubmit,
  onLater,
  defaultName,
  defaultEmail,
  contextLine,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (name: string, email: string, phone: string) => void;
  onLater: () => void;
  defaultName?: string;
  defaultEmail?: string;
  contextLine?: string;
}) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState(defaultName || "");
  const [email, setEmail] = useState(defaultEmail || "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) {
      setMode("signup");
      setName(defaultName || "");
      setEmail(defaultEmail || "");
      setPhone("");
      setPassword("");
    }
  }, [open, defaultName, defaultEmail]);

  const canSubmitSignup = name.trim().length > 0 && /.+@.+\..+/.test(email.trim());
  const canSubmitLogin = /.+@.+\..+/.test(email.trim()) && password.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#d0d0d0] bg-white p-8 font-sans">
        <DialogHeader>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#969696]">
            {mode === "signup" ? "Save your brief" : "Log in to continue"}
          </div>
          <DialogTitle className="text-3xl font-light leading-tight text-black">
            {mode === "signup" ? "Save your details" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#585858]">
            {mode === "signup"
              ? contextLine ||
                "Enter your details to track this proposal and skip these questions next time."
              : "Sign in to your account we'll attach this brief and submit it for you."}
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="mt-2 flex items-center justify-between rounded-xl border border-[#d0d0d0] bg-white px-4 py-3 text-left transition hover:border-[#767676]"
        >
          <span className="flex items-center gap-2 text-sm text-[#585858]">
            <LogIn className="h-4 w-4 text-[#969696]" />
            {mode === "signup" ? "Already have an account?" : "Need to save new details?"}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-[#ae803a]">
            {mode === "signup" ? "Log in" : "Sign up"}
          </span>
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mode === "signup") {
              if (canSubmitSignup) onSubmit(name.trim(), email.trim(), phone.trim());
            } else {
              if (canSubmitLogin) {
                const derivedName =
                  email.trim().split("@")[0]?.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Member";
                onSubmit(derivedName, email.trim(), "");
              }
            }
          }}
          className="mt-2 space-y-5"
        >
          {mode === "signup" && (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#585858]">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-full border border-[#d0d0d0] bg-white px-4 text-sm text-[#2b2b27] placeholder:text-[#969696] focus:border-[#767676] focus:outline-none"
                placeholder="Full name"
                required
              />
            </div>
          )}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#585858]">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-full border border-[#d0d0d0] bg-white px-4 text-sm text-[#2b2b27] placeholder:text-[#969696] focus:border-[#767676] focus:outline-none"
              placeholder="name@email.com"
              required
            />
          </div>
          {mode === "signup" ? (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#585858]">
                Phone number <span className="ml-1 normal-case tracking-normal text-[#969696]">*optional</span>
              </div>
              <div className="flex gap-2">
                <div className="flex h-11 items-center rounded-full border border-[#d0d0d0] bg-white px-4 text-sm text-[#585858]">
                  USA +1
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 flex-1 rounded-full border border-[#d0d0d0] bg-white px-4 text-sm text-[#2b2b27] placeholder:text-[#969696] focus:border-[#767676] focus:outline-none"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#585858]">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-full border border-[#d0d0d0] bg-white px-4 text-sm text-[#2b2b27] placeholder:text-[#969696] focus:border-[#767676] focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={mode === "signup" ? !canSubmitSignup : !canSubmitLogin}
            className="flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-medium text-white transition hover:opacity-80 disabled:bg-[#d0d0d0]"
          >
            {mode === "signup" ? "Save & submit brief" : "Log in & submit brief"}
          </button>

          <button
            type="button"
            onClick={onLater}
            className="block w-full text-center text-xs font-medium uppercase tracking-[0.08em] text-[#969696] hover:text-[#2b2b27]"
          >
            I'll save my info later
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

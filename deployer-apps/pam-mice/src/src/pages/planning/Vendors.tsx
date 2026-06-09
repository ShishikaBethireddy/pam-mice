import { useState } from "react";
import { CheckCircle2, Plus, SlidersHorizontal, Star, X } from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import { currency } from "@/data/mockData";

type Vendor = { id: string; category: string; name: string; low: number; high: number; image: string };

const VENDORS: Vendor[] = [
  { id: "marigold", category: "Event organizer", name: "Marigold Events Co.", low: 4500, high: 18500, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=240&q=60" },
  { id: "hudson", category: "Event organizer", name: "Hudson & Co Planners", low: 4500, high: 18500, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=240&q=60" },
  { id: "studio-lumen", category: "Décor", name: "Studio Lumen", low: 3200, high: 16500, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=240&q=60" },
  { id: "atelier-bloom", category: "Décor", name: "Atelier Bloom", low: 3200, high: 16500, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=240&q=60" },
  { id: "dj-kavi", category: "Entertainment", name: "DJ Kavi", low: 2400, high: 7500, image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&w=240&q=60" },
  { id: "velvet-trio", category: "Entertainment", name: "The Velvet Trio", low: 2400, high: 7500, image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=240&q=60" },
  { id: "frame-field", category: "Photo & video", name: "Frame & Field", low: 3500, high: 12500, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=240&q=60" },
  { id: "forty-acre", category: "Catering add-ons", name: "Forty Acre Kitchen", low: 1400, high: 4200, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=240&q=60" },
  { id: "highball", category: "Bar service", name: "Highball Hospitality", low: 2400, high: 7800, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=240&q=60" },
];

const VENDOR_CATEGORIES = Array.from(new Set(VENDORS.map((v) => v.category)));

type VendorPackage = { tier: string; sub: string; desc: string; features: string[]; price: number };
type VendorDetail = { rating: number; reviews: number; recommended: boolean; tagline: string; packages: VendorPackage[] };

const CATEGORY_PACKAGES: Record<string, { tier: string; sub: string; desc: string; features: string[] }[]> = {
  "Event organizer": [
    { tier: "Essential", sub: "Day-of coordination", desc: "On-site lead coordinator from setup through send-off.", features: ["10 hrs day-of coverage", "Vendor timeline + run-sheet", "1 planning call", "On-site coordinator + assistant"] },
    { tier: "Signature", sub: "Partial planning", desc: "Hands-on support starting 90 days out.", features: ["Up to 6 planning calls", "Vendor sourcing for 3 categories", "Full design moodboard", "Day-of lead + 2 assistants"] },
    { tier: "Full Service", sub: "Full production", desc: "End-to-end design, logistics, and on-site command.", features: ["Unlimited planning calls", "Full vendor sourcing & management", "Custom design & production plan", "Lead planner + 4 on-site staff"] },
  ],
  "Décor": [
    { tier: "Essential", sub: "Accent styling", desc: "Statement florals and table styling for the key moments.", features: ["Ceremony or head-table florals", "Candles + table accents", "1 design consult", "Setup & strike"] },
    { tier: "Signature", sub: "Full room design", desc: "A cohesive look across the whole celebration.", features: ["Full floral program", "Linens, lounge + lighting", "Custom moodboard", "On-site styling team"] },
    { tier: "Full Service", sub: "Bespoke production", desc: "Custom builds and large-format installations.", features: ["Custom installations & builds", "Premium florals throughout", "Lighting & draping design", "Dedicated design lead"] },
  ],
  Entertainment: [
    { tier: "Essential", sub: "Reception set", desc: "Keep the energy up through the main reception hours.", features: ["4 hrs performance", "Pro sound system", "1 prep call", "MC announcements"] },
    { tier: "Signature", sub: "Full evening", desc: "Ceremony, cocktail, and dancing covered end-to-end.", features: ["6 hrs performance", "Ceremony + cocktail audio", "Custom playlist", "Lighting package"] },
    { tier: "Full Service", sub: "Headline production", desc: "An immersive show with full production support.", features: ["Extended live set", "Full stage & lighting rig", "Multiple performers", "Production manager"] },
  ],
  "Photo & video": [
    { tier: "Essential", sub: "Highlights", desc: "Coverage of the moments that matter most.", features: ["6 hrs coverage", "1 photographer", "Online gallery", "150+ edited images"] },
    { tier: "Signature", sub: "Full story", desc: "Photo and a short film of the full celebration.", features: ["10 hrs coverage", "Photo + video team", "Highlight film", "400+ edited images"] },
    { tier: "Full Service", sub: "Cinematic", desc: "Documentary-style photo and film production.", features: ["Full-day coverage", "Two-camera film crew", "Feature + teaser films", "Album + prints"] },
  ],
  "Catering add-ons": [
    { tier: "Essential", sub: "Late-night bites", desc: "A crowd-pleasing add-on to round out the night.", features: ["1 station for the evening", "Staffing included", "Disposables + setup", "Menu consult"] },
    { tier: "Signature", sub: "Grazing & stations", desc: "Multiple interactive stations and grazing tables.", features: ["3 chef stations", "Grazing table", "Dietary options", "On-site chefs"] },
    { tier: "Full Service", sub: "Custom culinary", desc: "A fully bespoke supplemental food program.", features: ["Custom menu design", "Premium ingredients", "Full service staff", "Tastings included"] },
  ],
  "Bar service": [
    { tier: "Essential", sub: "Beer & wine", desc: "Friendly, fully-staffed beer and wine service.", features: ["4 hrs service", "1 bartender", "Glassware + ice", "Standard bar setup"] },
    { tier: "Signature", sub: "Full bar", desc: "A full cocktail bar with signature serves.", features: ["6 hrs service", "2 bartenders", "2 signature cocktails", "Premium glassware"] },
    { tier: "Full Service", sub: "Craft program", desc: "A bespoke craft cocktail and hospitality experience.", features: ["Extended service", "Mobile bar build", "Custom cocktail menu", "Full bar team"] },
  ],
};

const DEFAULT_PACKAGES = CATEGORY_PACKAGES["Event organizer"];

const CATEGORY_TAGLINES: Record<string, string> = {
  "Event organizer": "Award-winning planners known for warm, detail-obsessed celebrations.",
  "Décor": "Floral and design studio crafting immersive, on-theme spaces.",
  Entertainment: "Crowd-reading performers who keep the dance floor full.",
  "Photo & video": "Storytellers capturing the candid, in-between moments.",
  "Catering add-ons": "Inventive culinary add-ons that surprise and delight.",
  "Bar service": "Polished hospitality and craft cocktails, beautifully served.",
};

function getVendorDetail(v: Vendor): VendorDetail {
  const tpl = CATEGORY_PACKAGES[v.category] ?? DEFAULT_PACKAGES;
  const mid = Math.round((v.low + v.high) / 2 / 100) * 100;
  const prices = [v.low, mid, v.high];
  const hash = v.name.length + v.id.length;
  return {
    rating: Math.round((4.6 + (hash % 4) * 0.1) * 10) / 10,
    reviews: 90 + (hash * 17) % 160,
    recommended: v.id === "marigold" || v.id === "frame-field",
    tagline: CATEGORY_TAGLINES[v.category] ?? "Trusted specialists for memorable celebrations.",
    packages: tpl.map((p, i) => ({ ...p, price: prices[i] ?? v.high })),
  };
}

function VendorDetailModal({ vendor, onClose, onViewPackages }: { vendor: Vendor; onClose: () => void; onViewPackages: () => void }) {
  const d = getVendorDetail(vendor);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl">
        <div className="relative h-44 w-full flex-none overflow-hidden">
          <img src={vendor.image} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-grey-900/80 via-grey-900/20 to-grey-900/10" />
          <button onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-grey-700 hover:bg-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">{vendor.category}</p>
            <h3 className="mt-1 font-serif text-3xl text-white">{vendor.name}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-grey-700">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold text-grey-900">{d.rating}</span>
              <span className="text-grey-500">({d.reviews} reviews)</span>
            </span>
            <span className="text-grey-300">·</span>
            <span className="text-grey-700">{currency(vendor.low)}–{currency(vendor.high)}</span>
            {d.recommended && (
              <>
                <span className="text-grey-300">·</span>
                <span className="rounded-full bg-grey-100 px-3 py-1 text-xs font-medium text-grey-700">Recommended</span>
              </>
            )}
          </div>

          <p className="mt-4 text-grey-700">{d.tagline}</p>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-grey-500">Packages at a glance</p>
          <div className="mt-3 space-y-3">
            {d.packages.map((p) => (
              <div key={p.tier} className="flex items-center justify-between gap-4 border border-grey-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-grey-900">{p.tier} · {p.sub}</div>
                  <div className="mt-0.5 text-sm text-grey-500">{p.desc}</div>
                </div>
                <div className="flex-none font-serif text-xl text-grey-900">{currency(p.price)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-100 px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50">
            Read reviews
          </button>
          <button onClick={onViewPackages} className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white hover:bg-grey-700">
            View packages
          </button>
        </div>
      </div>
    </div>
  );
}

function VendorPackageModal({ vendor, added, onClose, onSelect }: { vendor: Vendor; added: boolean; onClose: () => void; onSelect: () => void }) {
  const d = getVendorDetail(vendor);
  const recommendedIdx = Math.min(1, d.packages.length - 1);
  const [chosen, setChosen] = useState<string>(d.packages[recommendedIdx]?.tier ?? d.packages[0].tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">{vendor.category} · {vendor.name}</p>
            <h3 className="mt-2 font-serif text-3xl text-grey-900">Choose your package</h3>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 sm:px-8">
          {d.packages.map((p) => {
            const active = chosen === p.tier;
            return (
              <button
                key={p.tier}
                type="button"
                onClick={() => setChosen(p.tier)}
                className={`block w-full border p-5 text-left transition-colors ${
                  active ? "border-grey-900 ring-1 ring-grey-900" : "border-grey-200 hover:border-grey-400"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{p.tier}</p>
                    <div className="mt-1 font-serif text-2xl text-grey-900">{currency(p.price)}</div>
                    <p className="mt-1 text-sm text-grey-600">{p.desc}</p>
                  </div>
                  <span className={`mt-1 grid h-6 w-6 flex-none place-items-center rounded-full border ${active ? "border-grey-900 bg-grey-900" : "border-grey-300"}`}>
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-grey-700">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex flex-none items-center justify-between gap-3 border-t border-grey-100 px-6 py-4 sm:px-8">
          <button onClick={onClose} className="text-sm font-medium text-grey-600 hover:text-grey-900">
            Cancel
          </button>
          <button onClick={onSelect} className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-grey-700">
            {added ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {added ? `${chosen} selected` : `Add ${chosen} to team`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Vendors() {
  const [tab, setTab] = useState<"market" | "team">("market");
  const [showFilters, setShowFilters] = useState(false);
  const [cat, setCat] = useState<string>("All");
  const [added, setAdded] = useState<Set<string>>(new Set(["frame-field"]));
  const [detailVendor, setDetailVendor] = useState<Vendor | null>(null);
  const [packageVendor, setPackageVendor] = useState<Vendor | null>(null);

  const toggleAdd = (id: string) =>
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const marketList = cat === "All" ? VENDORS : VENDORS.filter((v) => v.category === cat);
  const teamList = VENDORS.filter((v) => added.has(v.id));

  const VendorRow = ({ v }: { v: Vendor }) => {
    const isAdded = added.has(v.id);
    return (
      <div className="border border-grey-200 bg-white">
        <div className="flex items-start gap-4 p-4">
          <div className="h-20 w-20 flex-none overflow-hidden bg-grey-100">
            <img src={v.image} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-grey-500">{v.category}</div>
            <div className="mt-0.5 font-serif text-xl text-grey-900">{v.name}</div>
            <div className="mt-1 text-sm text-grey-600">
              {currency(v.low)}–{currency(v.high)} · choose your package
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-grey-100 px-4 py-3">
          <div className="flex items-center gap-5 text-xs font-medium text-grey-700">
            <button onClick={() => setDetailVendor(v)} className="hover:text-grey-900">Learn more</button>
            <button onClick={() => setPackageVendor(v)} className="hover:text-grey-900">View packages</button>
          </div>
          <button
            onClick={() => (isAdded ? toggleAdd(v.id) : setPackageVendor(v))}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              isAdded ? "border border-grey-300 text-grey-700 hover:bg-grey-50" : "bg-grey-900 text-white hover:bg-grey-700"
            }`}
          >
            {isAdded ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <SocialPlanningShell activeStep="vendors">
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-grey-200">
          <div className="flex gap-6">
            {([
              ["market", "Marketplace"],
              ["team", "Your team"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`-mb-px border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                  tab === key ? "border-grey-900 text-grey-900" : "border-transparent text-grey-500 hover:text-grey-800"
                }`}
              >
                {label}
                {key === "team" && teamList.length > 0 ? ` (${teamList.length})` : ""}
              </button>
            ))}
          </div>
          {tab === "market" && (
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                showFilters ? "border-grey-900 bg-grey-900 text-white" : "border-grey-300 text-grey-700 hover:bg-grey-50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          )}
        </div>

        {tab === "market" && showFilters && (
          <div className="flex flex-wrap gap-2">
            {["All", ...VENDOR_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  cat === c ? "border-grey-900 bg-grey-900 text-white" : "border-grey-300 text-grey-600 hover:bg-grey-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {tab === "market" ? (
          <div className="space-y-4">
            {marketList.map((v) => (
              <VendorRow key={v.id} v={v} />
            ))}
          </div>
        ) : teamList.length === 0 ? (
          <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
            No vendors added yet add a few from the marketplace.
          </p>
        ) : (
          <div className="space-y-4">
            {teamList.map((v) => (
              <VendorRow key={v.id} v={v} />
            ))}
          </div>
        )}

        {detailVendor && (
          <VendorDetailModal
            vendor={detailVendor}
            onClose={() => setDetailVendor(null)}
            onViewPackages={() => {
              const v = detailVendor;
              setDetailVendor(null);
              setPackageVendor(v);
            }}
          />
        )}

        {packageVendor && (
          <VendorPackageModal
            vendor={packageVendor}
            added={added.has(packageVendor.id)}
            onClose={() => setPackageVendor(null)}
            onSelect={() => {
              if (!added.has(packageVendor.id)) toggleAdd(packageVendor.id);
              setPackageVendor(null);
              setTab("team");
            }}
          />
        )}
      </div>
    </SocialPlanningShell>
  );
}

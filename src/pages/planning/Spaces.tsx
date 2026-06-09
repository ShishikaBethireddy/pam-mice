import { useState } from "react";
import { toast } from "sonner";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type LayoutKey = "theater" | "boardroom" | "ushape" | "banquet" | "cocktail" | "classroom" | "lounge";

type SpaceStatus = "Held" | "Tentative" | "Pending";

interface Space {
  name: string;
  use: string;
  setup: string;
  capacity: number;
  status: SpaceStatus;
  layouts: { key: LayoutKey; cap: number }[];
  defaultLayout: LayoutKey;
}

const SPACES: Space[] = [
  {
    name: "Tsuki Ballroom",
    use: "Reception & dinner",
    setup: "Banquet · 24",
    capacity: 60,
    status: "Held",
    defaultLayout: "banquet",
    layouts: [
      { key: "banquet", cap: 60 },
      { key: "cocktail", cap: 80 },
      { key: "theater", cap: 90 },
      { key: "lounge", cap: 40 },
    ],
  },
  {
    name: "Garden Terrace",
    use: "Welcome cocktails",
    setup: "Cocktail",
    capacity: 60,
    status: "Held",
    defaultLayout: "cocktail",
    layouts: [
      { key: "cocktail", cap: 60 },
      { key: "lounge", cap: 40 },
      { key: "banquet", cap: 32 },
    ],
  },
  {
    name: "Nobu Private Room",
    use: "Family dinner",
    setup: "Banquet · 4 rounds",
    capacity: 32,
    status: "Tentative",
    defaultLayout: "banquet",
    layouts: [
      { key: "banquet", cap: 32 },
      { key: "boardroom", cap: 22 },
      { key: "ushape", cap: 20 },
    ],
  },
  {
    name: "Foyer",
    use: "Cake & toasts",
    setup: "Standing",
    capacity: 40,
    status: "Pending",
    defaultLayout: "cocktail",
    layouts: [
      { key: "cocktail", cap: 40 },
      { key: "lounge", cap: 24 },
      { key: "theater", cap: 30 },
    ],
  },
];

const LAYOUT_LABEL: Record<LayoutKey, string> = {
  theater: "Theater",
  boardroom: "Boardroom",
  ushape: "U-Shape",
  banquet: "Banquet",
  cocktail: "Cocktail",
  classroom: "Classroom",
  lounge: "Lounge",
};

const STATUS_TONE: Record<SpaceStatus, string> = {
  Held: "bg-success-soft text-success",
  Tentative: "bg-warning-soft text-warning",
  Pending: "bg-brand-100 text-brand-700",
};

/* ---------------- Layout thumbnail ---------------- */

function LayoutThumb({ kind, active }: { kind: LayoutKey; active: boolean }) {
  const stroke = active ? "#7A4E8C" : "#9A9A9A";
  const fill = active ? "#7A4E8C" : "#C4C4C4";
  const dot = (cx: number, cy: number, r = 1.6) => <circle cx={cx} cy={cy} r={r} fill={fill} />;
  return (
    <svg viewBox="0 0 64 48" className="h-full w-full">
      <rect x="2" y="2" width="60" height="44" fill="none" stroke={stroke} strokeDasharray="2 2" strokeWidth="0.6" />
      {kind === "boardroom" && (
        <>
          <rect x="22" y="18" width="20" height="12" fill="none" stroke={stroke} strokeWidth="0.8" />
          {[24, 30, 36].map((x) => dot(x, 15))}
          {[24, 30, 36].map((x) => dot(x, 33))}
          {dot(19, 24)} {dot(45, 24)}
        </>
      )}
      {kind === "ushape" && (
        <>
          <path d="M18 14 L18 34 M18 14 L46 14 M46 14 L46 34" stroke={stroke} strokeWidth="0.8" fill="none" />
          {[20, 26, 32, 38, 44].map((x) => dot(x, 11))}
          {[15, 21, 27, 33].map((y) => dot(15, y))}
          {[15, 21, 27, 33].map((y) => dot(49, y))}
        </>
      )}
      {kind === "theater" && (
        <>
          {[14, 20, 26, 32, 38].map((y) =>
            [12, 18, 24, 30, 36, 42, 48].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.4} fill={fill} />),
          )}
          <rect x="22" y="6" width="20" height="3" fill={stroke} opacity="0.6" />
        </>
      )}
      {kind === "banquet" && (
        <>
          {[
            [18, 16],
            [46, 16],
            [18, 34],
            [46, 34],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="5" fill="none" stroke={stroke} strokeWidth="0.8" />
              {[0, 60, 120, 180, 240, 300].map((a) => {
                const rad = (a * Math.PI) / 180;
                return <circle key={a} cx={cx + Math.cos(rad) * 7} cy={cy + Math.sin(rad) * 7} r={1.2} fill={fill} />;
              })}
            </g>
          ))}
        </>
      )}
      {kind === "cocktail" && (
        <>
          {[
            [16, 16],
            [32, 14],
            [48, 18],
            [20, 30],
            [36, 32],
            [50, 34],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="2.4" fill="none" stroke={stroke} strokeWidth="0.7" />
              {dot(cx - 4, cy - 2, 1)}
              {dot(cx + 4, cy - 2, 1)}
              {dot(cx, cy + 4, 1)}
            </g>
          ))}
        </>
      )}
      {kind === "classroom" && (
        <>
          {[14, 22, 30, 38].map((y) => (
            <g key={y}>
              <rect x="10" y={y} width="18" height="3" fill="none" stroke={stroke} strokeWidth="0.7" />
              <rect x="36" y={y} width="18" height="3" fill="none" stroke={stroke} strokeWidth="0.7" />
              {[13, 19, 25].map((x) => dot(x, y + 5.5, 1.1))}
              {[39, 45, 51].map((x) => dot(x, y + 5.5, 1.1))}
            </g>
          ))}
        </>
      )}
      {kind === "lounge" && (
        <>
          <rect x="10" y="14" width="14" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="0.7" />
          <rect x="40" y="14" width="14" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="0.7" />
          <rect x="10" y="28" width="14" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="0.7" />
          <rect x="40" y="28" width="14" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="0.7" />
          <circle cx="32" cy="17" r="2" fill="none" stroke={stroke} strokeWidth="0.7" />
          <circle cx="32" cy="31" r="2" fill="none" stroke={stroke} strokeWidth="0.7" />
        </>
      )}
    </svg>
  );
}

/* ---------------- Layout builder (drag furniture) ---------------- */

type FurnitureKind = "round" | "rect" | "chair" | "lectern" | "bar";

const FURNITURE: { kind: FurnitureKind; label: string; w: number; h: number; round?: boolean }[] = [
  { kind: "round", label: "Round table", w: 56, h: 56, round: true },
  { kind: "rect", label: "Rect. table", w: 90, h: 36 },
  { kind: "chair", label: "Chair", w: 22, h: 22 },
  { kind: "lectern", label: "Lectern", w: 36, h: 24 },
  { kind: "bar", label: "Bar", w: 120, h: 28 },
];

type Placed = { id: string; kind: FurnitureKind; x: number; y: number };

function FurnitureGlyph({ kind }: { kind: FurnitureKind }) {
  if (kind === "round") return <div className="h-5 w-5 rounded-full border border-grey-900" />;
  if (kind === "rect") return <div className="h-3 w-6 border border-grey-900" />;
  if (kind === "chair") return <div className="h-3 w-3 border border-grey-900" />;
  if (kind === "lectern") return <div className="h-3 w-4 border border-grey-900 bg-grey-100" />;
  return <div className="h-2 w-6 border border-grey-900 bg-grey-100" />;
}

function LayoutBuilderDialog({
  open,
  onOpenChange,
  spaceName,
  capacity,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  spaceName: string;
  capacity: number;
}) {
  const [name, setName] = useState("Custom layout");
  const [items, setItems] = useState<Placed[]>([
    { id: "p1", kind: "lectern", x: 360, y: 40 },
    { id: "p2", kind: "round", x: 120, y: 140 },
    { id: "p3", kind: "round", x: 260, y: 140 },
    { id: "p4", kind: "round", x: 400, y: 140 },
    { id: "p5", kind: "round", x: 540, y: 140 },
  ]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const addItem = (kind: FurnitureKind) =>
    setItems((prev) => [
      ...prev,
      { id: `${Date.now()}`, kind, x: 320 + Math.random() * 40, y: 240 + Math.random() * 40 },
    ]);

  const onMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragId(id);
    setOffset({ dx: e.clientX - rect.left, dy: e.clientY - rect.top });
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragId) return;
    const canvas = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvas.left - offset.dx;
    const y = e.clientY - canvas.top - offset.dy;
    setItems((prev) => prev.map((it) => (it.id === dragId ? { ...it, x, y } : it)));
  };

  const stop = () => setDragId(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-white">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-grey-900">New layout · {spaceName}</DialogTitle>
          <DialogDescription className="text-grey-500">
            Drag furniture from the palette onto the floor. Move items by dragging them. Capacity guide:{" "}
            {capacity} guests.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[180px_1fr] gap-4">
          {/* Palette */}
          <div className="space-y-2">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-grey-500">Furniture</div>
            {FURNITURE.map((f) => (
              <button
                key={f.kind}
                onClick={() => addItem(f.kind)}
                className="flex w-full items-center gap-3 border border-grey-200 px-3 py-2 text-left hover:border-grey-900"
              >
                <div className="grid h-8 w-8 place-items-center bg-grey-50">
                  <FurnitureGlyph kind={f.kind} />
                </div>
                <span className="text-xs text-grey-900">{f.label}</span>
              </button>
            ))}

            <div className="pt-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-grey-500">Layout name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-grey-300 px-3 py-2 text-sm text-grey-900 focus:border-grey-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Canvas */}
          <div
            className="relative select-none overflow-hidden border border-grey-200 bg-grey-50"
            style={{
              height: 460,
              backgroundImage:
                "linear-gradient(#0000000d 1px, transparent 1px), linear-gradient(90deg, #0000000d 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            onMouseMove={onMouseMove}
            onMouseUp={stop}
            onMouseLeave={stop}
          >
            {items.map((it) => {
              const meta = FURNITURE.find((f) => f.kind === it.kind)!;
              return (
                <div
                  key={it.id}
                  onMouseDown={(e) => onMouseDown(e, it.id)}
                  className={cn(
                    "absolute cursor-move border border-grey-900 bg-white shadow-sm hover:ring-2 hover:ring-grey-900/20",
                    meta.round && "rounded-full",
                  )}
                  style={{ left: it.x, top: it.y, width: meta.w, height: meta.h }}
                >
                  <div className="grid h-full w-full place-items-center text-[9px] uppercase tracking-wider text-grey-600">
                    {meta.label.split(" ")[0]}
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.2em] text-grey-500">
              {items.length} items
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setItems([])}
            className="text-[11px] uppercase tracking-[0.2em] text-grey-500 hover:text-grey-900"
          >
            Clear floor
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-grey-300 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-grey-600 hover:border-grey-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success(`Saved "${name}" for ${spaceName}.`);
                onOpenChange(false);
              }}
              className="rounded-full bg-grey-900 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white hover:bg-grey-700"
            >
              Save layout
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Space card ---------------- */

function SpaceCard({ space }: { space: Space }) {
  const [selected, setSelected] = useState<Set<LayoutKey>>(new Set([space.defaultLayout]));
  const [builderOpen, setBuilderOpen] = useState(false);
  const toggle = (k: LayoutKey) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  return (
    <div className="group relative rounded-xl border border-grey-200 bg-white transition-colors hover:border-grey-300">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Left: identity + meta */}
        <div className="flex flex-col border-b border-grey-200 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-grey-500">{space.use}</div>
              <h3 className="mt-1 font-serif text-xl text-grey-900">{space.name}</h3>
            </div>
            <span
              className={cn(
                "inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]",
                STATUS_TONE[space.status],
              )}
            >
              {space.status}
            </span>
          </div>

          <dl className="mt-6 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-grey-500">Setup</dt>
              <dd className="text-right text-sm text-grey-900">{space.setup}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-grey-500">Capacity</dt>
              <dd className="text-sm text-grey-900">{space.capacity}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-grey-500">Layouts</dt>
              <dd className="text-sm text-grey-900">{space.layouts.length}</dd>
            </div>
          </dl>
        </div>

        {/* Right: layout options + CTA */}
        <div className="flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.25em] text-grey-500">Layout options</div>
            <button
              onClick={() => setBuilderOpen(true)}
              className="text-[11px] uppercase tracking-[0.2em] text-grey-500 hover:text-grey-900"
            >
              + Add layout
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {space.layouts.map((l) => {
              const isSel = selected.has(l.key);
              return (
                <button
                  key={l.key}
                  onClick={() => toggle(l.key)}
                  aria-pressed={isSel}
                  className={cn(
                    "border p-2.5 text-left transition-all",
                    isSel
                      ? "border-grey-900 bg-grey-900/[0.03] ring-1 ring-grey-900"
                      : "border-grey-200 hover:border-grey-400",
                  )}
                >
                  <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-brand-100/40">
                    <LayoutThumb kind={l.key} active={isSel} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="truncate text-[11px] font-medium text-grey-900">{LAYOUT_LABEL[l.key]}</span>
                    <span className="text-[10px] text-grey-500">{l.cap}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-end gap-4 border-t border-grey-200 pt-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-grey-500">
              {selected.size} selected
            </span>
            <button
              disabled={selected.size === 0}
              onClick={() => toast.success(`Added ${selected.size} layout option(s) for ${space.name}.`)}
              className="whitespace-nowrap rounded-full bg-grey-900 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white hover:bg-grey-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <LayoutBuilderDialog
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        spaceName={space.name}
        capacity={space.capacity}
      />
    </div>
  );
}

export default function Spaces() {
  return (
    <SocialPlanningShell activeStep="spaces">
      <div className="flex flex-col gap-5">
        {SPACES.map((s) => (
          <SpaceCard key={s.name} space={s} />
        ))}
      </div>
    </SocialPlanningShell>
  );
}

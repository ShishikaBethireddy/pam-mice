import { useState } from "react";
import { toast } from "sonner";
import PlanningWorkspace from "@/components/PlanningWorkspace";
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
    name: "Boardroom A",
    use: "Board meeting",
    setup: "Boardroom · 32",
    capacity: 36,
    status: "Held",
    defaultLayout: "boardroom",
    layouts: [
      { key: "boardroom", cap: 32 },
      { key: "ushape", cap: 24 },
      { key: "classroom", cap: 28 },
      { key: "theater", cap: 40 },
    ],
  },
  {
    name: "Sky Lounge",
    use: "Welcome reception",
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
    use: "Board dinner",
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
    use: "Coffee breaks",
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
  Pending: "bg-copper/10 text-copper",
};

/* ---------------- Layout thumbnail ---------------- */

function LayoutThumb({ kind, active }: { kind: LayoutKey; active: boolean }) {
  const stroke = active ? "#6F7E50" : "#948D80";
  const fill = active ? "#6F7E50" : "#C9C2B6";
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
  if (kind === "round") return <div className="h-5 w-5 rounded-full border border-ink" />;
  if (kind === "rect") return <div className="h-3 w-6 border border-ink" />;
  if (kind === "chair") return <div className="h-3 w-3 border border-ink" />;
  if (kind === "lectern") return <div className="h-3 w-4 border border-ink bg-cream" />;
  return <div className="h-2 w-6 border border-ink bg-cream" />;
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
      <DialogContent className="max-w-5xl bg-paper">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-ink">New layout · {spaceName}</DialogTitle>
          <DialogDescription className="text-ink-muted">
            Drag furniture from the palette onto the floor. Move items by dragging them. Capacity guide:{" "}
            {capacity} guests.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[180px_1fr] gap-4">
          {/* Palette */}
          <div className="space-y-2">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-ink-muted">Furniture</div>
            {FURNITURE.map((f) => (
              <button
                key={f.kind}
                onClick={() => addItem(f.kind)}
                className="flex w-full items-center gap-3 border border-border-subtle px-3 py-2 text-left hover:border-ink"
              >
                <div className="grid h-8 w-8 place-items-center bg-canvas">
                  <FurnitureGlyph kind={f.kind} />
                </div>
                <span className="text-xs text-ink">{f.label}</span>
              </button>
            ))}

            <div className="pt-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-ink-muted">Layout name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border-default px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          {/* Canvas */}
          <div
            className="relative select-none overflow-hidden border border-border-subtle bg-canvas"
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
                    "absolute cursor-move border border-ink bg-paper shadow-sm hover:ring-2 hover:ring-ink/20",
                    meta.round && "rounded-full",
                  )}
                  style={{ left: it.x, top: it.y, width: meta.w, height: meta.h }}
                >
                  <div className="grid h-full w-full place-items-center text-[9px] uppercase tracking-wider text-ink-soft">
                    {meta.label.split(" ")[0]}
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              {items.length} items
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setItems([])}
            className="text-[11px] uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
          >
            Clear floor
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-border-default px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ink-soft hover:border-ink"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success(`Saved "${name}" for ${spaceName}.`);
                onOpenChange(false);
              }}
              className="rounded-full bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-paper hover:bg-ink/90"
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
    <div className="group relative rounded-xl border border-border-subtle bg-paper shadow-card transition-colors hover:border-border-default">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Left: identity + meta */}
        <div className="flex flex-col border-b border-border-subtle p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">{space.use}</div>
              <h3 className="mt-1 font-serif text-xl text-ink">{space.name}</h3>
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
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">Setup</dt>
              <dd className="text-right text-sm text-ink">{space.setup}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">Capacity</dt>
              <dd className="text-sm text-ink">{space.capacity}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">Layouts</dt>
              <dd className="text-sm text-ink">{space.layouts.length}</dd>
            </div>
          </dl>
        </div>

        {/* Right: layout options + CTA */}
        <div className="flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">Layout options</div>
            <button
              onClick={() => setBuilderOpen(true)}
              className="text-[11px] uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
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
                      ? "border-ink bg-ink/[0.03] ring-1 ring-ink"
                      : "border-border-subtle hover:border-ink/40",
                  )}
                >
                  <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-copper/5">
                    <LayoutThumb kind={l.key} active={isSel} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="truncate text-[11px] font-medium text-ink">{LAYOUT_LABEL[l.key]}</span>
                    <span className="text-[10px] text-ink-muted">{l.cap}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-end gap-4 border-t border-border-subtle pt-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              {selected.size} selected
            </span>
            <button
              disabled={selected.size === 0}
              onClick={() => toast.success(`Sent ${selected.size} layout option(s) for ${space.name} to the client.`)}
              className="whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send to client
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
    <PlanningWorkspace activeStep="spaces">
      <div className="flex flex-col gap-5">
        {SPACES.map((s) => (
          <SpaceCard key={s.name} space={s} />
        ))}
      </div>
    </PlanningWorkspace>
  );
}

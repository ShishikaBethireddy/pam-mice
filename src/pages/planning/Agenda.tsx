import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Clock, Download, GripVertical, MapPin, Plus, Users } from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { eventDays, formatDayLong, useEventPlanning } from "@/lib/eventPlanning";
import { cn } from "@/lib/utils";

type AgendaType = "session" | "meal" | "break" | "social" | "transfer";

interface AgendaItem {
  id: string;
  start: string;
  end: string;
  title: string;
  location: string;
  type: AgendaType;
  attendees?: number;
  notes?: string;
}

const TYPE_META: Record<AgendaType, { label: string; bar: string; chip: string }> = {
  session: { label: "Session", bar: "bg-ink", chip: "bg-muted text-muted-foreground" },
  meal: { label: "Meal", bar: "bg-warning", chip: "bg-warning-soft text-warning" },
  break: { label: "Break", bar: "bg-success", chip: "bg-success-soft text-success" },
  social: { label: "Social", bar: "bg-copper", chip: "bg-copper/10 text-copper" },
  transfer: { label: "Transfer", bar: "bg-ink-muted", chip: "bg-muted text-ink-muted" },
};

const SEED_AGENDA: Record<number, AgendaItem[]> = {
  0: [
    { id: "a1", start: "15:00", end: "17:00", title: "Guest arrivals & check-in", location: "Lobby", type: "transfer", attendees: 24 },
    { id: "a2", start: "18:30", end: "19:45", title: "Welcome reception", location: "Sky Lounge", type: "social", attendees: 24, notes: "Champagne arrival, light canapés" },
    { id: "a3", start: "20:00", end: "22:00", title: "Informal dinner", location: "Nobu Restaurant", type: "meal", attendees: 24 },
  ],
  1: [
    { id: "b1", start: "07:30", end: "08:45", title: "Working breakfast", location: "Foyer", type: "meal", attendees: 24 },
    { id: "b2", start: "09:00", end: "12:00", title: "Board meeting · Session I", location: "Boardroom A", type: "session", attendees: 16, notes: "Q3 review + strategy" },
    { id: "b3", start: "12:30", end: "13:45", title: "Working lunch", location: "Boardroom A", type: "meal", attendees: 16 },
    { id: "b4", start: "14:00", end: "17:00", title: "Board meeting · Session II", location: "Boardroom A", type: "session", attendees: 16 },
    { id: "b5", start: "19:00", end: "22:00", title: "Board dinner · omakase", location: "Nobu Private Room", type: "meal", attendees: 16 },
  ],
};

function fmtTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

function durationLabel(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function AgendaCard({
  item,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  item: AgendaItem;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const meta = TYPE_META[item.type];
  const dur = durationLabel(item.start, item.end);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "group relative flex items-stretch rounded-lg border border-border-subtle bg-paper transition-all hover:border-border-default",
        isDragging && "opacity-40",
      )}
    >
      <div className={cn("w-1 shrink-0 rounded-l-lg", meta.bar)} />
      <button
        className="flex cursor-grab items-center px-2 text-ink-muted hover:text-ink active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex min-w-0 flex-1 items-start gap-5 py-4 pr-5">
        <div className="w-24 shrink-0 tabular-nums">
          <div className="text-sm font-medium text-ink">{fmtTime(item.start)}</div>
          <div className="text-[11px] text-ink-muted">to {fmtTime(item.end)}</div>
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-ink-muted">
            <Clock className="h-3 w-3" /> {dur}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]", meta.chip)}>
              {meta.label}
            </span>
            <h4 className="truncate text-sm font-medium text-ink">{item.title}</h4>
          </div>
          <div className="mt-1.5 flex items-center gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {item.location}
            </span>
            {item.attendees != null && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> {item.attendees}
              </span>
            )}
          </div>
          {item.notes && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.notes}</p>}
        </div>
        <button className="text-[10px] uppercase tracking-[0.2em] text-ink-muted opacity-0 transition-opacity hover:text-ink group-hover:opacity-100">
          Edit
        </button>
      </div>
    </div>
  );
}

export default function Agenda() {
  const { event } = useEventPlanning();
  const nights = Math.max(1, event.nights);
  const days = useMemo(
    () => eventDays(event.arrival, event.departure).slice(0, nights),
    [event, nights],
  );

  const [items, setItems] = useState<Record<number, AgendaItem[]>>(() => {
    const initial: Record<number, AgendaItem[]> = {};
    days.forEach((_, i) => (initial[i] = SEED_AGENDA[i] ?? []));
    return initial;
  });
  const [dragging, setDragging] = useState<{ id: string; from: number } | null>(null);
  const [hover, setHover] = useState<{ day: number; index: number } | null>(null);

  const move = (toDay: number, toIndex: number) => {
    if (!dragging) return;
    setItems((prev) => {
      const next: Record<number, AgendaItem[]> = { ...prev };
      const fromList = [...(next[dragging.from] ?? [])];
      const idx = fromList.findIndex((x) => x.id === dragging.id);
      if (idx === -1) return prev;
      const [moved] = fromList.splice(idx, 1);
      next[dragging.from] = fromList;
      const toList = dragging.from === toDay ? fromList : [...(next[toDay] ?? [])];
      let insertAt = toIndex;
      if (dragging.from === toDay && idx < toIndex) insertAt -= 1;
      toList.splice(insertAt, 0, moved);
      next[toDay] = toList;
      return next;
    });
    setDragging(null);
    setHover(null);
  };

  const action = (
    <button
      onClick={() => toast.success("Run-of-show exported to PDF.")}
      className="inline-flex items-center gap-2 rounded-full border border-border-default bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:border-ink"
    >
      <Download className="h-4 w-4" /> Export PDF
    </button>
  );

  return (
    <PlanningWorkspace activeStep="agenda" action={action}>
      <div className="space-y-6">
        {days.map((day, dayIdx) => {
          const list = items[dayIdx] ?? [];
          return (
            <section key={day} className="rounded-xl border border-border-subtle bg-paper shadow-card">
              <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">Day {dayIdx + 1}</div>
                  <h3 className="mt-0.5 text-base font-medium text-ink">{formatDayLong(day)}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted">
                    {list.length} {list.length === 1 ? "item" : "items"}
                  </span>
                  <button
                    onClick={() => toast("Add agenda item — coming soon.")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-default px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ink-soft hover:border-ink hover:text-ink"
                  >
                    <Plus className="h-3 w-3" /> Add item
                  </button>
                </div>
              </header>

              <div
                className="min-h-[120px] space-y-2 p-4"
                onDragOver={(e) => {
                  if (dragging) {
                    e.preventDefault();
                    if (list.length === 0) setHover({ day: dayIdx, index: 0 });
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging) move(dayIdx, hover?.day === dayIdx ? hover.index : list.length);
                }}
              >
                {list.length === 0 && (
                  <div className="border border-dashed border-border-default py-10 text-center text-xs text-ink-muted">
                    Drop items here or add a new one
                  </div>
                )}

                {list.map((it, i) => (
                  <div key={it.id}>
                    {hover?.day === dayIdx && hover.index === i && dragging && (
                      <div className="my-1 h-1 rounded bg-copper" />
                    )}
                    <AgendaCard
                      item={it}
                      isDragging={dragging?.id === it.id}
                      onDragStart={() => setDragging({ id: it.id, from: dayIdx })}
                      onDragEnd={() => {
                        setDragging(null);
                        setHover(null);
                      }}
                      onDragOver={(e) => {
                        if (!dragging) return;
                        e.preventDefault();
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const before = e.clientY < rect.top + rect.height / 2;
                        setHover({ day: dayIdx, index: before ? i : i + 1 });
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (!dragging) return;
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const before = e.clientY < rect.top + rect.height / 2;
                        move(dayIdx, before ? i : i + 1);
                      }}
                    />
                  </div>
                ))}
                {hover?.day === dayIdx && hover.index === list.length && dragging && list.length > 0 && (
                  <div className="my-1 h-1 rounded bg-copper" />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PlanningWorkspace>
  );
}

import { useState } from "react";
import { GripVertical, MapPin, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";

type ItinType = "session" | "social" | "meal" | "ceremony" | "activity" | "break" | "transfer";

type ItinItem = {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  type: ItinType;
  location: string;
  people?: number;
  notes?: string;
};

const TYPE_META: Record<ItinType, { label: string; bar: string; chip: string }> = {
  session: { label: "Session", bar: "bg-brand-300", chip: "bg-brand-100 text-brand-700" },
  social: { label: "Social", bar: "bg-brand-500", chip: "bg-brand-100 text-brand-700" },
  meal: { label: "Meal", bar: "bg-brand-700", chip: "bg-brand-100 text-brand-700" },
  ceremony: { label: "Ceremony", bar: "bg-brand-300", chip: "bg-brand-100 text-brand-700" },
  activity: { label: "Activity", bar: "bg-brand-500", chip: "bg-brand-100 text-brand-700" },
  break: { label: "Break", bar: "bg-brand-300", chip: "bg-brand-100 text-brand-700" },
  transfer: { label: "Transfer", bar: "bg-brand-700", chip: "bg-brand-100 text-brand-700" },
};

const ITIN_TYPES: ItinType[] = ["session", "social", "meal", "ceremony", "activity", "break", "transfer"];

const SEED_ITINERARY: ItinItem[] = [
  { id: "i1", day: 1, start: "18:00", end: "19:00", title: "Welcome cocktails", type: "social", location: "Garden terrace", people: 24 },
  { id: "i2", day: 1, start: "19:30", end: "21:00", title: "Dinner service", type: "meal", location: "Main ballroom", people: 24 },
  { id: "i3", day: 1, start: "21:00", end: "21:30", title: "Cake + toasts", type: "ceremony", location: "Main ballroom", people: 24 },
  { id: "i4", day: 2, start: "10:00", end: "12:00", title: "Farewell brunch", type: "meal", location: "Terrace", people: 24 },
];

type ItinForm = {
  title: string;
  type: ItinType;
  day: number;
  start: string;
  end: string;
  location: string;
  people: string;
  notes: string;
};

function fmtTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

function ItineraryModal({
  editing,
  defaultDay,
  onClose,
  onSave,
}: {
  editing: ItinItem | null;
  defaultDay: number;
  onClose: () => void;
  onSave: (data: Omit<ItinItem, "id">) => void;
}) {
  const [form, setForm] = useState<ItinForm>({
    title: editing?.title ?? "",
    type: editing?.type ?? "session",
    day: editing?.day ?? defaultDay,
    start: editing?.start ?? "09:00",
    end: editing?.end ?? "10:00",
    location: editing?.location ?? "",
    people: editing?.people != null ? String(editing.people) : "",
    notes: editing?.notes ?? "",
  });

  const set = <K extends keyof ItinForm>(k: K, v: ItinForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const fieldCls =
    "w-full border border-grey-300 bg-white px-3 py-2.5 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelCls = "text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500";

  const submit = () => {
    if (!form.title.trim()) return;
    onSave({
      title: form.title.trim(),
      type: form.type,
      day: Math.max(1, form.day),
      start: form.start,
      end: form.end,
      location: form.location.trim(),
      people: form.people.trim() ? Math.max(0, +form.people) : undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-xl flex-col bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between border-b border-grey-200 px-7 py-5">
          <div>
            <h3 className="font-serif text-2xl text-grey-900">{editing ? "Edit itinerary item" : "Add itinerary item"}</h3>
            <p className="mt-1 text-sm text-grey-600">Set the time, type, location, and any notes for this item.</p>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-7 py-6">
          <div>
            <label className={labelCls}>Title</label>
            <input autoFocus value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Welcome reception" className={`mt-1.5 ${fieldCls}`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value as ItinType)} className={`mt-1.5 ${fieldCls}`}>
                {ITIN_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Day</label>
              <input type="number" min={1} value={form.day} onChange={(e) => set("day", Math.max(1, +e.target.value || 1))} className={`mt-1.5 ${fieldCls}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start time</label>
              <input type="time" value={form.start} onChange={(e) => set("start", e.target.value)} className={`mt-1.5 ${fieldCls}`} />
            </div>
            <div>
              <label className={labelCls}>End time</label>
              <input type="time" value={form.end} onChange={(e) => set("end", e.target.value)} className={`mt-1.5 ${fieldCls}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Location</label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Garden terrace" className={`mt-1.5 ${fieldCls}`} />
            </div>
            <div>
              <label className={labelCls}>People</label>
              <input type="number" min={0} value={form.people} onChange={(e) => set("people", e.target.value)} placeholder="optional" className={`mt-1.5 ${fieldCls}`} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything the team should know" rows={3} className={`mt-1.5 resize-y ${fieldCls}`} />
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-200 px-7 py-5">
          <button onClick={onClose} className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50">
            Cancel
          </button>
          <button onClick={submit} disabled={!form.title.trim()} className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-grey-700 disabled:opacity-40">
            {editing ? "Save changes" : "Add to itinerary"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Itinerary() {
  const [items, setItems] = useState<ItinItem[]>(SEED_ITINERARY);
  const [activeDay, setActiveDay] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [defaultDay, setDefaultDay] = useState(1);
  const [dragId, setDragId] = useState<string | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const maxDay = Math.max(1, ...items.map((i) => i.day));
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const dayItems = items.filter((i) => i.day === activeDay);

  const editing = editId ? items.find((i) => i.id === editId) ?? null : null;

  const openAdd = (day: number) => {
    setEditId(null);
    setDefaultDay(day);
    setModalOpen(true);
  };
  const openEdit = (item: ItinItem) => {
    setEditId(item.id);
    setModalOpen(true);
  };
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const save = (data: Omit<ItinItem, "id">) => {
    if (editId) {
      setItems((prev) => prev.map((i) => (i.id === editId ? { ...i, ...data } : i)));
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
    }
    setActiveDay(data.day);
    setModalOpen(false);
  };

  const reorder = (fromId: string, toIndex: number) => {
    setItems((prev) => {
      const dayArr = prev.filter((i) => i.day === activeDay);
      const others = prev.filter((i) => i.day !== activeDay);
      const fromIdx = dayArr.findIndex((i) => i.id === fromId);
      if (fromIdx === -1) return prev;
      const [moved] = dayArr.splice(fromIdx, 1);
      let insert = toIndex;
      if (fromIdx < toIndex) insert -= 1;
      dayArr.splice(insert, 0, moved);
      return [...others, ...dayArr];
    });
    setDragId(null);
    setHoverIdx(null);
  };

  return (
    <SocialPlanningShell activeStep="itinerary">
      <div className="space-y-5">
        <div className="flex items-center gap-6 overflow-x-auto border-b border-grey-200">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                activeDay === d ? "border-grey-900 text-grey-900" : "border-transparent text-grey-500 hover:text-grey-800"
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-grey-900">Day {activeDay}</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-grey-500">{dayItems.length} {dayItems.length === 1 ? "item" : "items"}</span>
            <button
              onClick={() => openAdd(activeDay)}
              className="inline-flex items-center gap-1.5 rounded-full border border-grey-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-grey-800 hover:bg-grey-50"
            >
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {dayItems.length === 0 ? (
            <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
              Nothing scheduled for this day add an item.
            </p>
          ) : (
            dayItems.map((it, i) => {
              const meta = TYPE_META[it.type];
              return (
                <div key={it.id}>
                  {hoverIdx === i && dragId && <div className="my-1 h-0.5 rounded bg-grey-900" />}
                  <div
                    draggable
                    onDragStart={() => setDragId(it.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setHoverIdx(null);
                    }}
                    onDragOver={(e) => {
                      if (!dragId) return;
                      e.preventDefault();
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setHoverIdx(e.clientY < rect.top + rect.height / 2 ? i : i + 1);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!dragId) return;
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      reorder(dragId, e.clientY < rect.top + rect.height / 2 ? i : i + 1);
                    }}
                    className={`group relative flex items-stretch border border-grey-200 bg-white transition-all hover:border-grey-400 ${
                      dragId === it.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className={`w-1.5 shrink-0 ${meta.bar}`} />
                    <span className="flex cursor-grab items-center px-2 text-grey-300 hover:text-grey-600 active:cursor-grabbing">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 items-center gap-4 py-4 pr-4">
                      <div className="w-28 shrink-0 text-sm tabular-nums">
                        <span className="font-medium text-grey-900">{fmtTime(it.start)}</span>{" "}
                        <span className="text-grey-500">to {fmtTime(it.end)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-grey-900">{it.title}</h4>
                          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${meta.chip}`}>{meta.label}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-grey-500">
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {it.location}</span>
                          {it.people != null && <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {it.people}</span>}
                        </div>
                        {it.notes && <p className="mt-1.5 text-xs leading-relaxed text-grey-600">{it.notes}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(it)}
                          className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-grey-100 hover:text-grey-900"
                          aria-label="Edit item"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {hoverIdx === dayItems.length && dragId && dayItems.length > 0 && <div className="my-1 h-0.5 rounded bg-grey-900" />}
        </div>

        <button
          onClick={() => openAdd(maxDay + 1)}
          className="flex w-full items-center justify-center gap-2 border border-dashed border-grey-300 py-5 text-sm font-medium text-grey-600 transition-colors hover:border-grey-400 hover:bg-grey-50"
        >
          <Plus className="h-4 w-4" /> Add a new day
        </button>

        {modalOpen && (
          <ItineraryModal editing={editing} defaultDay={defaultDay} onClose={() => setModalOpen(false)} onSave={save} />
        )}
      </div>
    </SocialPlanningShell>
  );
}

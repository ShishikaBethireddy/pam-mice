import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coffee,
  Minus,
  Pencil,
  Plus,
  ShowerHead,
  Snowflake,
  Trash2,
  Tv,
  Wifi,
  X,
} from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import { useSocialCtx } from "@/lib/socialPlanning";
import { currency } from "@/data/mockData";

type RoomType = {
  id: string;
  name: string;
  price: number;
  sqm: number;
  bed: string;
  sleeps: number;
  feature: string;
  desc: string;
  amenities: string[];
  image: string;
};

const ROOM_TYPES: RoomType[] = [
  {
    id: "deluxe-king",
    name: "Deluxe King",
    price: 420,
    sqm: 42,
    bed: "1 King",
    sleeps: 2,
    feature: "Skyline views",
    desc: "Our signature room with a king bed, sitting area, and skyline views.",
    amenities: ["WiFi", "Rainfall shower", "Espresso bar", "Climate control", '55" Smart TV'],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "garden-suite",
    name: "Garden Suite",
    price: 620,
    sqm: 68,
    bed: "1 King + sofa",
    sleeps: 2,
    feature: "Garden terrace",
    desc: "Spacious suite opening to a private garden terrace perfect for VIPs.",
    amenities: ["WiFi", "Rainfall shower", "Espresso bar", "Private terrace", '55" Smart TV'],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "double-queen",
    name: "Double Queen",
    price: 380,
    sqm: 46,
    bed: "2 Queens",
    sleeps: 4,
    feature: "Family friendly",
    desc: "Two queen beds great for families and friends sharing a room.",
    amenities: ["WiFi", "Rainfall shower", "Mini bar", "Climate control", '55" Smart TV'],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "ocean-suite",
    name: "Ocean Suite",
    price: 880,
    sqm: 92,
    bed: "1 King + daybed",
    sleeps: 3,
    feature: "Ocean views",
    desc: "Top-floor suite with floor-to-ceiling windows and panoramic ocean views.",
    amenities: ["WiFi", "Rainfall shower", "Espresso bar", "Climate control", "Ocean-view soaking tub"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=60",
  },
];

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  "Rainfall shower": ShowerHead,
  "Espresso bar": Coffee,
  "Climate control": Snowflake,
  '55" Smart TV': Tv,
};

type Allocation = { id: string; roomTypeId: string; rooms: number; nights: number };

const roomById = (id: string) => ROOM_TYPES.find((r) => r.id === id) ?? ROOM_TYPES[0];

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(min, v));
  return (
    <div className="border border-grey-200 bg-white p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">{label}</div>
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => set(value - 1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-grey-300 text-grey-600 hover:bg-grey-50"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-serif text-3xl text-grey-900 tabular-nums">{value}</span>
          <span className="flex flex-col">
            <button onClick={() => set(value + 1)} className="text-grey-400 hover:text-grey-900" aria-label={`Increase ${label}`}>
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => set(value - 1)} className="text-grey-400 hover:text-grey-900" aria-label={`Decrease ${label}`}>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
        <button
          onClick={() => set(value + 1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-grey-300 text-grey-600 hover:bg-grey-50"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function RoomAllocationModal({
  editing,
  onClose,
  onSave,
}: {
  editing: Allocation | null;
  onClose: () => void;
  onSave: (data: { roomTypeId: string; rooms: number; nights: number }) => void;
}) {
  const [roomTypeId, setRoomTypeId] = useState(editing?.roomTypeId ?? ROOM_TYPES[0].id);
  const [rooms, setRooms] = useState(editing?.rooms ?? 5);
  const [nights, setNights] = useState(editing?.nights ?? 2);
  const selected = roomById(roomTypeId);
  const subtotal = selected.price * rooms * nights;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between border-b border-grey-200 px-7 py-5">
          <div>
            <h3 className="font-serif text-2xl text-grey-900">{editing ? "Edit room allocation" : "Add room allocation"}</h3>
            <p className="mt-1 text-sm text-grey-600">Pick a room type, then choose how many rooms and nights you need.</p>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">Room type</div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {ROOM_TYPES.map((rt) => {
                const isSel = rt.id === roomTypeId;
                return (
                  <button
                    key={rt.id}
                    onClick={() => setRoomTypeId(rt.id)}
                    className={`overflow-hidden border text-left transition-colors ${
                      isSel ? "border-accent ring-1 ring-accent" : "border-grey-200 hover:border-grey-300"
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-grey-100">
                      <img src={rt.image} alt={rt.name} className="h-full w-full object-cover" loading="lazy" />
                      {isSel && (
                        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-grey-900/90 px-2.5 py-1 text-[10px] font-medium text-white">
                          <CheckCircle2 className="h-3 w-3" /> Selected
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-serif text-lg text-grey-900">{rt.name}</div>
                        <div className="text-right">
                          <div className="font-serif text-lg text-grey-900">{currency(rt.price)}</div>
                          <div className="text-[10px] text-grey-500">/ night</div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-grey-500">{rt.sqm} sqm · {rt.bed} · sleeps {rt.sleeps}</div>
                      <p className="mt-2 text-xs leading-relaxed text-grey-600">{rt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-grey-200 bg-grey-50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">What's included</div>
            <div className="mt-1 font-serif text-lg text-grey-900">{selected.name}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.amenities.map((am) => {
                const Icon = AMENITY_ICONS[am] ?? CheckCircle2;
                return (
                  <span key={am} className="inline-flex items-center gap-1.5 rounded-full border border-grey-300 bg-white px-3 py-1.5 text-xs text-grey-700">
                    <Icon className="h-3.5 w-3.5 text-grey-500" /> {am}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stepper label="Rooms" value={rooms} min={1} onChange={setRooms} />
            <Stepper label="Nights" value={nights} min={1} onChange={setNights} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border border-grey-200 bg-white p-5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">This allocation</div>
              <div className="mt-1 text-sm text-grey-800">{rooms} × {selected.name} · {nights} {nights === 1 ? "night" : "nights"}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">Subtotal</div>
              <div className="mt-1 font-serif text-2xl text-grey-900">{currency(subtotal)}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-200 px-7 py-5">
          <button onClick={onClose} className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({ roomTypeId, rooms, nights })}
            className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-grey-700"
          >
            {editing ? "Save allocation" : "Add to block"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoomAllocation() {
  const ctx = useSocialCtx();
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: "al1", roomTypeId: "garden-suite", rooms: 5, nights: Math.max(2, ctx.nights) },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const subtotalOf = (a: Allocation) => roomById(a.roomTypeId).price * a.rooms * a.nights;
  const sleepsOf = (a: Allocation) => roomById(a.roomTypeId).sleeps * a.rooms;
  const totalRooms = allocations.reduce((s, a) => s + a.rooms, 0);
  const totalSleeps = allocations.reduce((s, a) => s + sleepsOf(a), 0);
  const estimated = allocations.reduce((s, a) => s + subtotalOf(a), 0);
  const capacity = ctx.headcount;
  const pct = capacity ? Math.min(100, Math.round((totalSleeps / capacity) * 100)) : 0;

  const editing = editId ? allocations.find((a) => a.id === editId) ?? null : null;

  const openAdd = () => {
    setEditId(null);
    setModalOpen(true);
  };
  const openEdit = (id: string) => {
    setEditId(id);
    setModalOpen(true);
  };
  const remove = (id: string) => setAllocations((prev) => prev.filter((a) => a.id !== id));
  const upsert = (data: { roomTypeId: string; rooms: number; nights: number }) => {
    if (editId) {
      setAllocations((prev) => prev.map((a) => (a.id === editId ? { ...a, ...data } : a)));
    } else {
      setAllocations((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
    }
    setModalOpen(false);
  };

  return (
    <SocialPlanningShell activeStep="rooms">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Room allocation</p>
            <h2 className="mt-1 font-serif text-3xl text-grey-900">Room allocations</h2>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-grey-700"
          >
            <Plus className="h-4 w-4" /> Add allocation
          </button>
        </div>

        <div className="border border-grey-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Allocated</p>
              <div className="mt-1 font-serif text-3xl text-grey-900">
                {totalRooms} {totalRooms === 1 ? "room" : "rooms"}{" "}
                <span className="text-lg text-grey-500">· sleeps {totalSleeps} of {capacity}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Estimated</p>
              <div className="mt-1 font-serif text-3xl text-grey-900">{currency(estimated)}</div>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
            <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {allocations.length === 0 ? (
          <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
            No rooms allocated yet add your first allocation.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {allocations.map((a) => {
              const rt = roomById(a.roomTypeId);
              return (
                <div key={a.id} className="overflow-hidden border border-grey-200 bg-white">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-grey-100">
                    <img src={rt.image} alt={rt.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl text-grey-900">{rt.name}</h3>
                        <div className="mt-1 text-xs text-grey-500">
                          {rt.bed} · sleeps {rt.sleeps} · {rt.feature}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-xl text-grey-900">{currency(subtotalOf(a))}</div>
                        <div className="text-xs text-grey-500">{currency(rt.price)}/night</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-grey-100 pt-3">
                      <div className="flex flex-wrap gap-2">
                        {[`${a.rooms} rooms`, `${a.nights} nights`, `sleeps ${sleepsOf(a)}`].map((chip) => (
                          <span key={chip} className="rounded-full border border-grey-300 px-3 py-1 text-[11px] text-grey-600">
                            {chip}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(a.id)}
                          className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-grey-100 hover:text-grey-900"
                          aria-label="Edit allocation"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(a.id)}
                          className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Remove allocation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {modalOpen && (
          <RoomAllocationModal editing={editing} onClose={() => setModalOpen(false)} onSave={upsert} />
        )}
      </div>
    </SocialPlanningShell>
  );
}

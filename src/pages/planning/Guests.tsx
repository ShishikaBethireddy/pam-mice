import { useState } from "react";
import {
  BedDouble,
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import SocialPlanningShell from "@/components/SocialPlanningShell";
import { useSocialCtx } from "@/lib/socialPlanning";

type Rsvp = "yes" | "no" | "pending";

type Party = {
  id: string;
  name: string;
  email: string;
  partySize: number;
  inRoomBlock: boolean;
  invited: boolean;
  rsvp: Rsvp;
};

const SEED_PARTIES: Party[] = [
  { id: "g1", name: "Avery & Jordan Chen", email: "avery.chen@example.com", partySize: 2, inRoomBlock: true, invited: true, rsvp: "yes" },
  { id: "g2", name: "Marcus Hill", email: "marcus.hill@example.com", partySize: 1, inRoomBlock: false, invited: true, rsvp: "yes" },
  { id: "g3", name: "Priya Shah +1", email: "priya.shah@example.com", partySize: 2, inRoomBlock: true, invited: true, rsvp: "pending" },
  { id: "g4", name: "The Okafor family", email: "okafor@example.com", partySize: 4, inRoomBlock: true, invited: false, rsvp: "pending" },
];

const fmtShort = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

type PartyForm = { name: string; email: string; partySize: number; inRoomBlock: boolean };
const EMPTY_FORM: PartyForm = { name: "", email: "", partySize: 1, inRoomBlock: false };

function StatusTag({ party }: { party: Party }) {
  const { invited, rsvp } = party;
  let label = "Not sent";
  let cls = "bg-rose-50 text-rose-600";
  if (rsvp === "yes") {
    label = "Attending";
    cls = "bg-emerald-50 text-emerald-700";
  } else if (rsvp === "no") {
    label = "Declined";
    cls = "bg-grey-100 text-grey-600";
  } else if (invited) {
    label = "Invited";
    cls = "bg-brand-100 text-brand-700";
  }
  return <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${cls}`}>{label}</span>;
}

function PartyModal({
  isEdit,
  form,
  setForm,
  onClose,
  onSave,
}: {
  isEdit: boolean;
  form: PartyForm;
  setForm: React.Dispatch<React.SetStateAction<PartyForm>>;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between border-b border-grey-200 px-7 py-5">
          <h3 className="font-serif text-2xl text-grey-900">{isEdit ? "Edit party" : "Add party"}</h3>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-7 py-6">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Guest name</label>
            <div className="relative mt-1.5">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="w-full border border-grey-300 bg-white px-3 py-2.5 pr-10 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 text-grey-400">
                <UserRound className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="name@example.com"
              className="mt-1.5 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Party size</label>
              <input
                type="number"
                min={1}
                value={form.partySize}
                onChange={(e) => setForm((f) => ({ ...f, partySize: Math.max(1, +e.target.value || 1) }))}
                className="mt-1.5 w-28 border border-grey-300 bg-white px-3 py-2.5 text-sm text-grey-900 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <label className="flex items-center gap-2 pb-2.5 text-sm text-grey-800">
              <input
                type="checkbox"
                checked={form.inRoomBlock}
                onChange={(e) => setForm((f) => ({ ...f, inRoomBlock: e.target.checked }))}
                className="h-4 w-4 accent-[hsl(var(--brand-500))]"
              />
              Staying in room block
            </label>
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-200 px-7 py-5">
          <button onClick={onClose} className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!form.name.trim()}
            className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-grey-700 disabled:opacity-40"
          >
            Save party
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Guests() {
  const ctx = useSocialCtx();
  const [parties, setParties] = useState<Party[]>(SEED_PARTIES);
  const [filter, setFilter] = useState<"all" | "yes" | "pending">("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PartyForm>(EMPTY_FORM);

  const arrival = new Date(ctx.arrival);
  const depart = new Date(arrival);
  depart.setDate(depart.getDate() + Math.max(1, ctx.nights));

  const sum = (pred: (p: Party) => boolean) => parties.filter(pred).reduce((s, p) => s + p.partySize, 0);
  const totalGuests = sum(() => true);
  const invitedGuests = sum((p) => p.invited);
  const attendingGuests = sum((p) => p.rsvp === "yes");
  const pendingGuests = sum((p) => p.invited && p.rsvp === "pending");
  const notInvitedGuests = sum((p) => !p.invited);

  const filtered = parties.filter((p) => {
    const matchesFilter =
      filter === "all" ? true : filter === "yes" ? p.rsvp === "yes" : p.invited && p.rsvp === "pending";
    const matchesQuery =
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };
  const openEdit = (p: Party) => {
    setEditId(p.id);
    setForm({ name: p.name, email: p.email, partySize: p.partySize, inRoomBlock: p.inRoomBlock });
    setModalOpen(true);
  };
  const save = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setParties((prev) => prev.map((p) => (p.id === editId ? { ...p, ...form } : p)));
    } else {
      setParties((prev) => [...prev, { id: crypto.randomUUID(), ...form, invited: false, rsvp: "pending" }]);
    }
    setModalOpen(false);
  };
  const remove = (id: string) => setParties((prev) => prev.filter((p) => p.id !== id));
  const sendInvite = (id: string) => setParties((prev) => prev.map((p) => (p.id === id ? { ...p, invited: true } : p)));
  const setRsvp = (id: string, rsvp: Rsvp) => setParties((prev) => prev.map((p) => (p.id === id ? { ...p, rsvp } : p)));

  return (
    <SocialPlanningShell activeStep="guests">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Guest list</p>
            <h2 className="mt-1 font-serif text-3xl text-grey-900">Who's coming</h2>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-grey-700"
          >
            <Plus className="h-4 w-4" /> Add party
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-grey-200 border border-grey-200 bg-white">
          {[
            { label: "Attending", num: attendingGuests, den: invitedGuests },
            { label: "Pending", num: pendingGuests, den: invitedGuests },
            { label: "Not invited", num: notInvitedGuests, den: totalGuests },
          ].map((t) => (
            <div key={t.label} className="px-4 py-6 text-center">
              <div className="font-serif text-4xl text-grey-900">
                {t.num} <span className="text-2xl text-grey-400">/ {t.den}</span>
              </div>
              <div className="mt-2 text-xs text-grey-500">{t.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {([
              ["all", "All"],
              ["yes", "Attending"],
              ["pending", "Pending"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  filter === key ? "bg-grey-900 text-white" : "border border-grey-300 text-grey-600 hover:bg-grey-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-grey-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-56 max-w-full rounded-full border border-grey-300 bg-white py-2 pl-9 pr-3 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
            No guests in this view yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p) => (
              <div key={p.id} className="border border-grey-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-grey-900">{p.name}</span>
                  <StatusTag party={p} />
                </div>
                <div className="mt-1 text-sm text-grey-500">{p.email}</div>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-grey-600">
                  {p.inRoomBlock ? (
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5 text-grey-400" />
                      Staying · {p.partySize} {p.partySize === 1 ? "guest" : "guests"} · {fmtShort(arrival)} → {fmtShort(depart)}
                    </span>
                  ) : (
                    <span>{p.partySize} {p.partySize === 1 ? "guest" : "guests"}</span>
                  )}
                  {p.inRoomBlock && (
                    <span className="inline-block bg-brand-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-brand-700">
                      Room block pending
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-grey-100 pt-3">
                  {p.invited ? (
                    <select
                      value={p.rsvp}
                      onChange={(e) => setRsvp(p.id, e.target.value as Rsvp)}
                      className="rounded-md border border-grey-200 bg-white px-2 py-1.5 text-xs text-grey-800 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="yes">Attending</option>
                      <option value="no">Declined</option>
                    </select>
                  ) : (
                    <button
                      onClick={() => sendInvite(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-grey-900 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition hover:bg-grey-700"
                    >
                      <Send className="h-3 w-3" /> Send invite
                    </button>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-grey-100 hover:text-grey-900"
                      aria-label="Edit party"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Remove party"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <PartyModal
            isEdit={!!editId}
            form={form}
            setForm={setForm}
            onClose={() => setModalOpen(false)}
            onSave={save}
          />
        )}
      </div>
    </SocialPlanningShell>
  );
}

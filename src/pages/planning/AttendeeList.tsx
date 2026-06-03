import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Minus,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { AttendeeStatusPill, DietaryTag, GuestAvatar } from "@/components/planning/PlanningBits";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DIETARY_OPTIONS,
  dietaryBreakdown,
  summarize,
  useEventPlanning,
  parseAttendeesCsv,
  CSV_TEMPLATE,
  type Attendee,
  type AttendeeStatus,
  type Dietary,
  type NewAttendee,
} from "@/lib/eventPlanning";
import { fmtShortDate } from "@/data/mockData";
import { cn } from "@/lib/utils";

const STATUSES: AttendeeStatus[] = ["Confirmed", "Hold", "Pending", "Declined"];

/* ------------------------------------------------------------------ */

function SummaryChips() {
  const { attendees } = useEventPlanning();
  const s = summarize(attendees);
  const diets = dietaryBreakdown(attendees);

  const stat = (label: string, value: string | number, accent?: boolean) => (
    <div className="rounded-xl border border-border-subtle bg-paper px-4 py-3 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
      <p className={cn("mt-1 font-serif text-2xl", accent ? "text-copper" : "text-ink")}>{value}</p>
    </div>
  );

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stat("Attendees", s.total)}
      {stat("Total guests", s.totalGuests)}
      {stat("Confirmed", s.confirmed, true)}
      {stat("Pending", s.pending)}
      <div className="col-span-2 rounded-xl border border-border-subtle bg-paper px-4 py-3 shadow-card sm:col-span-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Dietary breakdown
        </p>
        {diets.length ? (
          <div className="flex flex-wrap gap-1.5">
            {diets.map((d) => (
              <DietaryTag key={d.diet} diet={d.diet} label={`${d.diet} · ${d.count}`} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No dietary requirements recorded yet.</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PartyStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border-default bg-paper">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid h-7 w-7 place-items-center rounded-full text-ink-soft hover:text-ink disabled:opacity-40"
        disabled={value <= 1}
        aria-label="Decrease party size"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-6 text-center text-sm tabular-nums text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-7 w-7 place-items-center rounded-full text-ink-soft hover:text-ink"
        aria-label="Increase party size"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function field(label: string, control: React.ReactNode) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </span>
      {control}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-border-default bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none";

function blankAttendee(company: string, arrival: string, departure: string): NewAttendee {
  return {
    fullName: "",
    email: "",
    phone: "",
    company,
    role: "",
    vip: false,
    status: "Pending",
    partySize: 1,
    dietary: [],
    arrival,
    departure,
    notes: "",
    roomTypeId: null,
  };
}

function AttendeeDrawer({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Attendee | null;
}) {
  const { event, addAttendee, updateAttendee, deleteAttendee } = useEventPlanning();
  const [draft, setDraft] = useState<NewAttendee>(() =>
    editing ?? blankAttendee(event.client, event.arrival, event.departure),
  );

  // resync when the target changes
  const [trackId, setTrackId] = useState<string | null>(editing?.id ?? null);
  if (open && (editing?.id ?? null) !== trackId) {
    setTrackId(editing?.id ?? null);
    setDraft(editing ?? blankAttendee(event.client, event.arrival, event.departure));
  }

  const set = (patch: Partial<NewAttendee>) => setDraft((d) => ({ ...d, ...patch }));

  const toggleDiet = (diet: Dietary) =>
    setDraft((d) => ({
      ...d,
      dietary: d.dietary.includes(diet)
        ? d.dietary.filter((x) => x !== diet)
        : [...d.dietary, diet],
    }));

  const save = () => {
    if (!draft.fullName.trim()) {
      toast.error("Add a name before saving.");
      return;
    }
    if (editing) {
      updateAttendee(editing.id, draft);
      toast.success(`Updated ${draft.fullName}.`);
    } else {
      addAttendee(draft);
      toast.success(`Added ${draft.fullName} to the roster.`);
    }
    onOpenChange(false);
  };

  const remove = () => {
    if (editing) {
      deleteAttendee(editing.id);
      toast.success(`Removed ${editing.fullName}.`);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto bg-canvas p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border-subtle bg-paper px-6 py-5 text-left">
          <SheetTitle className="font-serif text-2xl text-ink">
            {editing ? "Edit attendee" : "Add attendee"}
          </SheetTitle>
          <SheetDescription className="text-ink-muted">
            This roster is the single source of truth — room and F&amp;B planning update automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 px-6 py-6">
          {field(
            "Full name",
            <input
              className={inputCls}
              value={draft.fullName}
              onChange={(e) => set({ fullName: e.target.value })}
              placeholder="e.g. Avery Chen"
            />,
          )}
          <div className="grid grid-cols-2 gap-3">
            {field(
              "Email",
              <input
                className={inputCls}
                type="email"
                value={draft.email}
                onChange={(e) => set({ email: e.target.value })}
              />,
            )}
            {field(
              "Phone",
              <input
                className={inputCls}
                value={draft.phone}
                onChange={(e) => set({ phone: e.target.value })}
              />,
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field(
              "Company",
              <input
                className={inputCls}
                value={draft.company}
                onChange={(e) => set({ company: e.target.value })}
              />,
            )}
            {field(
              "Role / title",
              <input
                className={inputCls}
                value={draft.role}
                onChange={(e) => set({ role: e.target.value })}
              />,
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field(
              "Status",
              <select
                className={inputCls}
                value={draft.status}
                onChange={(e) => set({ status: e.target.value as AttendeeStatus })}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>,
            )}
            {field(
              "Party size",
              <div className="pt-1">
                <PartyStepper value={draft.partySize} onChange={(n) => set({ partySize: n })} />
              </div>,
            )}
          </div>

          <button
            type="button"
            onClick={() => set({ vip: !draft.vip })}
            aria-pressed={draft.vip}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              draft.vip
                ? "border-copper bg-copper/10 text-copper"
                : "border-border-default bg-paper text-ink-soft hover:border-ink",
            )}
          >
            <Star className={cn("h-3.5 w-3.5", draft.vip && "fill-current")} /> VIP guest
          </button>

          {field(
            "Dietary preferences",
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map((diet) => {
                const on = draft.dietary.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDiet(diet)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition-colors",
                      on
                        ? "border-copper bg-copper text-paper"
                        : "border-border-default bg-paper text-ink-soft hover:border-ink",
                    )}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>,
          )}

          {draft.dietary.includes("Other") &&
            field(
              "Other dietary note",
              <input
                className={inputCls}
                value={draft.dietaryOther ?? ""}
                onChange={(e) => set({ dietaryOther: e.target.value })}
                placeholder="Describe the requirement"
              />,
            )}

          <div className="grid grid-cols-2 gap-3">
            {field(
              "Arrival",
              <input
                className={inputCls}
                type="date"
                value={draft.arrival}
                onChange={(e) => set({ arrival: e.target.value })}
              />,
            )}
            {field(
              "Departure",
              <input
                className={inputCls}
                type="date"
                value={draft.departure}
                onChange={(e) => set({ departure: e.target.value })}
              />,
            )}
          </div>

          {field(
            "Notes",
            <textarea
              className={cn(inputCls, "min-h-[72px] resize-none")}
              value={draft.notes ?? ""}
              onChange={(e) => set({ notes: e.target.value })}
              placeholder="Travel, accessibility, seating…"
            />,
          )}
        </div>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t border-border-subtle bg-paper px-6 py-4">
          {editing ? (
            <button
              onClick={remove}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive hover:underline"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-border-default px-4 py-2 text-sm text-ink-soft hover:border-ink"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink/90"
            >
              {editing ? "Save changes" : "Add attendee"}
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */

function ImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { event, importAttendees } = useEventPlanning();
  const [text, setText] = useState("");

  const doImport = () => {
    const parsed = parseAttendeesCsv(text, event);
    if (!parsed.length) {
      toast.error("No rows found. Check the CSV format.");
      return;
    }
    importAttendees(parsed);
    toast.success(`Imported ${parsed.length} attendee${parsed.length === 1 ? "" : "s"}.`);
    setText("");
    onOpenChange(false);
  };

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-canvas">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-ink">Import attendees</DialogTitle>
          <DialogDescription className="text-ink-muted">
            Paste CSV rows or upload a file. Columns: Full name, Email, Phone, Company, Role, Status,
            Party size, Dietary, VIP, Arrival, Departure, Notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-default bg-paper px-3 py-1.5 text-xs text-ink-soft hover:border-ink">
              <Upload className="h-3.5 w-3.5" /> Choose .csv file
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            <button
              onClick={() => setText(CSV_TEMPLATE)}
              className="text-xs font-medium text-copper hover:underline"
            >
              Load sample template
            </button>
          </div>
          <textarea
            className={cn(inputCls, "min-h-[180px] font-mono text-xs")}
            placeholder={CSV_TEMPLATE}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-border-default px-4 py-2 text-sm text-ink-soft hover:border-ink"
          >
            Cancel
          </button>
          <button
            onClick={doImport}
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Import
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */

export default function AttendeeList() {
  const { attendees, updateAttendee } = useEventPlanning();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dietFilter, setDietFilter] = useState("all");
  const [vipOnly, setVipOnly] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Attendee | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const companies = useMemo(
    () => Array.from(new Set(attendees.map((a) => a.company))).sort(),
    [attendees],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attendees.filter((a) => {
      if (q && ![a.fullName, a.email, a.company, a.role].some((f) => f.toLowerCase().includes(q)))
        return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (dietFilter !== "all" && !a.dietary.includes(dietFilter as Dietary)) return false;
      if (vipOnly && !a.vip) return false;
      if (companyFilter !== "all" && a.company !== companyFilter) return false;
      return true;
    });
  }, [attendees, search, statusFilter, dietFilter, vipOnly, companyFilter]);

  const openNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (a: Attendee) => {
    setEditing(a);
    setDrawerOpen(true);
  };

  const importAction = (
    <button
      onClick={() => setImportOpen(true)}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper hover:bg-ink/90"
    >
      <Upload className="h-4 w-4" /> Import CSV
    </button>
  );

  const selectCls =
    "rounded-full border border-border-default bg-paper px-3 py-1.5 text-xs text-ink focus:border-ink focus:outline-none";

  return (
    <PlanningWorkspace activeStep="attendees" action={importAction}>
      {attendees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-default bg-paper/60 px-6 py-16 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-copper/10 text-copper">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl text-ink">No attendees yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            Build your guest roster — it becomes the source of truth for room blocks and F&amp;B
            counts.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
            >
              <Upload className="h-4 w-4" /> Import attendees
            </button>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-full border border-border-default bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
            >
              <UserPlus className="h-4 w-4" /> Add manually
            </button>
          </div>
        </div>
      ) : (
        <>
          <SummaryChips />

          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, company, role…"
                className="w-full rounded-full border border-border-default bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
                aria-label="Search attendees"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className={selectCls}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                className={selectCls}
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                aria-label="Filter by dietary"
              >
                <option value="all">All dietary</option>
                {DIETARY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                className={selectCls}
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                aria-label="Filter by company"
              >
                <option value="all">All companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setVipOnly((v) => !v)}
                aria-pressed={vipOnly}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  vipOnly
                    ? "border-copper bg-copper/10 text-copper"
                    : "border-border-default bg-paper text-ink-soft hover:border-ink",
                )}
              >
                <Star className={cn("h-3.5 w-3.5", vipOnly && "fill-current")} /> VIP
              </button>
              <button
                onClick={openNew}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:border-ink"
              >
                <UserPlus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border-subtle bg-paper shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    <th className="px-4 py-3 font-semibold">Guest</th>
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Party</th>
                    <th className="px-4 py-3 font-semibold">Dietary</th>
                    <th className="px-4 py-3 font-semibold">Dates</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-border-subtle/70 last:border-0 hover:bg-canvas/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <GuestAvatar name={a.fullName} vip={a.vip} />
                          <div className="min-w-0">
                            <button
                              onClick={() => openEdit(a)}
                              className="block truncate font-medium text-ink hover:underline"
                            >
                              {a.fullName}
                            </button>
                            <span className="block truncate text-xs text-ink-muted">
                              {a.role || a.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{a.company}</td>
                      <td className="px-4 py-3">
                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateAttendee(a.id, { status: e.target.value as AttendeeStatus })
                          }
                          aria-label={`Status for ${a.fullName}`}
                          className="rounded-md border border-transparent bg-transparent py-1 text-xs text-ink hover:border-border-default focus:border-ink focus:outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <PartyStepper
                          value={a.partySize}
                          onChange={(n) => updateAttendee(a.id, { partySize: n })}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex max-w-[180px] flex-wrap gap-1">
                          {a.dietary.length ? (
                            a.dietary.map((d) => <DietaryTag key={d} diet={d} />)
                          ) : (
                            <span className="text-xs text-ink-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-soft">
                        {fmtShortDate(a.arrival)} – {fmtShortDate(a.departure)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(a)}
                            className="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-canvas hover:text-ink"
                            aria-label={`Edit ${a.fullName}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink-muted">
                        No attendees match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Showing {filtered.length} of {attendees.length} attendees · status &amp; party size are
            editable inline.
          </p>
        </>
      )}

      <AttendeeDrawer open={drawerOpen} onOpenChange={setDrawerOpen} editing={editing} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </PlanningWorkspace>
  );
}

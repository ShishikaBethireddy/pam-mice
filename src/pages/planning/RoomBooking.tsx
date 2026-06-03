import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BedDouble,
  ChevronDown,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { AttendeeStatusPill, GuestAvatar } from "@/components/planning/PlanningBits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { groupByRoom, useEventPlanning, type RoomType } from "@/lib/eventPlanning";
import { fmtShortDate } from "@/data/mockData";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-md border border-border-default bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none";

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

function GroupDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: RoomType | null;
}) {
  const { event, addRoomType, updateRoomType, deleteRoomType } = useEventPlanning();
  const [name, setName] = useState(editing?.name ?? "");
  const [checkIn, setCheckIn] = useState(editing?.checkIn ?? event.arrival);
  const [checkOut, setCheckOut] = useState(editing?.checkOut ?? event.departure);

  const [trackId, setTrackId] = useState<string | null>(editing?.id ?? null);
  if (open && (editing?.id ?? null) !== trackId) {
    setTrackId(editing?.id ?? null);
    setName(editing?.name ?? "");
    setCheckIn(editing?.checkIn ?? event.arrival);
    setCheckOut(editing?.checkOut ?? event.departure);
  }

  const save = () => {
    if (!name.trim()) {
      toast.error("Give the room type a name.");
      return;
    }
    if (editing) {
      updateRoomType(editing.id, { name, checkIn, checkOut });
      toast.success("Room group updated.");
    } else {
      addRoomType(name);
      toast.success(`Added ${name}.`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-canvas">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-ink">
            {editing ? "Edit room group" : "Add room type"}
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Configure the room type and stay dates for this block.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {field(
            "Room type",
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deluxe King"
            />,
          )}
          <div className="grid grid-cols-2 gap-3">
            {field(
              "Check-in",
              <input
                className={inputCls}
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />,
            )}
            {field(
              "Check-out",
              <input
                className={inputCls}
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />,
            )}
          </div>
        </div>
        <DialogFooter className="items-center justify-between sm:justify-between">
          {editing ? (
            <button
              onClick={() => {
                deleteRoomType(editing.id);
                toast.success("Room group removed — guests moved to Unassigned.");
                onOpenChange(false);
              }}
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
              {editing ? "Save" : "Add"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RoomBooking() {
  const { attendees, roomTypes, assignAttendee } = useEventPlanning();
  const groups = useMemo(() => groupByRoom(attendees, roomTypes), [attendees, roomTypes]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({ unassigned: true });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<RoomType | null>(null);

  const toggle = (key: string) =>
    setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const openPms = () => toast.success("Opening room block in the PMS…");

  const pmsAction = (
    <button
      onClick={openPms}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper hover:bg-ink/90"
    >
      <ExternalLink className="h-4 w-4" /> Open in PMS
    </button>
  );

  const moveOptions = (
    <>
      <option value="">Unassigned</option>
      {roomTypes.map((rt) => (
        <option key={rt.id} value={rt.id}>
          {rt.name}
        </option>
      ))}
    </>
  );

  return (
    <PlanningWorkspace activeStep="rooms" action={pmsAction}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">Guests grouped by assigned room type.</p>
        <button
          onClick={() => {
            setEditingGroup(null);
            setDialogOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:border-ink"
        >
          <Plus className="h-3.5 w-3.5" /> Add room type
        </button>
      </div>

      <div className="space-y-3">
        {groups.map((group) => {
          const isUnassigned = group.roomType === null;
          const key = isUnassigned ? "unassigned" : group.roomType!.id;
          const open = expanded[key] ?? false;
          if (isUnassigned && group.attendees.length === 0) return null;

          return (
            <div
              key={key}
              className={cn(
                "overflow-hidden rounded-xl border bg-paper shadow-card",
                isUnassigned ? "border-warning/40" : "border-border-subtle",
              )}
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => toggle(key)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 flex-none place-items-center rounded-full",
                      isUnassigned ? "bg-warning-soft text-warning" : "bg-copper/10 text-copper",
                    )}
                  >
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">
                      {isUnassigned ? "Unassigned" : group.roomType!.name}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {isUnassigned ? (
                        "Assign these guests to a room type"
                      ) : (
                        <>
                          {group.roomCount} {group.roomCount === 1 ? "room" : "rooms"} ·{" "}
                          {fmtShortDate(group.roomType!.checkIn)} –{" "}
                          {fmtShortDate(group.roomType!.checkOut)}
                        </>
                      )}
                    </span>
                  </span>
                </button>

                {!isUnassigned && (
                  <button
                    onClick={() => {
                      setEditingGroup(group.roomType);
                      setDialogOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-default px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-soft hover:border-ink hover:text-ink"
                  >
                    <Pencil className="h-3 w-3" /> Edit group
                  </button>
                )}
                <button
                  onClick={() => toggle(key)}
                  aria-label={open ? "Collapse" : "Expand"}
                  className="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-canvas hover:text-ink"
                >
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                </button>
              </div>

              {open && (
                <div className="border-t border-border-subtle">
                  {group.attendees.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-ink-muted">No guests in this room type yet.</p>
                  ) : (
                    <ul className="divide-y divide-border-subtle/70">
                      {group.attendees.map((a) => (
                        <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                          <GuestAvatar name={a.fullName} vip={a.vip} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{a.fullName}</p>
                            <p className="truncate text-xs text-ink-muted">
                              {a.role || "Guest"} · {a.partySize}{" "}
                              {a.partySize === 1 ? "guest" : "guests"}
                            </p>
                          </div>
                          <AttendeeStatusPill status={a.status} />
                          <label className="sr-only" htmlFor={`assign-${a.id}`}>
                            Assign {a.fullName} to a room type
                          </label>
                          <select
                            id={`assign-${a.id}`}
                            value={a.roomTypeId ?? ""}
                            onChange={(e) => assignAttendee(a.id, e.target.value || null)}
                            className="rounded-full border border-border-default bg-paper px-3 py-1.5 text-xs text-ink hover:border-ink focus:border-ink focus:outline-none"
                          >
                            {moveOptions}
                          </select>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GroupDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editingGroup} />
    </PlanningWorkspace>
  );
}

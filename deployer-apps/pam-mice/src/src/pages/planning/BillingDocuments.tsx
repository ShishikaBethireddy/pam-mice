import { useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Upload } from "lucide-react";
import PlanningWorkspace from "@/components/PlanningWorkspace";
import { SEED_DOCS, inferDocType, type BillingDoc } from "@/lib/billing";
import { currency, fmtDate } from "@/data/mockData";

export default function BillingDocuments() {
  const [docs, setDocs] = useState<BillingDoc[]>(SEED_DOCS);

  function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const next: BillingDoc[] = Array.from(files).map((f, i) => ({
      id: `u${Date.now()}-${i}`,
      name: f.name,
      type: inferDocType(f.name),
      date: today,
      sizeKb: Math.max(1, Math.round(f.size / 1024)),
    }));
    setDocs((d) => [...next, ...d]);
    toast.success(`${next.length} document${next.length === 1 ? "" : "s"} uploaded.`);
  }

  const action = (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper hover:bg-ink/90">
      <Upload className="h-3.5 w-3.5" /> Upload
      <input type="file" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
    </label>
  );

  return (
    <PlanningWorkspace activeStep="billing-documents" action={action}>
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-paper shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas text-left text-[11px] uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-3 font-medium">Document</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Size</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b border-border-subtle/70 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-ink">
                      <FileText className="h-4 w-4 text-ink-muted" />
                      {d.name}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{fmtDate(d.date)}</td>
                  <td className="px-5 py-3 text-right text-ink">{d.amount ? currency(d.amount) : " "}</td>
                  <td className="px-5 py-3 text-right text-ink-muted">{d.sizeKb} KB</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toast(`Downloading ${d.name}…`)}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlanningWorkspace>
  );
}

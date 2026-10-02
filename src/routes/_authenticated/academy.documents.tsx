import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PortalShell, Panel, Pill, portalHead, useMyAcademy } from "@/components/academy/portal";


export const Route = createFileRoute("/_authenticated/academy/documents")({
  head: () => portalHead("Documents & CV", "Securely upload your CV and supporting documents to GET Energy Academy."),
  component: Docs,
});

const TYPES = ["CV", "Academic certificate", "Professional certificate", "ID document", "Employer letter", "Other"];
const OK_MIME = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
const MAX = 5 * 1024 * 1024;

function Docs() {
  const qc = useQueryClient();
  const { data } = useMyAcademy();
  const [type, setType] = useState("CV");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const docs = data?.docs ?? [];

  const upload = async () => {
    if (!file) return toast.error("Choose a file first.");
    if (!OK_MIME.includes(file.type)) return toast.error("Use PDF, Word (DOC/DOCX), JPG or PNG.");
    if (file.size > MAX) return toast.error("Files must be 5 MB or smaller.");
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setBusy(true);
    const safe = file.name.replace(/[^\w.-]+/g, "_").slice(-80);
    const path = `${u.user.id}/${crypto.randomUUID()}-${safe}`;
    const up = await supabase.storage.from("academy-documents").upload(path, file, { contentType: file.type });
    if (up.error) { setBusy(false); return toast.error("Upload failed. Please try again."); }
    const { error } = await supabase.from("academy_documents").insert({ user_id: u.user.id, doc_type: type, file_path: path, file_name: safe, size_bytes: file.size, mime_type: file.type });
    setBusy(false);
    if (error) { await supabase.storage.from("academy-documents").remove([path]); return toast.error("Could not save the document."); }
    toast.success(`${type} uploaded`);
    setFile(null);
    qc.invalidateQueries({ queryKey: ["academy-mine"] });
  };

  const open = async (path: string) => {
    const { data: s } = await supabase.storage.from("academy-documents").createSignedUrl(path, 60);
    if (s?.signedUrl) window.open(s.signedUrl, "_blank", "noopener");
  };
  const remove = async (id: string, path: string) => {
    const { error } = await supabase.from("academy_documents").delete().eq("id", id);
    if (error) return toast.error("Only unreviewed documents can be removed.");
    await supabase.storage.from("academy-documents").remove([path]);
    qc.invalidateQueries({ queryKey: ["academy-mine"] });
  };

  return (
    <PortalShell title="Documents & CV" intro="Files are stored privately. Only you and authorised Academy reviewers can open them. PDF, DOC, DOCX, JPG or PNG up to 5 MB.">
      <Panel title="Upload a document">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">Document type<select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block h-11 rounded-md border border-input bg-background px-3">{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="text-sm">File<input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block min-h-11 text-sm" /></label>
          <Button className="min-h-11" onClick={upload} disabled={busy}>{busy ? "Uploading…" : "Upload"}</Button>
        </div>
      </Panel>
      <Panel title="My documents" className="mt-4">
        {!docs.length ? <p className="text-sm text-muted-foreground">No documents yet. Upload your CV to strengthen your applications.</p> : (
          <ul className="divide-y divide-border text-sm">
            {docs.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span><strong>{d.doc_type}</strong> · {d.file_name}<br /><span className="text-xs text-muted-foreground">{Math.round(d.size_bytes / 1024)} KB · {new Date(d.created_at).toLocaleDateString()}{d.reviewer_note ? ` · Reviewer: ${d.reviewer_note}` : ""}</span></span>
                <span className="flex items-center gap-2"><Pill status={d.status} /><Button size="sm" variant="outline" className="min-h-11" onClick={() => open(d.file_path)}>Open</Button>{d.status === "uploaded" ? <Button size="sm" variant="ghost" className="min-h-11" onClick={() => remove(d.id, d.file_path)}>Remove</Button> : null}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PortalShell>
  );
}

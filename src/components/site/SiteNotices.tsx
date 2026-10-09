import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SERVICE_STATUS_LABEL } from "@/components/admin/ControlCentre";

/** Site-wide banner + per-service availability notice, both managed in Team admin. */
export function SiteNotices() {
  const { pathname } = useLocation();
  const notice = useQuery({
    queryKey: ["site-notice"],
    queryFn: async () => (await supabase.from("site_notices").select("*").eq("id", 1).maybeSingle()).data,
    staleTime: 60_000,
  });
  const statuses = useQuery({
    queryKey: ["service-statuses"],
    queryFn: async () => (await supabase.from("service_statuses").select("*").order("sort_order")).data ?? [],
    staleTime: 60_000,
  });
  const svc = statuses.data?.find((s) => s.path === pathname && s.status !== "live");
  const n = notice.data?.active && notice.data.message ? notice.data : null;
  if (!n && !svc) return null;
  return (
    <div className="text-sm">
      {n ? (
        <div className="bg-primary px-4 py-2 text-center text-primary-foreground">
          {n.message}
          {n.link_url ? <> {" "}<a href={n.link_url} className="font-semibold underline">{n.link_label || "Learn more"}</a></> : null}
        </div>
      ) : null}
      {svc ? (
        <div role="status" className="border-b border-border bg-muted px-4 py-2 text-center text-foreground">
          <strong>{svc.label}: {SERVICE_STATUS_LABEL[svc.status]}.</strong>{svc.public_note ? ` ${svc.public_note}` : ""}
        </div>
      ) : null}
    </div>
  );
}

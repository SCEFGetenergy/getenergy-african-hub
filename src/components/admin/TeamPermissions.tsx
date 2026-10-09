import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const PERMISSIONS = [
  { key: "view_requests", label: "View & update requests", hint: "All enquiries and electricity requests" },
  { key: "edit_content", label: "Edit content", hint: "Site-wide notice" },
  { key: "manage_availability", label: "Change service availability", hint: "Live / launching soon / paused" },
  { key: "manage_team", label: "Manage team settings", hint: "Invite staff, view audit log" },
] as const;
export type PermissionKey = (typeof PERMISSIONS)[number]["key"];

/** Full administrators only: grant or remove permissions for staff members. */
export function TeamPermissions() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_team_members");
      if (error) throw error;
      return data ?? [];
    },
  });
  const set = useMutation({
    mutationFn: async (v: { user_id: string; permission: string; granted: boolean }) => {
      const { error } = await supabase.rpc("set_admin_permission", { p_user_id: v.user_id, p_permission: v.permission, p_granted: v.granted });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Permission updated"); qc.invalidateQueries({ queryKey: ["team-members"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <h2 className="text-xl font-bold">Team permissions</h2>
      <p className="mt-1 text-xs text-muted-foreground">Full administrators can do everything. Staff members only see what you tick here. Only full administrators can change these, and every change is logged. To add someone, invite them as staff below first.</p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground">
            <tr><th className="p-3">Team member</th>{PERMISSIONS.map((p) => <th key={p.key} className="p-3">{p.label}<div className="font-normal">{p.hint}</div></th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? <tr><td className="p-3" colSpan={5}>Loading…</td></tr> : null}
            {error ? <tr><td className="p-3 text-destructive" colSpan={5}>{(error as Error).message}</td></tr> : null}
            {data?.map((m) => (
              <tr key={m.user_id + m.role}>
                <td className="p-3">{m.email}<div className="text-xs text-muted-foreground">{m.role === "admin" ? "Full administrator" : "Staff"}</div></td>
                {PERMISSIONS.map((p) => (
                  <td key={p.key} className="p-3">
                    {m.role === "admin" ? <span className="text-xs text-muted-foreground">Always</span> : (
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        aria-label={`${p.label} for ${m.email}`}
                        checked={m.permissions.includes(p.key)}
                        disabled={set.isPending}
                        onChange={(e) => set.mutate({ user_id: m.user_id, permission: p.key, granted: e.target.checked })}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

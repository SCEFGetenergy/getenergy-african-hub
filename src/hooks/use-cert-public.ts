import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Public, admin-managed certification data: approved fees and formally recognised employers.
export function useCertPublic(code: string) {
  return useQuery({
    queryKey: ["cert-public", code],
    queryFn: async () => {
      const [s, e] = await Promise.all([
        supabase.from("certification_settings").select("fee_ngn, fee_approved").eq("code", code).maybeSingle(),
        supabase.from("certification_employers").select("id, employer_name").eq("certification_code", code).order("employer_name"),
      ]);
      const fee = s.data?.fee_approved && s.data.fee_ngn != null ? s.data.fee_ngn : null;
      return { fee, employers: e.data ?? [] };
    },
  });
}

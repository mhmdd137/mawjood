import { createAdminClient } from "@/lib/supabase/admin-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminOpportunitiesPage from "@/features/admin/components/AdminOpportunitiesPage";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();

  const { data: opportunities } = await admin
    .from("opportunities")
    .select(
      `
      id, title, category, location, status, created_at,
      org:profiles!org_id(full_name)
    `,
    )
    .order("created_at", { ascending: false });

  const mapped = await Promise.all(
    (opportunities ?? []).map(async (opp) => {
      const { count } = await admin
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("opportunity_id", opp.id);

      return {
        id: opp.id,
        title: opp.title,
        category: opp.category,
        location: opp.location,
        status: opp.status as "draft" | "open" | "closed" | "completed",
        created_at: opp.created_at,
        org_name:
          (opp.org as unknown as unknown as { full_name: string } | null)?.full_name ??
          "—",
        applications_count: count ?? 0,
      };
    }),
  );

  return <AdminOpportunitiesPage opportunities={mapped} />;
}

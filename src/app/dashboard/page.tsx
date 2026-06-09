import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreOpportunity } from "@/features/opportunities/utils/scoring";
import VolunteerDashboard from "@/features/dashboard/components/VolunteerDashboard";
import OrgDashboard from "@/features/dashboard/components/OrgDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/dashboard/admin");

  // ─── Org dashboard ──────────────────────────────────────────────────────────
  if (profile.role === "org") {
    const [
      { count: openOpportunities },
      { count: newApplications },
      { count: totalCertificates },
      { data: opportunities },
      { data: pendingApps },
    ] = await Promise.all([
      supabase
        .from("opportunities")
        .select("*", { count: "exact", head: true })
        .eq("org_id", user.id)
        .eq("status", "open"),
      supabase
        .from("applications")
        .select("*, opportunity:opportunities!opportunity_id(org_id)", {
          count: "exact",
          head: true,
        })
        .eq("status", "pending"),
      supabase
        .from("certificates")
        .select(
          "*, application:applications!application_id(opportunity:opportunities!opportunity_id(org_id))",
          { count: "exact", head: true },
        ),
      supabase
        .from("opportunities")
        .select("id, title, status, applications(count)")
        .eq("org_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("applications")
        .select(
          `
          id, applied_at,
          volunteer:profiles!volunteer_id(full_name),
          opportunity:opportunities!opportunity_id(title, org_id)
        `,
        )
        .eq("status", "pending")
        .order("applied_at", { ascending: false })
        .limit(10),
    ]);

    const myPending = (pendingApps ?? []).filter(
      (app) =>
        (app.opportunity as unknown as { org_id: string } | null)?.org_id === user.id,
    );

    const mappedPending = myPending.map((app) => ({
      id: app.id,
      volunteer_name:
        (app.volunteer as unknown as { full_name: string } | null)?.full_name ??
        "",
      opportunity_title:
        (app.opportunity as unknown as { title: string } | null)?.title ?? "",
      applied_at: app.applied_at,
    }));

    const mappedOpps = (opportunities ?? []).map((opp) => ({
      id: opp.id,
      title: opp.title,
      status: opp.status as "draft" | "open" | "closed" | "completed",
      applications_count:
        (opp.applications as unknown as { count: number }[])?.[0]?.count ?? 0,
    }));

    return (
      <OrgDashboard
        orgName={profile.full_name}
        isVerified={profile.is_verified}
        stats={{
          openOpportunities: openOpportunities ?? 0,
          newApplications: newApplications ?? 0,
          totalCertificates: totalCertificates ?? 0,
        }}
        pendingApplications={mappedPending}
        opportunities={mappedOpps}
      />
    );
  }

  // ─── Volunteer dashboard ────────────────────────────────────────────────────

  const [
    { count: activeApplications },
    { count: acceptedOpportunities },
    { count: certificates },
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", user.id)
      .eq("status", "pending"),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", user.id)
      .eq("status", "accepted"),
    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", user.id),
  ]);

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(
      `
      id, title, category, location, required_skills, time_slot, start_date, status,
      org:profiles!org_id(full_name)
    `,
    )
    .eq("status", "open");

  const scoredOpps = (opportunities ?? [])
    .map((opp) => ({
      id: opp.id,
      title: opp.title,
      org_name:
        (opp.org as unknown as { full_name: string } | null)?.full_name ?? "",
      category: opp.category,
      status: "open" as const,
      score: scoreOpportunity(opp, profile),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      id, status, applied_at,
      opportunity:opportunities!opportunity_id(
        title,
        org:profiles!org_id(full_name)
      )
    `,
    )
    .eq("volunteer_id", user.id)
    .order("applied_at", { ascending: false })
    .limit(5);

  const mappedApplications = (applications ?? []).map((app) => ({
    id: app.id,
    status: app.status as "pending" | "accepted" | "rejected",
    applied_at: app.applied_at,
    opportunity_title:
      (app.opportunity as unknown as { title: string } | null)?.title ?? "",
    org_name:
      (app.opportunity as unknown as { org: { full_name: string } } | null)?.org
        ?.full_name ?? "",
  }));

  return (
    <VolunteerDashboard
      userName={profile.full_name}
      stats={{
        activeApplications: activeApplications ?? 0,
        acceptedOpportunities: acceptedOpportunities ?? 0,
        certificates: certificates ?? 0,
      }}
      opportunities={scoredOpps}
      applications={mappedApplications}
    />
  );
}

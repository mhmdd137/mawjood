import Link from "next/link";
import { OpportunityFilters } from "@/features/opportunities/components/OpportunityFilters";
import { OpportunityCard } from "@/features/opportunities/components/OpportunityCard";
import { scoreOpportunity } from "@/features/opportunities/utils/scoring";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  // ─── Auth (optional) ───────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let volunteerProfile: {
    location: string;
    skills: string[];
    time_slot: string | null;
  } | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, location, skills, time_slot")
      .eq("id", user.id)
      .single();

    if (profile?.role === "volunteer") {
      volunteerProfile = {
        location: profile.location,
        skills: profile.skills ?? [],
        time_slot: profile.time_slot,
      };
    }
  }

  // ─── Fetch opportunities ───────────────────────────────────────────────────
  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select(
      `
      id, title, category, location, required_skills,
      time_slot, start_date, end_date, status, org_id,
      org:profiles!org_id(id, full_name, avatar_url)
    `,
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // ─── Filters ───────────────────────────────────────────────────────────────
  const categoryFilter =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category.split(",").filter(Boolean)
      : [];

  const locationFilter =
    typeof resolvedSearchParams.location === "string"
      ? resolvedSearchParams.location
      : "";

  const timeSlotFilter =
    typeof resolvedSearchParams.time_slot === "string"
      ? resolvedSearchParams.time_slot
      : "";

  const filtered = (opportunities ?? []).filter((opp) => {
    if (categoryFilter.length > 0 && !categoryFilter.includes(opp.category))
      return false;
    if (
      locationFilter &&
      locationFilter !== "كل المناطق" &&
      opp.location !== locationFilter
    )
      return false;
    if (timeSlotFilter && opp.time_slot !== timeSlotFilter) return false;
    return true;
  });

  // ─── Scoring ───────────────────────────────────────────────────────────────
  const scored = filtered
    .map((opp) => ({
      ...opp,
      score: volunteerProfile ? scoreOpportunity(opp, volunteerProfile) : 0,
    }))
    .sort((a, b) => b.score - a.score);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
    });
  }

  function formatTimeSlot(slot: string | null) {
    if (slot === "morning") return "صباحي";
    if (slot === "afternoon") return "مسائي";
    return "مرن";
  }

  return (
    <div className="w-full min-h-screen" style={{ background: "#FCFAFF" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8" dir="rtl">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-[280px] shrink-0">
            <OpportunityFilters />
          </aside>

          <div className="flex-1">
            <div className="mb-6 text-right">
              <h1 className="text-[22px] font-medium text-[#1A1A1A] mb-1">
                فرص التطوع المقترحة
              </h1>
              <p className="text-[13px] text-[#666666]">
                اكتشف الفرص التي تتناسب مع مهاراتك واهتماماتك في غزة
              </p>
            </div>

            {scored.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scored.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    id={opp.id}
                    title={opp.title}
                    organization={
                      (opp.org as unknown as { full_name: string } | null)
                        ?.full_name ?? ""
                    }
                    location={opp.location}
                    status={opp.status as "open" | "completed" | "closed"}
                    matchPercentage={opp.score}
                    skills={opp.required_skills}
                    timeSlot={formatTimeSlot(opp.time_slot)}
                    startDate={formatDate(opp.start_date)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-12 bg-white rounded-xl text-center"
                style={{ border: "0.5px solid #E5E5E5" }}
              >
                <p className="text-[16px] font-medium text-[#1A1A1A] mb-2">
                  لا توجد فرص تطابق معايير البحث
                </p>
                <p className="text-[13px] text-[#666666] mb-6">
                  جرّب تغيير الفلاتر للعثور على فرص أخرى
                </p>
                <Link href="/opportunities">
                  <Button variant="outline">إعادة تعيين الفلاتر</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

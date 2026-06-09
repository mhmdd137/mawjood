import { MapPin, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreOpportunity } from "@/features/opportunities/utils/scoring";
import ApplyButton from "@/features/opportunities/components/ApplyButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: "صباحي",
  afternoon: "مسائي",
  flexible: "مرن",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch opportunity + org
  const { data: opp, error } = await supabase
    .from("opportunities")
    .select(
      `
      *,
      org:profiles!org_id(id, full_name, bio, is_verified, location)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !opp) notFound();

  const org = opp.org as unknown as {
    id: string;
    full_name: string;
    bio: string;
    is_verified: boolean;
    location: string;
  } | null;

  // Auth + volunteer profile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let volunteerProfile: {
    location: string;
    skills: string[];
    time_slot: string | null;
  } | null = null;
  let existingApplication: { id: string } | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, location, skills, time_slot")
      .eq("id", user.id)
      .single();

    if (profile?.role === "volunteer") {
      volunteerProfile = profile;

      const { data: app } = await supabase
        .from("applications")
        .select("id")
        .eq("volunteer_id", user.id)
        .eq("opportunity_id", id)
        .single();

      existingApplication = app;
    }
  }

  // Score + criteria
  const score = volunteerProfile
    ? scoreOpportunity(opp, volunteerProfile)
    : null;

  const criteria = volunteerProfile
    ? [
        {
          label: "التخصص يتطابق",
          points: 50,
          match: opp.required_skills.some((s: string) =>
            volunteerProfile!.skills.includes(s),
          ),
        },
        {
          label: "الموقع يتطابق",
          points: 30,
          match: opp.location === volunteerProfile.location,
        },
        {
          label: "التاريخ مناسب",
          points: 20,
          match: new Date(opp.start_date) >= new Date(),
        },
        {
          label: "التوقيت يتطابق",
          points: 10,
          match:
            opp.time_slot === "flexible" ||
            opp.time_slot === volunteerProfile.time_slot,
        },
      ]
    : [];

  // Similar opportunities (same category, different id)
  const { data: similar } = await supabase
    .from("opportunities")
    .select("id, title, location")
    .eq("category", opp.category)
    .eq("status", "open")
    .neq("id", id)
    .limit(2);

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#FCFAFF" }}>
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: "#666666" }}
        >
          <Link href="/" className="hover:underline">
            الرئيسية
          </Link>
          <span>←</span>
          <Link href="/opportunities" className="hover:underline">
            الفرص
          </Link>
          <span>←</span>
          <span style={{ color: "#1A1A1A" }}>{opp.title}</span>
        </div>

        <div className="flex gap-6 items-start">
          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Block 1 — Header */}
            <div
              className="bg-white rounded-xl p-6"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {score !== null && (
                  <span
                    className="text-xs font-medium rounded-full px-2 py-1"
                    style={{ background: "#EEEDFE", color: "#3C3489" }}
                  >
                    {score}% تطابق
                  </span>
                )}
                <span
                  className="text-xs font-medium rounded-full px-2 py-1"
                  style={{ background: "#F0ECF4", color: "#534AB7" }}
                >
                  {opp.category}
                </span>
                <span
                  className="text-xs font-medium rounded-full px-2 py-1"
                  style={{ background: "#E1F5EE", color: "#0F6E56" }}
                >
                  مفتوحة
                </span>
              </div>

              <h1
                className="text-2xl font-medium text-right mb-4"
                style={{ color: "#1A1A1A" }}
              >
                {opp.title}
              </h1>

              <div className="flex items-center gap-2 justify-end mb-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: "#1A1A1A" }}
                >
                  {org?.full_name}
                </span>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: "#EEEDFE", color: "#3C3489" }}
                >
                  {org?.full_name?.charAt(0) ?? "؟"}
                </div>
              </div>

              <div
                className="flex items-center gap-4 justify-end text-sm flex-wrap"
                style={{ color: "#666666" }}
              >
                <div className="flex items-center gap-1">
                  <span>{TIME_SLOT_LABELS[opp.time_slot] ?? "مرن"}</span>
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span>{opp.location}</span>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span>{formatDate(opp.end_date)}</span>
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span>{formatDate(opp.start_date)}</span>
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Block 2 — Match Analysis (volunteers only) */}
            {volunteerProfile && score !== null && (
              <div
                className="bg-white rounded-xl p-5"
                style={{ border: "0.5px solid #E5E5E5" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-base font-medium"
                    style={{ color: "#3C3489" }}
                  >
                    {score}%
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#1A1A1A" }}
                  >
                    تحليل التوافق
                  </span>
                </div>
                <div
                  className="w-full rounded-full mb-4"
                  style={{ height: "6px", background: "#E5E5E5" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${score}%`, background: "#3C3489" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {criteria.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-end gap-2"
                    >
                      <span className="text-xs" style={{ color: "#666666" }}>
                        {c.points} نقطة
                      </span>
                      <span className="text-sm" style={{ color: "#1A1A1A" }}>
                        {c.label}
                      </span>
                      {c.match ? (
                        <CheckCircle2
                          className="h-4 w-4"
                          style={{ color: "#0F6E56" }}
                        />
                      ) : (
                        <XCircle
                          className="h-4 w-4"
                          style={{ color: "#A32D2D" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Block 3 — About */}
            <div
              className="bg-white rounded-xl p-6"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <h2
                className="text-lg font-medium text-right mb-3"
                style={{ color: "#1A1A1A" }}
              >
                عن الفرصة
              </h2>
              <p
                className="text-right leading-relaxed"
                style={{
                  fontSize: "15px",
                  color: "#1A1A1A",
                  lineHeight: "1.7",
                }}
              >
                {opp.description}
              </p>
            </div>

            {/* Block 4 — Skills */}
            <div
              className="bg-white rounded-xl p-6"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <h2
                className="text-lg font-medium text-right mb-4"
                style={{ color: "#1A1A1A" }}
              >
                المهارات المطلوبة
              </h2>
              <div className="flex flex-wrap gap-2 justify-end">
                {opp.required_skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-full px-3 py-1 text-sm"
                    style={{ background: "#F0ECF4", color: "#534AB7" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Block 5 — Details */}
            <div
              className="bg-white rounded-xl p-6"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <h2
                className="text-lg font-medium text-right mb-4"
                style={{ color: "#1A1A1A" }}
              >
                تفاصيل إضافية
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "الموقع", value: opp.location },
                  {
                    label: "التوقيت المتاح",
                    value: TIME_SLOT_LABELS[opp.time_slot] ?? "مرن",
                  },
                  { label: "تاريخ البداية", value: formatDate(opp.start_date) },
                  { label: "تاريخ الانتهاء", value: formatDate(opp.end_date) },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="text-right p-3 rounded-lg"
                    style={{ background: "#F9F9F9" }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#666666" }}>
                      {item.label}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#1A1A1A" }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-[280px] flex flex-col gap-4 sticky top-6">
            {/* Apply CTA */}
            <div
              className="bg-white rounded-xl p-5 text-center"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <h3
                className="text-sm font-medium mb-1"
                style={{ color: "#1A1A1A" }}
              >
                قدّم على هذه الفرصة
              </h3>
              <p className="text-xs mb-4" style={{ color: "#666666" }}>
                أرسل طلبك وانتظر رد المنظمة
              </p>
              <ApplyButton
                opportunityId={id}
                isLoggedIn={!!user}
                isVolunteer={!!volunteerProfile}
                alreadyApplied={!!existingApplication}
              />
              <p className="text-xs mt-3" style={{ color: "#666666" }}>
                ⏰ آخر موعد: {formatDate(opp.end_date)}
              </p>
            </div>

            {/* Org Card */}
            {org && (
              <div
                className="bg-white rounded-xl p-5"
                style={{ border: "0.5px solid #E5E5E5" }}
              >
                <div className="flex items-center gap-2 justify-end mb-3">
                  <div>
                    <div
                      className="text-sm font-medium text-right"
                      style={{ color: "#1A1A1A" }}
                    >
                      {org.full_name}
                    </div>
                    {org.is_verified && (
                      <div className="flex justify-end mt-1">
                        <span
                          className="text-xs rounded-full px-2 py-0.5"
                          style={{ background: "#EEEDFE", color: "#3C3489" }}
                        >
                          موثّقة ✓
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                    style={{ background: "#EEEDFE", color: "#3C3489" }}
                  >
                    {org.full_name.charAt(0)}
                  </div>
                </div>
                {org.bio && (
                  <p
                    className="text-xs text-right mb-3"
                    style={{ color: "#666666" }}
                  >
                    {org.bio}
                  </p>
                )}
                <Link
                  href={`/profile/${org.id}`}
                  className="text-xs flex justify-end"
                  style={{ color: "#3C3489" }}
                >
                  عرض الملف الكامل ←
                </Link>
              </div>
            )}

            {/* Similar opportunities */}
            {similar && similar.length > 0 && (
              <div
                className="bg-white rounded-xl p-5"
                style={{ border: "0.5px solid #E5E5E5" }}
              >
                <h3
                  className="text-sm font-medium text-right mb-3"
                  style={{ color: "#1A1A1A" }}
                >
                  فرص مشابهة
                </h3>
                {similar.map((op) => (
                  <Link key={op.id} href={`/opportunities/${op.id}`}>
                    <div
                      className="flex items-center justify-between py-2 hover:opacity-70 transition-opacity"
                      style={{ borderBottom: "0.5px solid #E5E5E5" }}
                    >
                      <div className="text-right">
                        <div
                          className="text-xs font-medium"
                          style={{ color: "#1A1A1A" }}
                        >
                          {op.title}
                        </div>
                        <div className="text-xs" style={{ color: "#666666" }}>
                          {op.location}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OpportunityCard } from "@/features/opportunities/components/OpportunityCard";
import { Bot, ShieldCheck, Verified } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import { GoogleOneTapWrapper } from "@/features/auth/components/GoogleOneTapWrapper";

export default async function LandingPage() {
  const supabase = await createClient();

  // Stats حقيقية
  const [
    { count: totalVolunteers },
    { count: totalOrgs },
    { count: totalCertificates },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "volunteer"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "org")
      .eq("is_verified", true),
    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  // آخر 3 فرص مفتوحة
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(
      `
      id, title, location, status, required_skills, time_slot, start_date,
      org:profiles!org_id(full_name)
    `,
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(3);

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
    <>
      <GoogleOneTapWrapper />
      <div className="flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-8 lg:pt-32 lg:pb-16 text-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 border-indigo-100"
            >
              منصة التطوع في غزة
            </Badge>

            <h1 className="text-[36px] font-bold tracking-tight text-gray-900 leading-tight">
              كن موجوداً حيث يحتاجك الناس
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-600 leading-relaxed">
              منصة تربط المتطوعين بالمنظمات في غزة — ابحث عن فرصة تناسب مهاراتك،
              قدم، ووثّق مساهمتك بشهادة رقمية.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/opportunities">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  استكشف الفرص
                </Button>
              </Link>
              <Link href="/register?role=org">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 bg-white text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 border-indigo-200"
                >
                  سجل منظمتك
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
              <span className="text-4xl font-bold text-indigo-600 mb-2">
                +{totalVolunteers ?? 0}
              </span>
              <span className="text-gray-500 font-medium">متطوع مسجل</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
              <span className="text-4xl font-bold text-indigo-600 mb-2">
                +{totalOrgs ?? 0}
              </span>
              <span className="text-gray-500 font-medium">منظمة موثقة</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
              <span className="text-4xl font-bold text-indigo-600 mb-2">
                +{totalCertificates ?? 0}
              </span>
              <span className="text-gray-500 font-medium">شهادة صادرة</span>
            </div>
          </div>
        </section>

        {/* Latest Opportunities */}
        <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                أحدث الفرص التطوعية
              </h2>
              <p className="text-gray-500">فرص تناسب مهاراتك واهتماماتك</p>
            </div>
            <Link
              href="/opportunities"
              className="hidden sm:block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              عرض الكل &larr;
            </Link>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp) => (
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
                  matchPercentage={0}
                  skills={opp.required_skills}
                  timeSlot={formatTimeSlot(opp.time_slot)}
                  startDate={formatDate(opp.start_date)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" style={{ color: "#666666" }}>
              <p className="text-lg">لا توجد فرص متاحة حالياً</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/opportunities"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              عرض كل الفرص
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white border-y border-gray-100 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Bot className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">تطابق ذكي</h3>
                <p className="text-gray-500">
                  نستخدم خوارزميات ذكية لمطابقة مهاراتك واهتماماتك مع الفرص
                  التطوعية الأكثر ملاءمة لك، مما يوفر وقتك ويزيد من أثرك.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Verified className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  شهادات موثقة
                </h3>
                <p className="text-gray-500">
                  احصل على شهادات تطوع رسمية وموثقة إلكترونياً عند إتمامك
                  للمهام، يمكنك مشاركتها بسهولة في سيرتك الذاتية.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  منظمات موثوقة
                </h3>
                <p className="text-gray-500">
                  جميع المنظمات والمؤسسات على المنصة يتم التحقق منها واعتمادها
                  لضمان تجربة تطوع آمنة وذات مصداقية عالية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-50/50 border border-indigo-100 px-6 py-16 text-center shadow-sm sm:px-12 lg:px-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              مستعد تكون موجوداً؟
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              انضم إلى آلاف المتطوعين الذين يصنعون الفرق كل يوم. التسجيل مجاني
              وسريع.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="px-8 text-base shadow-md hover:shadow-lg"
              >
                ابدأ الآن — مجاناً
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

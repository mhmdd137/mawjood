import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(
      `
      id, hours_logged, issue_date, verification_code, status,
      volunteer:profiles!volunteer_id(full_name),
      application:applications!application_id(
        opportunity:opportunities!opportunity_id(
          title,
          org:profiles!org_id(full_name)
        )
      )
    `,
    )
    .eq("verification_code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  const opp = (
    data.application as unknown as{
      opportunity: {
        title: string;
        org: { full_name: string } | null;
      } | null;
    } | null
  )?.opportunity;

  return NextResponse.json({
    valid: true,
    status: data.status,
    volunteer_name:
      (data.volunteer as unknown as { full_name: string } | null)?.full_name ??
      "",
    opportunity_title: opp?.title ?? "",
    org_name: opp?.org?.full_name ?? "",
    hours_logged: data.hours_logged,
    issue_date: data.issue_date,
    verification_code: data.verification_code,
  });
}

"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import CertificateDocument from "@/features/certificates/components/CertificateDocument";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import QRCode from 'qrcode';

// ─── Download URL ─────────────────────────────────────────────────────────────

export async function getCertificateDownloadUrl(
  filePath: string,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase.storage
    .from("certificates")
    .createSignedUrl(filePath, 3600);

  if (error || !data?.signedUrl) {
    return { url: null, error: "فشل في إنشاء رابط التحميل" };
  }

  return { url: data.signedUrl, error: null };
}

// ─── Issue Certificate ────────────────────────────────────────────────────────

const issueSchema = z.object({
  application_id: z.string().uuid(),
  hours_logged: z.coerce.number().int().min(1).max(10000),
});

export async function issueCertificate(
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  // 1. Validate input
  const parsed = issueSchema.safeParse({
    application_id: formData.get("application_id"),
    hours_logged: formData.get("hours_logged"),
  });
  if (!parsed.success) {
    return { error: "بيانات غير صحيحة", success: false };
  }
  const { application_id, hours_logged } = parsed.data;

  // 2. Auth — تحقق إن المستخدم منظمة
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "غير مصرح", success: false };

  const { data: orgProfile } = await supabase
    .from("profiles")
    .select("role, full_name, is_verified, signature_path")
    .eq("id", user.id)
    .single();

  if (!orgProfile || orgProfile.role !== "org" || !orgProfile.is_verified) {
    return { error: "غير مصرح — المنظمة غير موثّقة", success: false };
  }

  // 3. تحقق إن التقديم مقبول وتابع لفرصة هاي المنظمة
  const { data: application } = await supabase
    .from("applications")
    .select(
      `
      id, volunteer_id, status,
      opportunity:opportunities!opportunity_id(
        id, title, org_id,
        org:profiles!org_id(full_name)
      )
    `,
    )
    .eq("id", application_id)
    .single();

  if (!application) return { error: "التقديم غير موجود", success: false };
  if (application.status !== "accepted")
    return { error: "التقديم غير مقبول", success: false };

  const opp = application.opportunity as unknown as {
    id: string;
    title: string;
    org_id: string;
    org: { full_name: string };
  } | null;

  if (!opp || opp.org_id !== user.id) {
    return {
      error: "غير مصرح — هذه الفرصة ليست تابعة لمنظمتك",
      success: false,
    };
  }

  // 4. تحقق إن الشهادة ما صدرت مسبقاً
  const serviceClient = createServiceClient();
  const { data: existing } = await serviceClient
    .from("certificates")
    .select("id")
    .eq("application_id", application_id)
    .single();

  if (existing)
    return { error: "تم إصدار شهادة لهذا التقديم مسبقاً", success: false };

  // 5. جيب بيانات المتطوع
  const { data: volunteer } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", application.volunteer_id)
    .single();

  if (!volunteer) return { error: "لم يتم العثور على المتطوع", success: false };

  // جيب التوقيع كـ base64 لو موجود
  let signatureBase64: string | undefined;
  if (orgProfile.signature_path) {
    try {
      const { data: sigUrlData } = await serviceClient.storage
        .from("signatures")
        .createSignedUrl(orgProfile.signature_path, 60);

      if (sigUrlData?.signedUrl) {
        const sigRes = await fetch(sigUrlData.signedUrl);
        const sigBuffer = await sigRes.arrayBuffer();
        const base64 = Buffer.from(sigBuffer).toString("base64");
        const mimeType = sigRes.headers.get("content-type") ?? "image/png";
        signatureBase64 = `data:${mimeType};base64,${base64}`;
      }
    } catch {
      // التوقيع اختياري — لو فشل نكمل بدونه
    }
  }

  // 6. ولّد verification_code
  const verificationCode = crypto.randomUUID();
  const issueDate = new Date().toISOString().split("T")[0];

  // توليد QR Code
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const verifyUrl = `${appUrl}/verify/${verificationCode}`
const qrCodeBase64 = await QRCode.toDataURL(verifyUrl, {
  width: 120,
  margin: 1,
  color: {
    dark: '#3C3489',
    light: '#FFFFFF',
  },
})

  // 7. بنِ الـ PDF
  const pdfBuffer = await renderToBuffer(
    createElement(CertificateDocument, {
      volunteerName: volunteer.full_name,
      opportunityTitle: opp.title,
      orgName: opp.org.full_name,
      hoursLogged: hours_logged,
      issueDate: issueDate,
      verificationCode: verificationCode,
      signatureBase64,
      qrCodeBase64,
    }) as any
  );

  // 8. ارفع الـ PDF لـ Supabase Storage
  const filePath = `${application.volunteer_id}/${verificationCode}.pdf`;

  const { error: uploadError } = await serviceClient.storage
    .from("certificates")
    .upload(filePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return { error: "فشل في رفع الشهادة", success: false };
  }

  // 9. احفظ في جدول certificates
  const { error: insertError } = await serviceClient
    .from("certificates")
    .insert({
      volunteer_id: application.volunteer_id,
      application_id: application_id,
      hours_logged: hours_logged,
      issue_date: issueDate,
      file_path: filePath,
      verification_code: verificationCode,
      status: "active",
    });

  if (insertError) {
    return { error: "فشل في حفظ الشهادة", success: false };
  }

  // 10. بعت إشعار للمتطوع
  await serviceClient.from("notifications").insert({
    user_id: application.volunteer_id,
    type: "certificate_issued",
    message: `تم إصدار شهادة تطوع لك من ${opp.org.full_name} عن فرصة "${opp.title}"`,
    related_id: application.volunteer_id,
    is_read: false,
  });

  // 11. Revalidate
  revalidatePath(`/dashboard/opportunities/${opp.id}`);

  return { error: null, success: true };
}

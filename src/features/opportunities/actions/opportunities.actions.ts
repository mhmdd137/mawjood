"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createOpportunitySchema,
  updateOpportunitySchema,
} from "@/lib/validations";
import { z } from "zod";

type OpportunityActionState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

// ─── Create Opportunity ───────────────────────────────────────────────────────

export async function createOpportunity(
  _prev: OpportunityActionState,
  formData: FormData,
): Promise<OpportunityActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_verified, location, skills")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "org") return { error: "غير مصرح" };
  if (!profile.is_verified)
    return {
      error: "حسابك قيد المراجعة — لا يمكنك نشر فرص حتى يتم التحقق من حسابك",
    };

  const raw = Object.fromEntries(formData);
  const parsed = createOpportunitySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: "يوجد خطأ في البيانات",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const {
    title,
    description,
    category,
    location,
    required_skills,
    time_slot,
    start_date,
    end_date,
    status,
  } = parsed.data;

  // Extra date validations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(start_date) < today)
    return { error: "تاريخ البداية يجب أن يكون اليوم أو في المستقبل" };
  if (new Date(end_date) <= new Date(start_date))
    return { error: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية" };

  const { data: opportunity, error } = await supabase
    .from("opportunities")
    .insert({
      org_id: user.id,
      title,
      description,
      category,
      location,
      required_skills,
      time_slot,
      start_date,
      end_date,
      status,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Notify matching volunteers if published
  if (status === "open" && opportunity) {
    const adminClient = createAdminClient();

    const { data: volunteers } = await adminClient
      .from("profiles")
      .select("id, skills, location")
      .eq("role", "volunteer");

    if (volunteers) {
      const matching = volunteers.filter((v) => {
        const skillMatch = (required_skills as string[]).some((s) =>
          (v.skills ?? []).includes(s),
        );
        const locationMatch = v.location === location;
        return skillMatch || locationMatch;
      });

      if (matching.length > 0) {
        await adminClient.from("notifications").insert(
          matching.map((v) => ({
            user_id: v.id,
            type: "new_opportunity",
            message: `فرصة جديدة تناسبك: "${title}". قدّم الآن!`,
            is_read: false,
            related_id: opportunity.id,
          })),
        );
      }
    }
  }

  revalidatePath("/dashboard/opportunities");
  redirect("/dashboard/opportunities");
}

// ─── Update Opportunity ───────────────────────────────────────────────────────

export async function updateOpportunity(
  opportunityId: string,
  _prev: OpportunityActionState,
  formData: FormData,
): Promise<OpportunityActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ownership check
  const { data: existing } = await supabase
    .from("opportunities")
    .select("org_id")
    .eq("id", opportunityId)
    .single();

  if (!existing || existing.org_id !== user.id) return { error: "غير مصرح" };

  const raw = Object.fromEntries(formData);

  const parsed = updateOpportunitySchema.safeParse(raw);

  

  if (!parsed.success) {
    return {
      error: "يوجد خطأ في البيانات",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { start_date, end_date } = parsed.data;
  if (start_date && end_date && new Date(end_date) <= new Date(start_date)) {
    return { error: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية" };
  }

  const { error } = await supabase
    .from("opportunities")
    .update(parsed.data)
    .eq("id", opportunityId);


  if (error) return { error: error.message }

  revalidatePath(`/dashboard/opportunities/${opportunityId}`);
  revalidatePath("/dashboard/opportunities");
  return { error: null, success: true };
}

// ─── Update Opportunity Status ────────────────────────────────────────────────

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  draft: ["open"],
  open: ["closed"],
  closed: ["completed"],
  completed: [],
};

export async function updateOpportunityStatus(
  opportunityId: string,
  newStatus: string,
): Promise<{ error: string | null }> {
  const schema = z.object({
    id: z.string().uuid(),
    status: z.enum(["draft", "open", "closed", "completed"]),
  });
  const parsed = schema.safeParse({ id: opportunityId, status: newStatus });
  if (!parsed.success) return { error: "بيانات غير صالحة" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("opportunities")
    .select("org_id, status")
    .eq("id", opportunityId)
    .single();

  if (!existing || existing.org_id !== user.id) return { error: "غير مصرح" };

  const allowed = ALLOWED_TRANSITIONS[existing.status] ?? [];
  if (!allowed.includes(newStatus))
    return {
      error: `لا يمكن تغيير الحالة من "${existing.status}" إلى "${newStatus}"`,
    };

  const { error } = await supabase
    .from("opportunities")
    .update({ status: newStatus })
    .eq("id", opportunityId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/opportunities");
  revalidatePath(`/dashboard/opportunities/${opportunityId}`);
  return { error: null };
}

// ─── Delete Opportunity ───────────────────────────────────────────────────────

export async function deleteOpportunity(
  opportunityId: string,
): Promise<{ error: string | null }> {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.safeParse({ id: opportunityId });
  if (!parsed.success) return { error: "معرّف غير صالح" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("opportunities")
    .select("org_id")
    .eq("id", opportunityId)
    .single();

  if (!existing || existing.org_id !== user.id) return { error: "غير مصرح" };

  const { error } = await supabase
    .from("opportunities")
    .delete()
    .eq("id", opportunityId);

  if (error) {
    if (error.code === "23503")
      return { error: "لا يمكن حذف هذه الفرصة لأن عليها تقديمات مسجّلة" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/opportunities");
  return { error: null };
}

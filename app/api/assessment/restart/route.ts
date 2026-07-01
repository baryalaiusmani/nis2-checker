import { auth } from "@/lib/auth";
import { resetAssessment } from "@/lib/assessment";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  await resetAssessment(session.user.id);
  return Response.json({ success: true });
}

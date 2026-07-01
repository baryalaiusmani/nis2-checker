import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json();
  const industry = typeof body.industry === "string" ? body.industry : "";
  const size = Number(body.size);
  const hasCloud = Boolean(body.hasCloud);
  const hasBackup = Boolean(body.hasBackup);
  const hasVPN = Boolean(body.hasVPN);
  const hasMFA = Boolean(body.hasMFA);

  if (!industry || !Number.isFinite(size) || size < 0) {
    return Response.json({ error: "Bitte alle Felder korrekt ausfüllen." }, { status: 400 });
  }

  await prisma.company.upsert({
    where: { userId: session.user.id },
    update: { industry, size, hasCloud, hasBackup, hasVPN, hasMFA },
    create: { userId: session.user.id, industry, size, hasCloud, hasBackup, hasVPN, hasMFA },
  });

  return Response.json({ success: true });
}

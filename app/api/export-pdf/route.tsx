import { renderToBuffer } from "@react-pdf/renderer";

import { getAssessmentWithAnswers } from "@/lib/assessment";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NIS2ReportDocument } from "@/lib/pdf";
import { calculateScore, generateTodos } from "@/lib/scoring";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const [user, assessment] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    getAssessmentWithAnswers(session.user.id),
  ]);

  const answers = assessment?.answers ?? [];
  if (answers.length === 0) {
    return Response.json({ error: "Noch kein Ergebnis vorhanden." }, { status: 400 });
  }

  const { score, status, byCategory } = calculateScore(answers);
  const todos = generateTodos(byCategory);

  const buffer = await renderToBuffer(
    <NIS2ReportDocument
      companyName={user?.name ?? "Unternehmen"}
      score={score}
      status={status}
      byCategory={byCategory}
      todos={todos}
      generatedAt={new Date().toLocaleDateString("de-DE")}
    />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="nis2-check.pdf"',
    },
  });
}

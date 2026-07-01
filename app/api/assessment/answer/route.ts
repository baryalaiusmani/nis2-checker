import { auth } from "@/lib/auth";
import { saveAnswer } from "@/lib/assessment";
import { getQuestion } from "@/lib/questions";

const VALID_VALUES = new Set(["ja", "teilweise", "nein"]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json();
  const questionNumber = Number(body.questionNumber);
  const value = typeof body.value === "string" ? body.value : "";

  if (!getQuestion(questionNumber) || !VALID_VALUES.has(value)) {
    return Response.json({ error: "Ungültige Antwort." }, { status: 400 });
  }

  const result = await saveAnswer(session.user.id, questionNumber, value);
  return Response.json({ success: true, ...result });
}

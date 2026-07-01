import { prisma } from "@/lib/db";
import { TOTAL_QUESTIONS } from "@/lib/questions";
import { calculateScore } from "@/lib/scoring";

export async function getAssessmentWithAnswers(userId: string) {
  return prisma.assessment.findUnique({
    where: { userId },
    include: { answers: true },
  });
}

export function assessmentStatusLabel(answeredCount: number): string {
  if (answeredCount === 0) return "Nicht gestartet";
  if (answeredCount >= TOTAL_QUESTIONS) return "Abgeschlossen";
  const percent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  return `${percent}% fertig`;
}

export async function saveAnswer(userId: string, questionNumber: number, value: string) {
  const assessment = await prisma.assessment.upsert({
    where: { userId },
    update: {},
    create: { userId, status: "in_progress" },
  });

  await prisma.answer.upsert({
    where: {
      assessmentId_questionNumber: {
        assessmentId: assessment.id,
        questionNumber,
      },
    },
    update: { value },
    create: { assessmentId: assessment.id, questionNumber, value },
  });

  const answers = await prisma.answer.findMany({ where: { assessmentId: assessment.id } });
  const { score } = calculateScore(answers);
  const status =
    answers.length >= TOTAL_QUESTIONS
      ? "abgeschlossen"
      : answers.length > 0
        ? "in_progress"
        : "nicht_gestartet";

  await prisma.assessment.update({
    where: { id: assessment.id },
    data: { score, status },
  });

  return { assessmentId: assessment.id, answeredCount: answers.length };
}

export async function resetAssessment(userId: string) {
  const assessment = await prisma.assessment.findUnique({ where: { userId } });
  if (!assessment) return;

  await prisma.answer.deleteMany({ where: { assessmentId: assessment.id } });
  await prisma.assessment.update({
    where: { id: assessment.id },
    data: { status: "nicht_gestartet", score: 0 },
  });
}

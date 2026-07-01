import { notFound } from "next/navigation";

import { ProgressBar } from "@/components/ProgressBar";
import { QuestionForm } from "@/components/QuestionForm";
import { Badge } from "@/components/ui/badge";
import { getAssessmentWithAnswers } from "@/lib/assessment";
import { auth } from "@/lib/auth";
import { TOTAL_QUESTIONS, getQuestion } from "@/lib/questions";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const questionNumber = Number(number);

  const question = getQuestion(questionNumber);
  if (!question) notFound();

  const session = await auth();
  const userId = session!.user.id;

  const assessment = await getAssessmentWithAnswers(userId);
  const existingAnswer = assessment?.answers.find((a) => a.questionNumber === questionNumber);
  const answeredCount = assessment?.answers.length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar current={questionNumber} total={TOTAL_QUESTIONS} />

      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">
          {question.category}
        </Badge>
        <h1 className="text-2xl font-semibold text-gray-900">{question.text}</h1>
      </div>

      <QuestionForm
        questionNumber={questionNumber}
        initialValue={existingAnswer?.value ?? null}
        isLast={questionNumber === TOTAL_QUESTIONS}
      />

      <p className="text-sm text-gray-500">
        {answeredCount} von {TOTAL_QUESTIONS} Fragen beantwortet.
      </p>
    </div>
  );
}

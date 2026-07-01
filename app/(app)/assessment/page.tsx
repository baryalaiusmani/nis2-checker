import { redirect } from "next/navigation";

import { getAssessmentWithAnswers } from "@/lib/assessment";
import { auth } from "@/lib/auth";
import { TOTAL_QUESTIONS } from "@/lib/questions";

export default async function AssessmentStartPage() {
  const session = await auth();
  const userId = session!.user.id;

  const assessment = await getAssessmentWithAnswers(userId);
  const answeredNumbers = new Set(assessment?.answers.map((a) => a.questionNumber) ?? []);

  let firstUnanswered = 1;
  for (let n = 1; n <= TOTAL_QUESTIONS; n++) {
    if (!answeredNumbers.has(n)) {
      firstUnanswered = n;
      break;
    }
    if (n === TOTAL_QUESTIONS) firstUnanswered = 1;
  }

  redirect(`/assessment/${firstUnanswered}`);
}

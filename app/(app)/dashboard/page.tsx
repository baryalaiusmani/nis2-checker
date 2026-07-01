import Link from "next/link";

import { AmpelCard } from "@/components/AmpelCard";
import { CategoryBar } from "@/components/CategoryBar";
import { TodoList } from "@/components/TodoList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssessmentWithAnswers } from "@/lib/assessment";
import { auth } from "@/lib/auth";
import { TOTAL_QUESTIONS } from "@/lib/questions";
import { calculateScore, generateTodos } from "@/lib/scoring";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const assessment = await getAssessmentWithAnswers(userId);
  const answers = assessment?.answers ?? [];

  if (answers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Noch kein Ergebnis</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-gray-600">
            Du hast den Fragebogen noch nicht gestartet. Beantworte die 30 Fragen, um dein
            NIS2-Ergebnis zu sehen.
          </p>
          <Button render={<Link href="/assessment" />} className="self-start">
            Fragebogen starten
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { score, status, byCategory } = calculateScore(answers);
  const todos = generateTodos(byCategory);
  const isComplete = answers.length >= TOTAL_QUESTIONS;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dein NIS2-Ergebnis</h1>
        {!isComplete && (
          <p className="mt-1 text-amber-700">
            Noch nicht vollständig: {answers.length} von {TOTAL_QUESTIONS} Fragen beantwortet.{" "}
            <Link href="/assessment" className="font-medium underline">
              Fragebogen fortsetzen
            </Link>
          </p>
        )}
      </div>

      <AmpelCard score={score} status={status} />

      <Card>
        <CardHeader>
          <CardTitle>Kategorien im Überblick</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {byCategory.map((cat) => (
            <CategoryBar key={cat.category} category={cat.category} score={cat.score} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deine To-Dos</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList todos={todos} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button render={<a href="/api/export-pdf" />}>Als PDF exportieren</Button>
        <Button variant="outline" render={<Link href="/dashboard/restart" />}>
          Neu anfangen
        </Button>
      </div>
    </div>
  );
}

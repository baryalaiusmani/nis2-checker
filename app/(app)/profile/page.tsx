import Link from "next/link";

import { CompanyForm } from "@/components/CompanyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { assessmentStatusLabel, getAssessmentWithAnswers } from "@/lib/assessment";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [company, assessment] = await Promise.all([
    prisma.company.findUnique({ where: { userId } }),
    getAssessmentWithAnswers(userId),
  ]);

  const answeredCount = assessment?.answers.length ?? 0;
  const statusLabel = assessmentStatusLabel(answeredCount);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Unternehmensprofil</h1>
        <p className="mt-1 text-gray-600">
          Diese Angaben helfen uns, den Fragebogen richtig einzuordnen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Über dein Unternehmen</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm
            defaultValues={
              company
                ? {
                    industry: company.industry,
                    size: company.size,
                    hasCloud: company.hasCloud,
                    hasBackup: company.hasBackup,
                    hasVPN: company.hasVPN,
                    hasMFA: company.hasMFA,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NIS2-Fragebogen</CardTitle>
          <CardDescription>Status: {statusLabel}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button render={<Link href="/assessment" />} className="self-start">
            {answeredCount === 0
              ? "Fragebogen starten"
              : answeredCount >= 30
                ? "Antworten ansehen"
                : "Fragebogen fortsetzen"}
          </Button>
          {answeredCount >= 30 && (
            <Button variant="outline" render={<Link href="/dashboard" />} className="self-start">
              Zum Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

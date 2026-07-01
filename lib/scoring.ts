import { NIS2_QUESTIONS } from "@/lib/questions";

export type AnswerValue = "ja" | "teilweise" | "nein";

export type AnswerLike = {
  questionNumber: number;
  value: string;
};

export type AmpelStatus = "gruen" | "gelb" | "rot";

export type CategoryScore = {
  category: string;
  score: number; // 0-100
};

export type ScoringResult = {
  score: number; // 0-100
  status: AmpelStatus;
  byCategory: CategoryScore[];
};

function pointsForValue(value: string, weight: number): number {
  if (value === "ja") return weight;
  if (value === "teilweise") return weight * 0.5;
  return 0;
}

export function calculateScore(answers: AnswerLike[]): ScoringResult {
  const answerByNumber = new Map(answers.map((a) => [a.questionNumber, a.value]));

  let totalPoints = 0;
  let maxPoints = 0;
  const categoryTotals = new Map<string, { points: number; max: number }>();

  for (const question of NIS2_QUESTIONS) {
    const value = answerByNumber.get(question.number);
    maxPoints += question.weight;

    const entry = categoryTotals.get(question.category) ?? { points: 0, max: 0 };
    entry.max += question.weight;

    if (value) {
      const points = pointsForValue(value, question.weight);
      totalPoints += points;
      entry.points += points;
    }

    categoryTotals.set(question.category, entry);
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const status: AmpelStatus = score >= 75 ? "gruen" : score >= 50 ? "gelb" : "rot";

  const byCategory: CategoryScore[] = Array.from(categoryTotals.entries()).map(
    ([category, { points, max }]) => ({
      category,
      score: max > 0 ? Math.round((points / max) * 100) : 0,
    })
  );

  return { score, status, byCategory };
}

export const AMPEL_CONFIG: Record<
  AmpelStatus,
  { label: string; text: string; bg: string; badge: string }
> = {
  gruen: {
    label: "Grün",
    text: "Sehr gut! Ihr seid auf gutem Kurs.",
    bg: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
  },
  gelb: {
    label: "Gelb",
    text: "Okay, aber noch Lücken zu schließen.",
    bg: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800",
  },
  rot: {
    label: "Rot",
    text: "Handlungsbedarf: Dringend arbeiten!",
    bg: "bg-red-500",
    badge: "bg-red-100 text-red-800",
  },
};

export const TODO_TEMPLATES: Record<string, string> = {
  Risikomanagement: "Schreibt eine Risikobewertung auf (1-2 Seiten reichen)",
  "Incident Management": "Erstellt einen Incident-Response-Plan",
  "Business Continuity": "Führt einen Backup-Test durch",
  Zugriffskontrolle: "Aktiviert Multi-Faktor-Authentifizierung für alle Systeme",
  Schulung: "Plant eine Sicherheits-Schulung für Mitarbeiter",
  Lieferkette: "Überprüft Verträge mit IT-Dienstleistern auf Security-Klauseln",
  Verschlüsselung: "Stellt sicher, dass alle Cloud-Verbindungen verschlüsselt sind",
  Dokumentation: "Schreibt eine Richtlinie zur Daten-Klassifizierung",
};

export function generateTodos(byCategory: CategoryScore[]): string[] {
  return [...byCategory]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((cat) => TODO_TEMPLATES[cat.category] ?? `Verbessert die Kategorie "${cat.category}"`);
}

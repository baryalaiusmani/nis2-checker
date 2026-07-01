import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const BULLETS = ["Nur 5 Minuten", "Kostenlos", "Sofort Ergebnis"];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          NIS2-Check für dein Unternehmen
        </h1>
        <p className="max-w-md text-lg text-gray-600">
          Finde in wenigen Minuten heraus, ob dein Unternehmen NIS2-konform ist – mit
          Ampel-Ergebnis und konkreter To-Do-Liste.
        </p>

        <Button size="lg" render={<Link href="/signup" />} className="h-11 px-6 text-base">
          Jetzt kostenlos starten
        </Button>

        <ul className="mt-6 flex flex-col gap-3 text-left sm:flex-row sm:gap-8">
          {BULLETS.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="size-5 text-blue-600" />
              {bullet}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RestartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRestart = async () => {
    setLoading(true);
    await fetch("/api/assessment/restart", { method: "POST" });
    router.push("/assessment");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Möchtest du nochmal anfangen?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-gray-600">
          Dabei werden alle deine bisherigen Antworten gelöscht und der Fragebogen beginnt von
          vorne.
        </p>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={handleRestart} disabled={loading}>
            {loading ? "Wird zurückgesetzt..." : "Ja, neu anfangen"}
          </Button>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Nein, zurück zum Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

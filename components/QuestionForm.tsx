"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OPTIONS = [
  { value: "ja", label: "Ja" },
  { value: "teilweise", label: "Teilweise" },
  { value: "nein", label: "Nein" },
];

export function QuestionForm({
  questionNumber,
  initialValue,
  isLast,
}: {
  questionNumber: number;
  initialValue: string | null;
  isLast: boolean;
}) {
  const [value, setValue] = useState<string | undefined>(initialValue ?? undefined);
  const [saving, setSaving] = useState(false);

  const save = async (nextValue: string) => {
    setSaving(true);
    try {
      await fetch("/api/assessment/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionNumber, value: nextValue }),
        keepalive: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    void save(nextValue);
  };

  const nextHref = isLast ? "/dashboard" : `/assessment/${questionNumber + 1}`;
  const backHref = questionNumber <= 1 ? "/profile" : `/assessment/${questionNumber - 1}`;

  return (
    <div className="flex flex-col gap-8">
      <RadioGroup value={value} onValueChange={handleChange} className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400 has-data-checked:border-blue-600 has-data-checked:bg-blue-50"
          >
            <RadioGroupItem value={option.value} id={`option-${option.value}`} />
            <Label htmlFor={`option-${option.value}`} className="cursor-pointer text-base">
              {option.label}
            </Label>
          </label>
        ))}
      </RadioGroup>

      <div className="flex items-center justify-between">
        <Button variant="outline" render={<Link href={backHref} />}>
          Zurück
        </Button>
        <Button render={<Link href={nextHref} />} disabled={saving}>
          {isLast ? "Zum Ergebnis" : "Weiter"}
        </Button>
      </div>
    </div>
  );
}

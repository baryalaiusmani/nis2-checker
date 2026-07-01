"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDUSTRIES } from "@/lib/constants";

export type CompanyFormValues = {
  industry: string;
  size: number;
  hasCloud: boolean;
  hasBackup: boolean;
  hasVPN: boolean;
  hasMFA: boolean;
};

const TOOL_FIELDS: { name: keyof CompanyFormValues; label: string }[] = [
  { name: "hasCloud", label: "Cloud-Tools (z.B. Microsoft 365, Google Workspace)" },
  { name: "hasBackup", label: "Backup-Lösung im Einsatz" },
  { name: "hasVPN", label: "VPN für Remote-Zugriff" },
  { name: "hasMFA", label: "Multi-Faktor-Authentifizierung (MFA)" },
];

export function CompanyForm({ defaultValues }: { defaultValues?: Partial<CompanyFormValues> }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    defaultValues: {
      industry: defaultValues?.industry ?? "",
      size: defaultValues?.size ?? undefined,
      hasCloud: defaultValues?.hasCloud ?? false,
      hasBackup: defaultValues?.hasBackup ?? false,
      hasVPN: defaultValues?.hasVPN ?? false,
      hasMFA: defaultValues?.hasMFA ?? false,
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    setServerError(null);
    const res = await fetch("/api/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, size: Number(data.size) }),
    });
    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error ?? "Speichern fehlgeschlagen.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="industry">Branche</Label>
        <Controller
          name="industry"
          control={control}
          rules={{ required: "Bitte wähle eine Branche." }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder="Branche auswählen" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.industry && <p className="text-sm text-red-600">{errors.industry.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="size">Anzahl Mitarbeiter</Label>
        <Input
          id="size"
          type="number"
          min={0}
          {...register("size", {
            required: "Bitte gib die Mitarbeiterzahl an.",
            valueAsNumber: true,
            min: { value: 0, message: "Muss mindestens 0 sein." },
          })}
        />
        {errors.size && <p className="text-sm text-red-600">{errors.size.message}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Label>Eingesetzte Tools</Label>
        {TOOL_FIELDS.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                {label}
              </label>
            )}
          />
        ))}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Wird gespeichert..." : "Profil speichern"}
      </Button>
    </form>
  );
}

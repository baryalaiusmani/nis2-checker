"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    setServerError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();

    if (!res.ok) {
      setServerError(body.error ?? "Registrierung fehlgeschlagen.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setServerError("Konto erstellt, aber Login fehlgeschlagen. Bitte manuell einloggen.");
      router.push("/login");
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Kostenlos registrieren</CardTitle>
        <CardDescription>Starte deinen NIS2-Check in 5 Minuten.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name", { required: "Bitte gib deinen Namen an." })}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", { required: "Bitte gib deine Email an." })}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Bitte gib ein Passwort an.",
                minLength: { value: 8, message: "Mindestens 8 Zeichen." },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Wird erstellt..." : "Kostenlos registrieren"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Schon ein Konto?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Anmelden
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

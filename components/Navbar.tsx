import Link from "next/link";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-blue-600">
          NIS2-Checker
        </Link>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Button variant="ghost" render={<Link href="/dashboard" />}>
                Dashboard
              </Button>
              <Button variant="ghost" render={<Link href="/profile" />}>
                Profil
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />}>
                Anmelden
              </Button>
              <Button render={<Link href="/signup" />}>Kostenlos starten</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

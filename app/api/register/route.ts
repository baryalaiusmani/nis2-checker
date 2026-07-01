import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!email || !password || !name) {
    return Response.json({ error: "Bitte alle Felder ausfüllen." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json(
      { error: "Das Passwort muss mindestens 8 Zeichen lang sein." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json(
      { error: "Für diese Email existiert bereits ein Konto." },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, name },
  });

  return Response.json({ success: true });
}

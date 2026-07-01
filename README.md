# NIS2-Checker

Webapp für kleine KMU-Geschäftsführer:innen, um in 5 Minuten herauszufinden, ob das Unternehmen
NIS2-konform ist. Ein 30-Fragen-Fragebogen (eine Frage pro Seite), Ampel-Ergebnis
(Grün/Gelb/Rot), automatisch generierte To-Do-Liste und PDF-Export.

## Tech-Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma ORM 7 + SQLite (lokal)
- NextAuth.js v5 (Credentials Provider: Email + Passwort)
- react-hook-form, @react-pdf/renderer

## Setup

```bash
npm install
cp .env.example .env
# In .env einen zufälligen AUTH_SECRET eintragen:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

npx prisma migrate dev
npm run dev
```

App läuft danach auf [http://localhost:3000](http://localhost:3000). Es wird keine externe
Datenbank benötigt — lokal wird eine SQLite-Datei (`dev.db`) verwendet.

## Scripts

```bash
npm run dev     # Dev-Server
npm run build   # Production-Build (inkl. Typecheck)
npm run start   # Production-Server
npm run lint    # ESLint
```

## Wichtige technische Hinweise

- **Sessions sind JWT-basiert, nicht DB-basiert.** NextAuths Credentials Provider unterstützt
  technisch keine Datenbank-Sessions — nur die JWT-Strategie. Das ist für den MVP unkritisch.
- **Route-Schutz läuft über `proxy.ts`** (nicht `middleware.ts` — in Next.js 16 wurde die
  Middleware-Konvention in "Proxy" umbenannt). Geschützt sind `/profile`, `/assessment` und
  `/dashboard`.
- **Die 30 NIS2-Fragen sind hardcoded** in `lib/questions.ts`, nicht in der Datenbank. Antworten
  referenzieren nur die Fragennummer.
- shadcn/ui-Komponenten basieren in diesem Projekt auf `@base-ui/react` (nicht Radix) und nutzen
  die `render`-Prop statt `asChild`, z. B. `<Button render={<Link href="/dashboard" />}>...`.

## Von SQLite auf Postgres/Supabase umstellen (für Deployment)

1. In `prisma/schema.prisma` den Datasource-Provider ändern:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. In Supabase ein neues Projekt anlegen und die Postgres-Connection-URL kopieren.
3. `DATABASE_URL` in den Vercel-Umgebungsvariablen (und lokal in `.env`) auf die Supabase-URL
   setzen.
4. Migrationen gegen die neue Datenbank anwenden:
   ```bash
   npx prisma migrate deploy
   ```

## Deployment (Vercel)

1. Repository zu GitHub pushen.
2. In Vercel importieren, Root-Verzeichnis `nis2-checker` wählen.
3. Umgebungsvariablen `DATABASE_URL` (Supabase, siehe oben) und `AUTH_SECRET` setzen.
4. Deploy.

## Projektstruktur

```
app/
  api/                 # Route Handlers (Register, Company, Assessment-Antworten, PDF-Export, Auth)
  (auth)/login, signup # Öffentliche Auth-Seiten
  (app)/profile, assessment, dashboard  # Geschützte Seiten (via proxy.ts)
  page.tsx             # Landingpage
lib/
  auth.ts              # NextAuth-Konfiguration
  db.ts                # Prisma-Client-Singleton
  questions.ts          # 30 NIS2-Fragen
  scoring.ts            # Scoring- und To-Do-Logik
  assessment.ts          # Antworten speichern, Status berechnen, Reset
  pdf.tsx               # PDF-Dokument-Layout
components/            # UI-Komponenten (Navbar, AmpelCard, QuestionForm, ...)
prisma/schema.prisma    # Datenmodell
```

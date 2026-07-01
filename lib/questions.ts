export type Question = {
  number: number;
  text: string;
  category: string;
  weight: number;
};

export const NIS2_QUESTIONS: Question[] = [
  // RISIKOMANAGEMENT (1-5)
  { number: 1, text: "Habt ihr eine schriftliche Risikobewertung für IT-Systeme?", category: "Risikomanagement", weight: 1 },
  { number: 2, text: "Werden Cyber-Risiken mindestens 1x pro Jahr überprüft?", category: "Risikomanagement", weight: 1 },
  { number: 3, text: "Habt ihr ein Risiko-Register (Excel/Tool mit Übersicht)?", category: "Risikomanagement", weight: 1 },
  { number: 4, text: "Werden Risiken nach Wahrscheinlichkeit & Auswirkung bewertet?", category: "Risikomanagement", weight: 1 },
  { number: 5, text: "Gibt es Maßnahmen, um die Top-3 Risiken zu reduzieren?", category: "Risikomanagement", weight: 1 },

  // INCIDENT MANAGEMENT (6-10)
  { number: 6, text: "Habt ihr einen schriftlichen Incident-Response-Plan?", category: "Incident Management", weight: 2 },
  { number: 7, text: "Weiß jeder im Team, wer bei Sicherheitsvorfällen anzurufen ist?", category: "Incident Management", weight: 1 },
  { number: 8, text: "Habt ihr schon mal einen Sicherheitsvorfall dokumentiert?", category: "Incident Management", weight: 1 },
  { number: 9, text: "Kennt ihr eure Meldepflicht bei Hacker-Angriffen (24h an Behörden)?", category: "Incident Management", weight: 2 },
  { number: 10, text: "Trainiert ihr regelmäßig Szenarien (z.B. Ransomware-Angriff)?", category: "Incident Management", weight: 1 },

  // BUSINESS CONTINUITY (11-15)
  { number: 11, text: "Habt ihr Backups aller kritischen Daten?", category: "Business Continuity", weight: 2 },
  { number: 12, text: "Werden Backups mindestens 1x pro Monat getestet?", category: "Business Continuity", weight: 2 },
  { number: 13, text: "Habt ihr ein Notfallhandbuch (wie läuft Geschäft ohne IT)?", category: "Business Continuity", weight: 1 },
  { number: 14, text: "Wissen kritische Mitarbeiter ihre Rollen im Notfall?", category: "Business Continuity", weight: 1 },
  { number: 15, text: "Könnt ihr mehrere Tage ohne IT-Systeme weiterarbeiten?", category: "Business Continuity", weight: 1 },

  // ZUGRIFFSKONTROLLE & MFA (16-20)
  { number: 16, text: "Nutzt ihr Multi-Faktor-Authentifizierung (z.B. Microsoft 365)?", category: "Zugriffskontrolle", weight: 2 },
  { number: 17, text: "Gibt es Passwort-Richtlinien (Länge, Komplexität, Änderung)?", category: "Zugriffskontrolle", weight: 1 },
  { number: 18, text: "Werden Admin-Konten separat verwaltet?", category: "Zugriffskontrolle", weight: 1 },
  { number: 19, text: "Werden Benutzerrechte mindestens 1x pro Jahr überprüft?", category: "Zugriffskontrolle", weight: 1 },
  { number: 20, text: "Werden Accounts von ausgeschiedenen Mitarbeitern zeitnah gesperrt?", category: "Zugriffskontrolle", weight: 1 },

  // SCHULUNG & SECURITY AWARENESS (21-25)
  { number: 21, text: "Bekommen Mitarbeiter Cyber-Security Schulung (mindestens 1x/Jahr)?", category: "Schulung", weight: 1 },
  { number: 22, text: "Wissen alle, wie man Phishing-Emails erkennt?", category: "Schulung", weight: 1 },
  { number: 23, text: "Habt ihr Regeln für Passwort-Management (kein Teilen)?", category: "Schulung", weight: 1 },
  { number: 24, text: "Gibt es Regeln für USB-Sticks / externe Geräte?", category: "Schulung", weight: 1 },
  { number: 25, text: "Sind alle sensiblen Daten gekennzeichnet (vertraulich)?", category: "Schulung", weight: 1 },

  // LIEFERKETTENSICHERHEIT & SONSTIGES (26-30)
  { number: 26, text: "Kennt ihr alle IT-Dienstleister, die Zugriff auf eure Daten haben?", category: "Lieferkette", weight: 1 },
  { number: 27, text: "Habt ihr Verträge mit euren IT-Dienstleistern (mit Security-Klauseln)?", category: "Lieferkette", weight: 1 },
  { number: 28, text: "Werden Dienstleister regelmäßig überprüft?", category: "Lieferkette", weight: 1 },
  { number: 29, text: "Nutzt ihr verschlüsselte Verbindungen für Cloud-Daten?", category: "Verschlüsselung", weight: 2 },
  { number: 30, text: "Gibt es schriftliche Richtlinien für Daten-Klassifizierung?", category: "Dokumentation", weight: 1 },
];

export const TOTAL_QUESTIONS = NIS2_QUESTIONS.length;

export function getQuestion(number: number): Question | undefined {
  return NIS2_QUESTIONS.find((q) => q.number === number);
}

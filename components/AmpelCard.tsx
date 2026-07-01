import { AMPEL_CONFIG, type AmpelStatus } from "@/lib/scoring";

export function AmpelCard({ score, status }: { score: number; status: AmpelStatus }) {
  const config = AMPEL_CONFIG[status];

  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl p-8 text-white ${config.bg}`}>
      <span className="text-sm font-medium uppercase tracking-wide opacity-90">
        Ampel: {config.label}
      </span>
      <span className="text-5xl font-bold">{score} / 100</span>
      <p className="text-center text-lg">{config.text}</p>
    </div>
  );
}

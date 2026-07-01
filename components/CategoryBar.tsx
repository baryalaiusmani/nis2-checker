import type { CategoryScore } from "@/lib/scoring";

function barColor(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export function CategoryBar({ category, score }: CategoryScore) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm text-gray-700">
        <span>{category}</span>
        <span>{score}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

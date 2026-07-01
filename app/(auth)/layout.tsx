import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <Link href="/" className="mb-8 text-2xl font-bold text-blue-600">
        NIS2-Checker
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

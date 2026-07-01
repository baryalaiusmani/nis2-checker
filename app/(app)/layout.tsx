import { Navbar } from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">{children}</main>
    </div>
  );
}

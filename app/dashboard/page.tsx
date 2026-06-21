import { Suspense } from "react";
import { DashboardShell } from "@/components/DashboardShell";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-white/40">Loading console…</div>}>
      <DashboardShell />
    </Suspense>
  );
}

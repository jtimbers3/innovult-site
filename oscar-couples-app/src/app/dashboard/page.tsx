import { SiteNav } from "@/components/site-nav";

export default function DashboardPage() {
  return (
    <div>
      <SiteNav />
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-400">Current rank</p><p className="text-3xl font-bold">#2</p></div>
        <div className="card"><p className="text-sm text-slate-400">Ballot completion</p><p className="text-3xl font-bold">78%</p></div>
        <div className="card"><p className="text-sm text-slate-400">All-time wins</p><p className="text-3xl font-bold">1</p></div>
      </section>
    </div>
  );
}

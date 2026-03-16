import { SiteNav } from "@/components/site-nav";

export default function StandingsPage() {
  return (
    <div className="space-y-4">
      <SiteNav />
      <h1 className="text-2xl font-semibold">All-Time Standings</h1>
      <div className="card">Top team: Glitter & Gold — 2 first-place finishes, 91% avg accuracy</div>
    </div>
  );
}

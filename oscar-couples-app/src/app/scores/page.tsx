import { SiteNav } from "@/components/site-nav";

export default function ScoresPage() {
  return (
    <div className="space-y-4">
      <SiteNav />
      <h1 className="text-2xl font-semibold">Live Scores</h1>
      <div className="card">
        <ol className="space-y-2">
          <li>1. Glitter & Gold — 42 pts</li>
          <li>2. Popcorn Prophets — 38 pts</li>
          <li>3. Red Carpet Rebels — 35 pts</li>
        </ol>
      </div>
    </div>
  );
}

import { SiteNav } from "@/components/site-nav";
import { db } from "@/lib/db";

export default async function BallotPage({ params }: { params: { year: string } }) {
  const awardsYear = await db.awardsYear.findUnique({
    where: { year: Number(params.year) },
    include: { categories: { include: { nominees: true }, orderBy: { displayOrder: "asc" } } }
  });

  if (!awardsYear) return <div>Year not found</div>;

  return (
    <div className="space-y-4">
      <SiteNav />
      <h1 className="text-2xl font-semibold">{awardsYear.title} Ballot</h1>
      <p className="text-sm text-slate-400">Locks at {new Date(awardsYear.ballotLockAt).toLocaleString()}</p>
      {awardsYear.categories.map((cat) => (
        <div key={cat.id} className="card">
          <p className="font-medium">{cat.name}</p>
          <p className="text-xs text-slate-400">{cat.points} points</p>
          <ul className="mt-2 space-y-1">
            {cat.nominees.map((nom) => (
              <li key={nom.id} className="rounded bg-slate-800 px-3 py-2">{nom.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

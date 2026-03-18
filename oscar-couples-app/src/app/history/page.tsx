import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { db } from "@/lib/db";

type HistoryPageProps = {
  searchParams?: { year?: string };
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = searchParams ?? {};

  let years: Array<{ id: string; year: number; title: string }> = [];
  let selectedAwardsYear:
    | {
        year: number;
        title: string;
        categories: Array<{
          id: string;
          name: string;
          nominees: Array<{ id: string; name: string }>;
          officialResult: { nomineeId: string } | null;
        }>;
      }
    | null = null;
  let dbSetupError = false;

  try {
    years = await db.awardsYear.findMany({
      orderBy: { year: "desc" },
      select: { id: true, year: true, title: true }
    });

    const selectedYear = Number(params.year) || years[0]?.year;

    selectedAwardsYear = selectedYear
      ? await db.awardsYear.findUnique({
          where: { year: selectedYear },
          select: {
            year: true,
            title: true,
            categories: {
              orderBy: { displayOrder: "asc" },
              select: {
                id: true,
                name: true,
                nominees: { orderBy: { name: "asc" }, select: { id: true, name: true } },
                officialResult: { select: { nomineeId: true } }
              }
            }
          }
        })
      : null;
  } catch {
    dbSetupError = true;
  }

  return (
    <div className="space-y-6">
      <SiteNav />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Oscar History</h1>
        <p className="text-sm text-slate-300">Click a year to browse all categories, nominees, and winners.</p>
      </div>

      {dbSetupError ? (
        <div className="card space-y-2">
          <p className="font-medium text-amber-200">History needs database setup first.</p>
          <p className="text-sm text-slate-300">
            Add <code className="rounded bg-slate-800 px-1.5 py-0.5">DATABASE_URL</code> in
            <code className="ml-1 rounded bg-slate-800 px-1.5 py-0.5">oscar-couples-app/.env</code>, then run Prisma migrate/seed.
          </p>
          <p className="text-xs text-slate-400">
            Use: <code className="rounded bg-slate-800 px-1.5 py-0.5">cp .env.example .env</code>,
            <code className="ml-1 rounded bg-slate-800 px-1.5 py-0.5">npx prisma migrate dev</code>,
            <code className="ml-1 rounded bg-slate-800 px-1.5 py-0.5">npm run prisma:seed</code>
          </p>
        </div>
      ) : years.length === 0 ? (
        <div className="card">No awards years available yet.</div>
      ) : (
        <>
          <div className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Browse by Year</h2>
            <div className="flex flex-wrap gap-2">
              {years.map((item) => {
                const isActive = item.year === selectedAwardsYear?.year;
                return (
                  <Link
                    key={item.id}
                    href={`/history?year=${item.year}`}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      isActive
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                    }`}
                  >
                    {item.year}
                  </Link>
                );
              })}
            </div>
          </div>

          {selectedAwardsYear ? (
            <div className="card space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedAwardsYear.title}</h2>
                <p className="text-sm text-slate-300">{selectedAwardsYear.year} nominees and winners by category</p>
              </div>

              <div className="space-y-4">
                {selectedAwardsYear.categories.map((category) => (
                  <section key={category.id} className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <ul className="mt-3 space-y-2">
                      {category.nominees.map((nominee) => {
                        const isWinner = nominee.id === category.officialResult?.nomineeId;
                        return (
                          <li
                            key={nominee.id}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              isWinner
                                ? "border-amber-300/70 bg-amber-300/10 text-amber-100"
                                : "border-slate-700/70 bg-slate-900/50 text-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{nominee.name}</span>
                              {isWinner && (
                                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-950">
                                  Winner
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {!category.officialResult && (
                      <p className="mt-2 text-xs text-slate-400">Winner not recorded yet.</p>
                    )}
                  </section>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">No history available for that year.</div>
          )}
        </>
      )}
    </div>
  );
}

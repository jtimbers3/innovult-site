import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { OSCAR_HISTORY } from "@/lib/oscar-history-data";

type HistoryPageProps = {
  searchParams?: { year?: string };
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = searchParams ?? {};

  const years = OSCAR_HISTORY.map(({ id, year, title }) => ({ id, year, title }));
  const selectedYear = Number(params.year) || years[0]?.year;
  const selectedAwardsYear = OSCAR_HISTORY.find((item) => item.year === selectedYear) ?? OSCAR_HISTORY[0] ?? null;

  return (
    <div className="space-y-6">
      <SiteNav />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Oscar History</h1>
        <p className="text-sm text-slate-300">Click a year to browse all categories, nominees, and winners.</p>
      </div>

      {years.length === 0 ? (
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
                        const isWinner = Boolean(nominee.winner);
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

import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { db } from "@/lib/db";

type HistoryPageProps = {
  searchParams?: { year?: string };
};

type CategoryView = {
  id: string;
  name: string;
  nominees: Array<{ id: string; name: string }>;
  officialResult: { nomineeId: string } | null;
};

type YearView = {
  id: string;
  year: number;
  title: string;
  categories: CategoryView[];
};

const fallbackHistory: YearView[] = [
  {
    id: "fallback-2025",
    year: 2025,
    title: "97th Academy Awards",
    categories: [
      {
        id: "fallback-best-picture",
        name: "Best Picture",
        nominees: [
          { id: "anora", name: "Anora" },
          { id: "the-brutalist", name: "The Brutalist" },
          { id: "conclave", name: "Conclave" }
        ],
        officialResult: { nomineeId: "anora" }
      },
      {
        id: "fallback-best-director",
        name: "Best Director",
        nominees: [
          { id: "sean-baker", name: "Sean Baker" },
          { id: "brady-corbet", name: "Brady Corbet" },
          { id: "coralie-fargeat", name: "Coralie Fargeat" }
        ],
        officialResult: { nomineeId: "sean-baker" }
      },
      {
        id: "fallback-best-actress",
        name: "Best Actress",
        nominees: [
          { id: "mikey-madison", name: "Mikey Madison" },
          { id: "demi-moore", name: "Demi Moore" },
          { id: "fernanda-torres", name: "Fernanda Torres" }
        ],
        officialResult: { nomineeId: "mikey-madison" }
      },
      {
        id: "fallback-best-actor",
        name: "Best Actor",
        nominees: [
          { id: "adrien-brody", name: "Adrien Brody" },
          { id: "timothee-chalamet", name: "Timothée Chalamet" },
          { id: "colman-domingo", name: "Colman Domingo" }
        ],
        officialResult: { nomineeId: "adrien-brody" }
      },
      {
        id: "fallback-best-animated-feature",
        name: "Best Animated Feature",
        nominees: [
          { id: "flow", name: "Flow" },
          { id: "inside-out-2", name: "Inside Out 2" },
          { id: "the-wild-robot", name: "The Wild Robot" }
        ],
        officialResult: { nomineeId: "flow" }
      }
    ]
  }
];

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = searchParams ?? {};

  let years: Array<{ id: string; year: number; title: string }> = [];
  let selectedAwardsYear: YearView | null = null;
  let usingFallback = false;

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
            id: true,
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
    usingFallback = true;
    years = fallbackHistory.map(({ id, year, title }) => ({ id, year, title }));
    const selectedYear = Number(params.year) || years[0]?.year;
    selectedAwardsYear = fallbackHistory.find((item) => item.year === selectedYear) ?? fallbackHistory[0] ?? null;
  }

  return (
    <div className="space-y-6">
      <SiteNav />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Oscar History</h1>
        <p className="text-sm text-slate-300">Click a year to browse all categories, nominees, and winners.</p>
      </div>

      {usingFallback && (
        <div className="card border-amber-400/40 bg-amber-400/5 text-sm text-amber-100">
          Showing built-in sample history because the database is not connected yet.
        </div>
      )}

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

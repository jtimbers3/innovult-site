import Link from "next/link";
import { Trophy, Users, Sparkles, History, ShieldCheck, Gamepad2 } from "lucide-react";

const highlights = [
  {
    icon: Trophy,
    title: "Live scoring on Oscar night",
    body: "Watch points update as hosts enter official winners, with standings that change in real time."
  },
  {
    icon: Users,
    title: "Built for couples + friend groups",
    body: "Create your couple team, join a private watch-party group, and battle for annual bragging rights."
  },
  {
    icon: History,
    title: "Track your dynasty",
    body: "View year-by-year champions, all-time points, win streaks, and who dominates long term."
  },
  {
    icon: Gamepad2,
    title: "Party modes + trivia",
    body: "Play with optional party rules and Oscar trivia to keep every category fun between announcements."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-fuchsia-700/30 via-indigo-700/20 to-slate-900 p-6 md:p-10">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/20 px-3 py-1 text-xs text-champagne">
            <Sparkles className="h-3.5 w-3.5" /> Event-night ready MVP
          </div>

          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Predict the Oscars together.
            <span className="text-gold"> Win the watch party.</span>
          </h1>

          <p className="text-base text-slate-200 md:text-lg">
            A polished private game for couples and friend groups: submit ballots before lock, score live during the ceremony, and track standings across every awards year.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/signup" className="rounded-full bg-gold px-5 py-2 font-medium text-black hover:bg-yellow-300">
              Create account
            </Link>
            <Link href="/login" className="rounded-full border border-slate-400 bg-slate-900/40 px-5 py-2 font-medium hover:bg-slate-800">
              Sign in
            </Link>
            <Link href="/history" className="rounded-full border border-gold/60 bg-black/30 px-5 py-2 font-medium text-champagne hover:bg-gold/10">
              Browse Oscar history
            </Link>
          </div>

          <div className="grid gap-3 pt-3 text-sm md:grid-cols-3">
            <div className="rounded-xl border border-slate-500/40 bg-black/25 px-3 py-2">✅ Private groups</div>
            <div className="rounded-xl border border-slate-500/40 bg-black/25 px-3 py-2">⏰ Ballot lock deadlines</div>
            <div className="rounded-xl border border-slate-500/40 bg-black/25 px-3 py-2">🏆 Year + all-time standings</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="card p-5">
              <div className="mb-3 inline-flex rounded-xl bg-gold/15 p-2 text-gold">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-300">{item.body}</p>
            </article>
          );
        })}
      </section>

      <section className="card bg-gradient-to-r from-slate-900 to-indigo-950/60 p-6">
        <h3 className="text-xl font-semibold">How it works</h3>
        <ol className="mt-3 grid gap-3 text-sm text-slate-200 md:grid-cols-4">
          <li><span className="font-semibold text-gold">1.</span> Create your account + couple team</li>
          <li><span className="font-semibold text-gold">2.</span> Join a private watch-party group</li>
          <li><span className="font-semibold text-gold">3.</span> Submit picks before lock time</li>
          <li><span className="font-semibold text-gold">4.</span> Score live + crown your champions</li>
        </ol>
      </section>

      <section className="card border-gold/30 bg-gradient-to-r from-amber-500/10 to-fuchsia-500/10 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Host-ready and admin-controlled</h3>
            <p className="mt-1 text-sm text-slate-300">
              Hosts can enter official winners manually, trigger score recalculation, and keep the game fair and smooth.
            </p>
          </div>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm hover:bg-gold/10">
            <ShieldCheck className="h-4 w-4" /> View admin tools
          </Link>
        </div>
      </section>
    </div>
  );
}

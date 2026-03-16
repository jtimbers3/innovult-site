import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard"],
  ["Team", "/teams"],
  ["Groups", "/groups"],
  ["Ballot", "/ballot/2025"],
  ["Scores", "/scores"],
  ["History", "/history"],
  ["Standings", "/standings"],
  ["Trivia", "/trivia"],
  ["Admin", "/admin"]
];

export function SiteNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="rounded-full bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700">
          {label}
        </Link>
      ))}
    </nav>
  );
}

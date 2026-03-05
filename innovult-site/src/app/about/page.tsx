export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight">About Innovult LLC</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Innovult is a modernization-focused consulting partner serving federal agencies and prime contractors.
          We combine execution discipline with practical technology delivery to move mission outcomes forward.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Mission</h2>
          <p className="mt-2 text-slate-700">Deliver measurable improvement in federal technology and business operations.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Approach</h2>
          <p className="mt-2 text-slate-700">Lean teams, clear accountability, and outcome-first planning from day one.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Focus</h2>
          <p className="mt-2 text-slate-700">ERP, BI, financial process transformation, AI use cases, and PMO delivery support.</p>
        </article>
      </section>
    </div>
  );
}

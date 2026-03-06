export default function AboutPage() {
  const expertise = [
    "Federal ERP modernization (SAP, Oracle, and related platforms)",
    "Federal financial management transformation",
    "IT program and project management",
    "System implementation oversight and vendor coordination",
    "Data integration and enterprise reporting",
    "Business process modernization",
    "Change management and user adoption",
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#0A3A66]">
          Senior Expertise for Federal ERP Modernization
        </h1>
        <p className="mt-4 max-w-4xl text-lg text-slate-700">
          innovult provides senior-level expertise supporting federal ERP and financial system modernization
          programs. We work with agencies and prime contractors delivering complex transformations involving
          enterprise platforms such as SAP and Oracle.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">Built for complex federal programs</h2>
          <p className="mt-2 text-slate-700">
            Founded in 2025, innovult was created to provide experienced support for federal modernization
            initiatives involving ERP, financial systems, and enterprise data platforms.
          </p>
          <p className="mt-3 text-slate-700">
            Our work spans the lifecycle of these programs—from early strategy and planning to implementation
            oversight, change management, and operational transition.
          </p>
        </article>

        <article className="rounded-xl border border-[#0A3A66]/25 bg-[#0A3A66]/5 p-6">
          <h2 className="text-lg font-semibold text-[#0A3A66]">Program credibility</h2>
          <p className="mt-2 text-slate-700">
            Our experience includes supporting large federal ERP modernization efforts involving financial
            management, procurement, and enterprise data platforms.
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-[#0A3A66]">innovult provides expertise in</h2>
        <ul className="mt-4 space-y-2 text-slate-700">
          {expertise.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#0A3A66]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-slate-700">
          Our approach is simple: bring experienced leadership, focus on practical execution, and help agencies
          deliver results on complex programs.
        </p>
        <p className="mt-3 text-slate-700">
          innovult works alongside federal agencies and prime contractors, providing experienced support where
          additional expertise strengthens program delivery.
        </p>
      </section>
    </div>
  );
}

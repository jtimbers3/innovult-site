import Image from "next/image";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function AboutPage() {
  const expertise = [
    "Federal ERP modernization (Oracle, SAP, and related platforms)",
    "Federal financial management transformation",
    "IT program and project management",
    "System implementation oversight and vendor coordination",
    "Data integration and enterprise reporting",
    "Business process modernization",
    "Change management and user adoption",
  ];

  return (
    <div className="space-y-8">
      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-4xl">
            Senior Expertise for Federal ERP Modernization
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
            <span className="font-bold tracking-tight">
              <span className="text-[#164067]">innov</span>
              <span className="text-[#65DCDF]">ult</span>
            </span>{" "}
            provides senior-level expertise supporting federal ERP and financial system modernization programs. We work
            with agencies and prime contractors delivering complex transformations involving enterprise platforms such
            as Oracle and SAP.
          </p>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
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
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0A3A66]">innovult provides expertise in</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 marker:text-[#0A3A66]">
            {expertise.map((item) => (
              <li key={item} className="leading-8">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
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
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[280px_1fr] md:gap-8">
            <div className="mx-auto w-full max-w-[280px]">
              <Image
                src="/james-founder.jpg"
                alt="James Timbers, Founder and Principal of innovult"
                width={320}
                height={320}
                className="aspect-[4/5] w-full rounded-xl object-cover object-center shadow-sm sm:aspect-auto"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0A3A66]">Founder and Principal</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">James Timbers</h2>

              <p className="mt-4 text-base leading-7 text-slate-700">
                James is the Founder and Principal of innovult, a consulting firm focused on supporting federal ERP
                modernization and financial management transformation initiatives.
              </p>

              <p className="mt-3 text-base leading-7 text-slate-700">
                He brings more than 15 years of experience supporting large-scale government technology programs,
                including enterprise financial system implementations, program management offices, and cross-agency
                modernization initiatives.
              </p>

              <p className="mt-3 text-base leading-7 text-slate-700">
                James works with federal agencies and prime contractors to support the planning, implementation, and
                delivery of ERP and financial systems across complex operational environments. His experience includes
                financial management modernization, procurement integration, enterprise reporting, and program
                governance for large federal initiatives.
              </p>

              <p className="mt-3 text-base leading-7 text-slate-700">
                He also explores the practical use of emerging technologies such as artificial intelligence,
                automation, and advanced analytics to enhance program delivery, improve analysis, and support more
                informed decision-making across complex modernization efforts.
              </p>

              <p className="mt-3 text-base leading-7 text-slate-700">
                His approach emphasizes disciplined execution, practical program delivery, and clear alignment between
                technology, financial operations, and mission outcomes.
              </p>
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </div>
  );
}

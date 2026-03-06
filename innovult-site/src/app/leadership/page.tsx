import Image from "next/image";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function LeadershipPage() {
  const expertise = [
    "Federal ERP modernization programs",
    "Financial systems implementation (SAP, Oracle)",
    "IT program and PMO leadership",
    "Federal financial management operations",
    "Data and reporting platforms",
    "AI-enabled analysis and automation (RPA)",
    "ERP implementation governance",
  ];

  return (
    <div className="space-y-8">
      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-4xl">Leadership</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
            innovult is led by experienced practitioners focused on federal ERP modernization, financial system
            transformation, and delivery of complex technology programs across government environments.
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
                priority
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

      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-[#0A3A66]">Areas of Expertise</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 marker:text-[#0A3A66]">
            {expertise.map((item) => (
              <li key={item} className="leading-8">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </FadeInOnScroll>
    </div>
  );
}

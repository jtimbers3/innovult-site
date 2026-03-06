import Image from "next/image";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function LeadershipPage() {
  return (
    <div className="space-y-8">
      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-4xl">Leadership</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
            innovult is led by experienced practitioners focused on federal ERP, financial systems modernization,
            and delivery outcomes in complex government environments.
          </p>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[280px_1fr] md:gap-8">
            <div className="mx-auto w-full max-w-[280px]">
              <Image
                src="/james-founder.jpg"
                alt="James, Founder and Principal of innovult"
                width={320}
                height={320}
                className="aspect-[4/5] w-full rounded-xl object-cover object-center shadow-sm sm:aspect-auto"
                priority
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0A3A66]">Founder and Principal</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">James</h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                James leads innovult with a practical, execution-first approach to federal technology and financial
                modernization. He focuses on helping agencies and prime contractors deliver measurable outcomes across
                ERP modernization, program delivery, and enterprise transformation initiatives.
              </p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                His leadership emphasizes disciplined delivery, clear stakeholder alignment, and risk-aware execution
                for mission-critical programs.
              </p>
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </div>
  );
}
